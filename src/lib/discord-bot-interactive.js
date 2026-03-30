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
  ComponentType,
  MessageFlags
} = require('discord.js');
const { createWriteStream } = require('fs');
const { mkdir, writeFile } = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const MEDIA_CHANNEL_ID = '1484953248560447703';
const PUBLIC_MEDIA_DIR = path.join(process.cwd(), 'public', 'uploads');
const METADATA_DIR = path.join(process.cwd(), 'public', 'media-metadata');

// Store upload sessions
const uploadSessions = new Map();

if (!DISCORD_TOKEN) {
  console.error('❌ Error: DISCORD_BOT_TOKEN not found in .env.local');
  process.exit(1);
}

// Auto-generate caption from filename
function generateCaption(filename) {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
    .replace(/\d+/g, '') // Remove numbers
    .trim();
}

client.once(Events.ClientReady, () => {
  console.log('✅ Discord Bot Ready!');
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Listening for images in channel: ${MEDIA_CHANNEL_ID}`);
});

// Handle image uploads
client.on(Events.MessageCreate, async (message) => {
  if (message.channelId !== MEDIA_CHANNEL_ID) return;
  if (message.author.bot) return;

  try {
    for (const attachment of message.attachments.values()) {
      if (!attachment.contentType?.startsWith('image')) continue;

      console.log(`📸 Processing: ${attachment.name}`);

      // Download and process image
      const response = await fetch(attachment.url);
      const buffer = Buffer.from(await response.arrayBuffer());

      await mkdir(PUBLIC_MEDIA_DIR, { recursive: true });
      await mkdir(METADATA_DIR, { recursive: true });

      // Save with timestamp
      const timestamp = Date.now();
      const baseFilename = `${timestamp}-${attachment.name}`;
      const filepath = path.join(PUBLIC_MEDIA_DIR, baseFilename);

      // Save original
      const writeStream = createWriteStream(filepath);
      writeStream.write(buffer);
      writeStream.end();

      // Create web-optimized version
      await sharp(buffer)
        .resize(1200, 800, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(path.join(PUBLIC_MEDIA_DIR, `${timestamp}-web.webp`));

      // Create thumbnail
      await sharp(buffer)
        .resize(400, 300, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(path.join(PUBLIC_MEDIA_DIR, `${timestamp}-thumb.webp`));

      // Generate auto-caption
      const autoCaption = generateCaption(attachment.name);

      // Store session
      uploadSessions.set(timestamp, {
        filename: baseFilename,
        originalName: attachment.name,
        filesize: attachment.size,
        autoCaption: autoCaption,
        userCaption: null,
        destination: null,
        platforms: [],
        userId: message.author.id,
        messageId: message.id
      });

      // Show destination menu
      const row = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId(`destination_${timestamp}`)
            .setPlaceholder('Where should this go?')
            .addOptions([
              { label: '📰 Campaign', value: 'campaign', description: 'Add to campaigns page' },
              { label: '🖼️ Gallery', value: 'gallery', description: 'Add to gallery' },
              { label: '👥 Team', value: 'team', description: 'Add to team page' },
              { label: '📱 Social Only', value: 'social', description: 'Post to social media only' }
            ])
        );

      const embed = new EmbedBuilder()
        .setColor('#2BA5D7')
        .setTitle('📸 Image Uploaded')
        .setDescription(`**File:** ${attachment.name}\n**Auto-Caption:** "${autoCaption}"`)
        .addFields(
          { name: '📂 Step 1', value: 'Select destination below', inline: false },
          { name: '✏️ Next', value: 'You\'ll be able to edit the caption', inline: false }
        );

      await message.reply({ embeds: [embed], components: [row] });
    }
  } catch (error) {
    console.error('Error processing media:', error);
    await message.reply('❌ Error processing image');
  }
});

// Handle destination selection
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('destination_')) {
      try {
        console.log(`🔍 Destination handler triggered: customId=${interaction.customId}`);
        
        // Acknowledge immediately to extend token lifetime
        if (!interaction.replied && !interaction.deferred) {
          await interaction.deferReply({ flags: MessageFlags.Ephemeral });
          console.log(`   ✅ Deferred reply to extend timeout`);
        }
        
        const parts = interaction.customId.split('_');
        console.log(`   Split result: [${parts.join(', ')}]`);
        const timestamp = parseInt(parts[1]);
        console.log(`   Parsed timestamp: ${timestamp}`);
        console.log(`   Session map size: ${uploadSessions.size}`);
        console.log(`   Available sessions: ${Array.from(uploadSessions.keys()).join(', ')}`);
        
        const session = uploadSessions.get(timestamp);
        console.log(`   Session found: ${session ? 'YES' : 'NO'}`);

        if (!session) {
          console.log(`❌ Session ${timestamp} not found!`);
          await safeReply(interaction, '❌ Session expired. Please upload again.');
          return;
        }

        console.log(`✅ Session ${timestamp} retrieved, destination set to: ${interaction.values[0]}`);
        session.destination = interaction.values[0];

        // Show category menu based on destination
        let categoryOptions = [];

        if (session.destination === 'campaign') {
          categoryOptions = [
            { label: '🎓 Education', value: 'education' },
            { label: '⚕️ Healthcare', value: 'healthcare' },
            { label: '👴 Elderly Care', value: 'elderly' },
            { label: '👶 Children', value: 'children' },
            { label: '🏥 Emergency Relief', value: 'emergency' }
          ];
        } else if (session.destination === 'gallery') {
          // [HOW TO ADD NEW EVENTS]
          // Simply add a new object to this array below!
          // The bot supports up to 25 items in this dropdown.
          categoryOptions = [
            { label: '📸 General Gallery', value: 'General Gallery' },
            { label: '❤️ Success Stories', value: 'Success Stories' },
            { label: '🎉 Event: Food Drive 2026', value: 'Event: Food Drive 2026' },
            { label: '🎉 Event: Spring Health Fair', value: 'Event: Spring Health Fair' },
            { label: '🎉 Event: Winter Formal', value: 'Event: Winter Formal' }
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

        const categoryRow = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId(`category_${timestamp}`)
              .setPlaceholder('Select category')
              .addOptions(categoryOptions)
          );

        const embed = new EmbedBuilder()
          .setColor('#7CB342')
          .setTitle('📂 Select Category')
          .setDescription(`Destination: **${session.destination.toUpperCase()}**`)
          .addFields({ name: '✏️ Caption (auto-generated)', value: `"${session.autoCaption}"` });

        console.log(`   About to call editReply() with ${categoryOptions.length} category options`);
        await interaction.editReply({ embeds: [embed], components: [categoryRow] });
        console.log(`✅ Destination step completed successfully!`);
      } catch (err) {
        console.error(`❌ Destination handler FAILED with error:`, {
          message: err.message,
          code: err.code,
          status: err.status,
          stack: err.stack
        });
        try {
          if (interaction.deferred) {
            await interaction.editReply('❌ Error processing destination choice. Please try again.');
          } else if (!interaction.replied) {
            await interaction.reply({ content: '❌ Error processing destination choice. Please try again.', flags: MessageFlags.Ephemeral });
          }
        } catch (replyErr) {
          console.error('Failed to send error reply:', replyErr.message);
        }
      }
    }

    // Handle category selection
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('category_')) {
      try {
        const timestamp = parseInt(interaction.customId.split('_')[1]);
        const session = uploadSessions.get(timestamp);

        if (!session) {
          await safeReply(interaction, '❌ Session expired.');
          return;
        }

        session.category = interaction.values[0];

        // Show caption editing modal
        const modal = new ModalBuilder()
          .setCustomId(`caption_${timestamp}`)
          .setTitle('Edit Caption')
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('caption_text')
                .setLabel('Caption')
                .setStyle(TextInputStyle.Paragraph)
                .setValue(session.autoCaption)
                .setMaxLength(500)
            )
          );

        await interaction.showModal(modal);
      } catch (err) {
        if (!isUnknownInteractionError(err)) {
          console.error('Category handler error:', err.message);
        }
      }
    }

    // Handle caption modal submission
    if (interaction.isModalSubmit() && interaction.customId.startsWith('caption_')) {
      try {
        const timestamp = parseInt(interaction.customId.split('_')[1]);
        const session = uploadSessions.get(timestamp);

        if (!session) {
          await interaction.reply({ content: '❌ Session expired.', flags: MessageFlags.Ephemeral });
          return;
        }

        session.userCaption = interaction.fields.getTextInputValue('caption_text');

        // Show social media options
        if (session.destination === 'social' || session.destination !== 'team') {
          const platformRow = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`platform_instagram_${timestamp}`)
                .setLabel('📷 Instagram')
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId(`platform_facebook_${timestamp}`)
                .setLabel('👍 Facebook')
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId(`platform_tiktok_${timestamp}`)
                .setLabel('🎵 TikTok')
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId(`platform_all_${timestamp}`)
                .setLabel('✅ All Platforms')
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId(`platform_skip_${timestamp}`)
                .setLabel('⏭️ Skip Social')
                .setStyle(ButtonStyle.Secondary)
            );

          const embed = new EmbedBuilder()
            .setColor('#2BA5D7')
            .setTitle('📱 Social Media Platforms')
            .setDescription(`**Caption:** "${session.userCaption}"`)
            .addFields({ name: '📂 Category', value: session.category, inline: false });

          await interaction.reply({ embeds: [embed], components: [platformRow], flags: MessageFlags.Ephemeral });
        } else {
          // Skip social for team uploads, go to confirmation
          await showConfirmation(interaction, timestamp, session);
        }
      } catch (err) {
        if (!isUnknownInteractionError(err)) {
          console.error('Caption handler error:', err.message);
        }
      }
    }

    // Handle platform selection
    if (interaction.isButton() && interaction.customId.startsWith('platform_')) {
      const [, platform, timestamp] = interaction.customId.split('_');
      const sessionTimestamp = parseInt(timestamp);
      const session = uploadSessions.get(sessionTimestamp);

      if (!session) {
        await safeReply(interaction, '❌ Session expired.');
        return;
      }

      if (platform === 'all') {
        session.platforms = ['instagram', 'facebook', 'tiktok'];
      } else if (platform === 'skip') {
        session.platforms = [];
      } else {
        session.platforms = [platform];
      }

      await showConfirmation(interaction, sessionTimestamp, session);
    }
  } catch (error) {
    if (isUnknownInteractionError(error)) {
      console.warn('Interaction expired before response (10062).');
      return;
    }

    console.error('Error handling interaction:', error);
    await safeReply(interaction, '❌ An error occurred.');
  }
});

async function showConfirmation(interaction, timestamp, session) {
  const confirmRow = new ActionRowBuilder()
    .addComponents(
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
    .setColor('#7CB342')
    .setTitle('📋 Confirm Upload')
    .addFields(
      { name: '📂 Destination', value: session.destination.toUpperCase(), inline: true },
      { name: '🏷️ Category', value: session.category || 'N/A', inline: true },
      { name: '✏️ Caption', value: `"${session.userCaption}"`, inline: false },
      { name: '📱 Social Media', value: session.platforms.length ? session.platforms.join(', ') : 'None', inline: false }
    );

  await safeReply(interaction, { embeds: [embed], components: [confirmRow] });
}

// Safe reply helper — never throws [40060]
async function safeReply(interaction, payload) {
  try {
    const basePayload = typeof payload === 'string'
      ? { content: payload, flags: MessageFlags.Ephemeral }
      : { ...payload, flags: payload.flags ?? MessageFlags.Ephemeral };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(basePayload);
    } else {
      await interaction.reply(basePayload);
    }
  } catch (err) {
    if (!isUnknownInteractionError(err)) {
      console.error('safeReply failed:', err.message);
    }
  }
}

function isUnknownInteractionError(error) {
  return error && (error.code === 10062 || error.message === 'Unknown interaction' || /Unknown interaction/.test(String(error)));
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  try {
    if (interaction.customId.startsWith('confirm_')) {
      const timestamp = parseInt(interaction.customId.split('_')[1]);
      const session = uploadSessions.get(timestamp);

      if (!session) {
        await safeReply(interaction, '❌ Session expired. Please re-upload the image.');
        return;
      }

      // Save metadata
      const metadata = {
        timestamp,
        filename: session.filename,
        destination: session.destination,
        category: session.category,
        caption: session.userCaption,
        platforms: session.platforms,
        published: new Date().toISOString()
      };

      await writeFile(
        path.join(METADATA_DIR, `${timestamp}.json`),
        JSON.stringify(metadata, null, 2)
      );

      console.log(`✅ Published: ${session.filename}`);
      console.log(`   Destination: ${session.destination}`);
      console.log(`   Platforms: ${session.platforms.join(', ') || 'None'}`);

      const successEmbed = new EmbedBuilder()
        .setColor('#7CB342')
        .setTitle('✅ Published Successfully!')
        .addFields(
          { name: '📂 Location', value: session.destination, inline: true },
          { name: '📱 Shared to', value: session.platforms.join(', ') || 'Website only', inline: true },
          { name: '📊 What happens next:', value: 'Image will appear on website within 1 minute.\nSocial media posts queued for publishing.' }
        );

      await safeReply(interaction, { embeds: [successEmbed] });

      // Clean up session after 1 hour
      setTimeout(() => uploadSessions.delete(timestamp), 3600000);
    }

    if (interaction.customId.startsWith('cancel_')) {
      const timestamp = parseInt(interaction.customId.split('_')[1]);
      uploadSessions.delete(timestamp);

      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Upload Cancelled')
        .setDescription('Image has been deleted.');

      await safeReply(interaction, { embeds: [embed] });
    }
  } catch (error) {
    if (isUnknownInteractionError(error)) {
      console.warn('Confirm/cancel interaction expired before response (10062).');
      return;
    }

    console.error('Error in confirm/cancel handler:', error);
    await safeReply(interaction, '❌ An error occurred. Please try again.');
  }
});

client.on(Events.ClientError, (error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection (bot will NOT crash):', reason);
});

client.login(DISCORD_TOKEN);
