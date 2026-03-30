require('dotenv').config({ path: '.env.local' });

const {
  Client,
  GatewayIntentBits,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  MessageFlags
} = require('discord.js');
const { createWriteStream } = require('fs');
const { mkdir, writeFile } = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const MEDIA_CHANNEL_ID = process.env.DISCORD_MEDIA_CHANNEL_ID || '1484953248560447703';

// Use APP_DIR for DigitalOcean deployment
const BASE_DIR = process.env.APP_DIR || process.cwd();
const PUBLIC_MEDIA_DIR = path.join(BASE_DIR, 'public', 'uploads');
const METADATA_DIR = path.join(BASE_DIR, 'public', 'media-metadata');

// Session timeout (15 minutes)
const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

if (!DISCORD_TOKEN) {
  console.error('❌ DISCORD_BOT_TOKEN not found in .env.local');
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT SETUP
// ═══════════════════════════════════════════════════════════════════════════════

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Store upload sessions
const uploadSessions = new Map();

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function generateCaption(filename) {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\d+/g, '')
    .replace(/\s+/g, ' ')
    .trim() || 'Community photo';
}

function isInteractionExpired(error) {
  return error?.code === 10062 || 
         error?.code === 40060 ||
         /Unknown interaction/i.test(String(error));
}

async function safeReply(interaction, payload) {
  try {
    const options = typeof payload === 'string'
      ? { content: payload, flags: MessageFlags.Ephemeral }
      : { ...payload, flags: payload.flags ?? MessageFlags.Ephemeral };

    if (interaction.replied || interaction.deferred) {
      return await interaction.followUp(options);
    } else {
      return await interaction.reply(options);
    }
  } catch (err) {
    if (!isInteractionExpired(err)) {
      console.error('safeReply error:', err.message);
    }
  }
}

async function safeDeferReply(interaction) {
  try {
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      return true;
    }
  } catch (err) {
    if (!isInteractionExpired(err)) {
      console.error('deferReply error:', err.message);
    }
  }
  return false;
}

function scheduleSessionCleanup(timestamp) {
  setTimeout(() => {
    if (uploadSessions.has(timestamp)) {
      uploadSessions.delete(timestamp);
      console.log(`🧹 Session ${timestamp} cleaned up`);
    }
  }, SESSION_TIMEOUT_MS);
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOT READY
// ═══════════════════════════════════════════════════════════════════════════════

client.once(Events.ClientReady, async () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🤖 Care4ME Discord Bot - READY');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Bot:      ${client.user.tag}`);
  console.log(`  Channel:  ${MEDIA_CHANNEL_ID}`);
  console.log(`  Uploads:  ${PUBLIC_MEDIA_DIR}`);
  console.log(`  Metadata: ${METADATA_DIR}`);
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Ensure directories exist
  try {
    await mkdir(PUBLIC_MEDIA_DIR, { recursive: true });
    await mkdir(METADATA_DIR, { recursive: true });
    console.log('✅ Directories verified');
  } catch (err) {
    console.error('❌ Directory creation failed:', err.message);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE HANDLER - Image Upload Detection
// ═══════════════════════════════════════════════════════════════════════════════

client.on(Events.MessageCreate, async (message) => {
  if (message.channelId !== MEDIA_CHANNEL_ID) return;
  if (message.author.bot) return;

  const images = [...message.attachments.values()].filter(
    att => att.contentType?.startsWith('image')
  );

  if (images.length === 0) return;

  console.log(`\n📸 Upload from ${message.author.username}: ${images.length} image(s)`);

  try {
    for (const attachment of images) {
      console.log(`   Processing: ${attachment.name}`);

      // Download image
      const response = await fetch(attachment.url);
      if (!response.ok) throw new Error(`Download failed: ${response.status}`);
      
      const buffer = Buffer.from(await response.arrayBuffer());
      const timestamp = Date.now();

      // Save original
      const baseFilename = `${timestamp}-${attachment.name}`;
      const filepath = path.join(PUBLIC_MEDIA_DIR, baseFilename);
      
      const writeStream = createWriteStream(filepath);
      writeStream.write(buffer);
      writeStream.end();

      // Create web-optimized version
      await sharp(buffer)
        .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(path.join(PUBLIC_MEDIA_DIR, `${timestamp}-web.webp`));

      // Create thumbnail
      await sharp(buffer)
        .resize(400, 300, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(path.join(PUBLIC_MEDIA_DIR, `${timestamp}-thumb.webp`));

      console.log(`   ✅ Saved: ${baseFilename}`);

      // Auto-caption from message or filename
      const autoCaption = message.content.trim() || generateCaption(attachment.name);

      // Store session
      uploadSessions.set(timestamp, {
        timestamp,
        filename: baseFilename,
        originalName: attachment.name,
        filesize: attachment.size,
        autoCaption,
        userCaption: autoCaption,
        destination: null,
        category: null,
        platforms: [],
        userId: message.author.id,
        username: message.author.username,
        messageId: message.id
      });

      // Schedule cleanup
      scheduleSessionCleanup(timestamp);

      // Show destination menu
      const destinationRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`dest_${timestamp}`)
          .setPlaceholder('📂 Where should this image go?')
          .addOptions([
            { label: '🖼️ Gallery', value: 'gallery', description: 'Add to photo gallery' },
            { label: '📰 Campaign', value: 'campaign', description: 'Add to campaigns page' },
            { label: '👥 Team', value: 'team', description: 'Add to team page' },
            { label: '📱 Social Only', value: 'social', description: 'Post to social media only' }
          ])
      );

      const embed = new EmbedBuilder()
        .setColor(0x2BA5D7)
        .setTitle('📸 Image Uploaded!')
        .setThumbnail(attachment.url)
        .addFields(
          { name: '📄 File', value: attachment.name, inline: true },
          { name: '📏 Size', value: `${(attachment.size / 1024).toFixed(1)} KB`, inline: true },
          { name: '✏️ Caption', value: `"${autoCaption}"`, inline: false }
        )
        .setFooter({ text: 'Step 1 of 4: Choose destination' });

      await message.reply({ embeds: [embed], components: [destinationRow] });
    }
  } catch (error) {
    console.error('❌ Upload error:', error);
    await message.reply('❌ Failed to process image. Please try again.');
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTION HANDLER - All menus, buttons, modals in ONE listener
// ═══════════════════════════════════════════════════════════════════════════════

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    // ─────────────────────────────────────────────────────────────────────────
    // DESTINATION SELECT
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('dest_')) {
      const timestamp = parseInt(interaction.customId.split('_')[1]);
      const session = uploadSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired. Please upload the image again.');
      }

      session.destination = interaction.values[0];
      console.log(`   📂 Destination: ${session.destination}`);

      // Build category options based on destination
      let categoryOptions = [];
      
      if (session.destination === 'gallery') {
        categoryOptions = [
          { label: '📸 General Gallery', value: 'General Gallery' },
          { label: '❤️ Success Stories', value: 'Success Stories' },
          { label: '🎉 Event: Food Drive 2026', value: 'Event: Food Drive 2026' },
          { label: '🎉 Event: Spring Health Fair', value: 'Event: Spring Health Fair' },
          { label: '🎉 Event: Winter Formal', value: 'Event: Winter Formal' }
        ];
      } else if (session.destination === 'campaign') {
        categoryOptions = [
          { label: '🎓 Education', value: 'education' },
          { label: '⚕️ Healthcare', value: 'healthcare' },
          { label: '👴 Elderly Care', value: 'elderly' },
          { label: '👶 Children', value: 'children' },
          { label: '🏥 Emergency Relief', value: 'emergency' }
        ];
      } else if (session.destination === 'team') {
        categoryOptions = [
          { label: '👔 Staff', value: 'staff' },
          { label: '🤝 Volunteers', value: 'volunteers' },
          { label: '🏆 Board Members', value: 'board' }
        ];
      } else if (session.destination === 'social') {
        categoryOptions = [
          { label: '📢 Announcement', value: 'announcement' },
          { label: '💡 Tip/Info', value: 'tip' },
          { label: '❤️ Story', value: 'story' }
        ];
      }

      const categoryRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`cat_${timestamp}`)
          .setPlaceholder('🏷️ Select a category')
          .addOptions(categoryOptions)
      );

      const embed = new EmbedBuilder()
        .setColor(0x7CB342)
        .setTitle(`📂 Destination: ${session.destination.toUpperCase()}`)
        .addFields(
          { name: '✏️ Caption', value: `"${session.autoCaption}"`, inline: false }
        )
        .setFooter({ text: 'Step 2 of 4: Choose category' });

      await safeReply(interaction, { embeds: [embed], components: [categoryRow] });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CATEGORY SELECT
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('cat_')) {
      const timestamp = parseInt(interaction.customId.split('_')[1]);
      const session = uploadSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired. Please upload again.');
      }

      session.category = interaction.values[0];
      console.log(`   🏷️ Category: ${session.category}`);

      // Show caption edit modal
      const modal = new ModalBuilder()
        .setCustomId(`caption_${timestamp}`)
        .setTitle('Edit Caption')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('caption_input')
              .setLabel('Caption (describe this image)')
              .setStyle(TextInputStyle.Paragraph)
              .setValue(session.autoCaption)
              .setMaxLength(500)
              .setRequired(true)
          )
        );

      await interaction.showModal(modal);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CAPTION MODAL SUBMIT
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isModalSubmit() && interaction.customId.startsWith('caption_')) {
      const timestamp = parseInt(interaction.customId.split('_')[1]);
      const session = uploadSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired. Please upload again.');
      }

      session.userCaption = interaction.fields.getTextInputValue('caption_input');
      console.log(`   ✏️ Caption: "${session.userCaption}"`);

      // Show platform selection buttons
      const platformRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`plat_instagram_${timestamp}`)
          .setLabel('📷 Instagram')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`plat_facebook_${timestamp}`)
          .setLabel('👍 Facebook')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`plat_tiktok_${timestamp}`)
          .setLabel('🎵 TikTok')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`plat_all_${timestamp}`)
          .setLabel('✅ All')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`plat_skip_${timestamp}`)
          .setLabel('⏭️ Skip')
          .setStyle(ButtonStyle.Secondary)
      );

      const embed = new EmbedBuilder()
        .setColor(0x2BA5D7)
        .setTitle('📱 Share to Social Media?')
        .addFields(
          { name: '📂 Destination', value: session.destination, inline: true },
          { name: '🏷️ Category', value: session.category, inline: true },
          { name: '✏️ Caption', value: `"${session.userCaption}"`, inline: false }
        )
        .setFooter({ text: 'Step 3 of 4: Choose platforms (or skip)' });

      await safeReply(interaction, { embeds: [embed], components: [platformRow] });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PLATFORM BUTTONS
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isButton() && interaction.customId.startsWith('plat_')) {
      const parts = interaction.customId.split('_');
      const platform = parts[1];
      const timestamp = parseInt(parts[2]);
      const session = uploadSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired. Please upload again.');
      }

      // Set platforms
      if (platform === 'all') {
        session.platforms = ['instagram', 'facebook', 'tiktok'];
      } else if (platform === 'skip') {
        session.platforms = [];
      } else {
        session.platforms = [platform];
      }
      
      console.log(`   📱 Platforms: ${session.platforms.join(', ') || 'none'}`);

      // Show confirmation
      const confirmRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`confirm_${timestamp}`)
          .setLabel('✅ Publish')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`cancel_${timestamp}`)
          .setLabel('❌ Cancel')
          .setStyle(ButtonStyle.Danger)
      );

      const embed = new EmbedBuilder()
        .setColor(0x7CB342)
        .setTitle('📋 Confirm & Publish')
        .addFields(
          { name: '📂 Destination', value: session.destination, inline: true },
          { name: '🏷️ Category', value: session.category, inline: true },
          { name: '📱 Social Media', value: session.platforms.length ? session.platforms.join(', ') : 'Website only', inline: true },
          { name: '✏️ Caption', value: `"${session.userCaption}"`, inline: false }
        )
        .setFooter({ text: 'Step 4 of 4: Confirm to publish' });

      await safeReply(interaction, { embeds: [embed], components: [confirmRow] });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CONFIRM BUTTON
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isButton() && interaction.customId.startsWith('confirm_')) {
      const timestamp = parseInt(interaction.customId.split('_')[1]);
      const session = uploadSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired. Please upload again.');
      }

      // Defer reply to prevent timeout during file write
      await safeDeferReply(interaction);

      // Create metadata
      const metadata = {
        timestamp: session.timestamp,
        filename: session.filename,
        destination: session.destination,
        category: session.category,
        caption: session.userCaption,
        platforms: session.platforms,
        published: new Date().toISOString(),
        uploadedBy: session.username
      };

      // Save metadata
      const metadataPath = path.join(METADATA_DIR, `${timestamp}.json`);
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

      console.log(`\n✅ PUBLISHED: ${session.filename}`);
      console.log(`   → Destination: ${session.destination}`);
      console.log(`   → Category: ${session.category}`);
      console.log(`   → Caption: "${session.userCaption}"`);
      console.log(`   → Platforms: ${session.platforms.join(', ') || 'website only'}`);

      const successEmbed = new EmbedBuilder()
        .setColor(0x7CB342)
        .setTitle('✅ Published Successfully!')
        .addFields(
          { name: '📂 Location', value: session.destination, inline: true },
          { name: '🏷️ Category', value: session.category, inline: true },
          { name: '📱 Shared to', value: session.platforms.length ? session.platforms.join(', ') : 'Website only', inline: true }
        )
        .setFooter({ text: 'Image will appear on website within 1 minute' });

      await interaction.editReply({ embeds: [successEmbed], components: [] });

      // Clean up session
      uploadSessions.delete(timestamp);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CANCEL BUTTON
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isButton() && interaction.customId.startsWith('cancel_')) {
      const timestamp = parseInt(interaction.customId.split('_')[1]);
      uploadSessions.delete(timestamp);

      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('❌ Upload Cancelled')
        .setDescription('The image was not published. Upload again to start over.');

      await safeReply(interaction, { embeds: [embed], components: [] });
    }

  } catch (error) {
    if (!isInteractionExpired(error)) {
      console.error('❌ Interaction error:', error);
    }
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

client.on(Events.Error, (error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down...');
  client.destroy();
  process.exit(0);
});

// ═══════════════════════════════════════════════════════════════════════════════
// START BOT
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🚀 Starting Care4ME Discord Bot...');
client.login(DISCORD_TOKEN);
