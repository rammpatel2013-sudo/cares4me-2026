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
const { mkdir, writeFile, readdir, unlink, readFile } = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const MEDIA_CHANNEL_ID = process.env.DISCORD_MEDIA_CHANNEL_ID || '1484953248560447703';

const BASE_DIR = process.env.APP_DIR || process.cwd();
const PUBLIC_MEDIA_DIR = path.join(BASE_DIR, 'public', 'uploads');
const METADATA_DIR = path.join(BASE_DIR, 'public', 'media-metadata');

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

  try {
    await mkdir(PUBLIC_MEDIA_DIR, { recursive: true });
    await mkdir(METADATA_DIR, { recursive: true });
    console.log('✅ Directories verified');
  } catch (err) {
    console.error('❌ Directory creation failed:', err.message);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMMANDS - !help, !list, !delete, !addcategory
// ═══════════════════════════════════════════════════════════════════════════════

client.on(Events.MessageCreate, async (message) => {
  if (message.channelId !== MEDIA_CHANNEL_ID) return;
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/\s+/);
  const command = args[0].toLowerCase();

  // !help
  if (command === 'help') {
    const embed = new EmbedBuilder()
      .setColor(0x2BA5D7)
      .setTitle('📚 Care4ME Bot Commands')
      .addFields(
        { name: '📸 Upload Image', value: 'Just drop an image in this channel', inline: false },
        { name: '!help', value: 'Show this help message', inline: true },
        { name: '!list', value: 'Show all uploaded files', inline: true },
        { name: '!delete all', value: 'Delete ALL uploads', inline: true },
        { name: '!delete [filename]', value: 'Delete a specific file', inline: true },
        { name: '!addcategory [name]', value: 'Add new gallery category', inline: true }
      )
      .setFooter({ text: 'Made for Care4ME' });
    await message.reply({ embeds: [embed] });
    return;
  }

  // !list
  if (command === 'list') {
    try {
      const files = await readdir(METADATA_DIR).catch(() => []);
      
      if (files.length === 0) {
        await message.reply('📭 No uploads yet. Drop an image to get started!');
        return;
      }

      let fileList = '';
      for (const file of files.slice(0, 15)) {
        try {
          const data = JSON.parse(await readFile(path.join(METADATA_DIR, file), 'utf8'));
          fileList += `• **${data.filename}**\n  └ ${data.destination} → ${data.category}\n`;
        } catch (e) {}
      }
      
      if (files.length > 15) {
        fileList += `\n... and ${files.length - 15} more`;
      }

      const embed = new EmbedBuilder()
        .setColor(0x7CB342)
        .setTitle(`📁 Uploaded Files (${files.length})`)
        .setDescription(fileList || 'No files found')
        .setFooter({ text: 'Use !delete [filename] to remove a file' });
      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('List error:', error);
      await message.reply('❌ Error listing files');
    }
    return;
  }

  // !delete
  if (command === 'delete') {
    const target = args.slice(1).join(' ').toLowerCase();
    
    if (!target) {
      await message.reply('❓ Usage: `!delete all` or `!delete [filename]`');
      return;
    }

    try {
      if (target === 'all') {
        const uploads = await readdir(PUBLIC_MEDIA_DIR).catch(() => []);
        for (const file of uploads) {
          await unlink(path.join(PUBLIC_MEDIA_DIR, file)).catch(() => {});
        }
        
        const metadata = await readdir(METADATA_DIR).catch(() => []);
        for (const file of metadata) {
          await unlink(path.join(METADATA_DIR, file)).catch(() => {});
        }
        
        await message.reply(`🗑️ **Deleted all ${uploads.length} files!** Gallery is now empty.`);
        console.log('🗑️ All uploads deleted by', message.author.username);
        return;
      }

      const metadataFiles = await readdir(METADATA_DIR).catch(() => []);
      let deleted = false;

      for (const file of metadataFiles) {
        try {
          const data = JSON.parse(await readFile(path.join(METADATA_DIR, file), 'utf8'));
          
          if (data.filename.toLowerCase().includes(target)) {
            await unlink(path.join(METADATA_DIR, file)).catch(() => {});
            
            const timestamp = data.timestamp;
            await unlink(path.join(PUBLIC_MEDIA_DIR, data.filename)).catch(() => {});
            await unlink(path.join(PUBLIC_MEDIA_DIR, `${timestamp}-web.webp`)).catch(() => {});
            await unlink(path.join(PUBLIC_MEDIA_DIR, `${timestamp}-thumb.webp`)).catch(() => {});
            
            await message.reply(`🗑️ **Deleted:** ${data.filename}`);
            console.log('🗑️ Deleted', data.filename, 'by', message.author.username);
            deleted = true;
            break;
          }
        } catch (e) {}
      }

      if (!deleted) {
        await message.reply(`❌ File not found: "${target}"\nUse \`!list\` to see all files.`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      await message.reply('❌ Error deleting file');
    }
    return;
  }

  // !addcategory [name] - Add new gallery category
  if (command === 'addcategory') {
    const categoryName = args.slice(1).join(' ');
    
    if (!categoryName) {
      await message.reply('❓ Usage: `!addcategory Summer Picnic 2026`');
      return;
    }

    // Store in a categories file
    const categoriesPath = path.join(METADATA_DIR, '_categories.json');
    let categories = [];
    
    try {
      const data = await readFile(categoriesPath, 'utf8');
      categories = JSON.parse(data);
    } catch (e) {
      categories = [];
    }

    if (!categories.includes(categoryName)) {
      categories.push(categoryName);
      await writeFile(categoriesPath, JSON.stringify(categories, null, 2));
      await message.reply(`✅ **Added category:** "${categoryName}"\n\nThis will now appear in the Gallery dropdown when uploading!`);
      console.log('📁 New category added:', categoryName, 'by', message.author.username);
    } else {
      await message.reply(`⚠️ Category "${categoryName}" already exists.`);
    }
    return;
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGE UPLOAD HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

client.on(Events.MessageCreate, async (message) => {
  if (message.channelId !== MEDIA_CHANNEL_ID) return;
  if (message.author.bot) return;
  if (message.content.startsWith('!')) return; // Skip commands

  const images = [...message.attachments.values()].filter(
    att => att.contentType?.startsWith('image')
  );

  if (images.length === 0) return;

  console.log(`\n📸 Upload from ${message.author.username}: ${images.length} image(s)`);

  try {
    for (const attachment of images) {
      console.log(`   Processing: ${attachment.name}`);

      const response = await fetch(attachment.url);
      if (!response.ok) throw new Error(`Download failed: ${response.status}`);
      
      const buffer = Buffer.from(await response.arrayBuffer());
      const timestamp = Date.now();

      const baseFilename = `${timestamp}-${attachment.name}`;
      const filepath = path.join(PUBLIC_MEDIA_DIR, baseFilename);
      
      const writeStream = createWriteStream(filepath);
      writeStream.write(buffer);
      writeStream.end();

      await sharp(buffer)
        .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(path.join(PUBLIC_MEDIA_DIR, `${timestamp}-web.webp`));

      await sharp(buffer)
        .resize(400, 300, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(path.join(PUBLIC_MEDIA_DIR, `${timestamp}-thumb.webp`));

      console.log(`   ✅ Saved: ${baseFilename}`);

      const autoCaption = message.content.trim() || generateCaption(attachment.name);

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
        // Team-specific fields
        name: null,
        role: null,
        bio: null,
        userId: message.author.id,
        username: message.author.username,
        messageId: message.id
      });

      scheduleSessionCleanup(timestamp);

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
// INTERACTION HANDLER
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

      // Load custom categories if they exist
      let customCategories = [];
      try {
        const categoriesPath = path.join(METADATA_DIR, '_categories.json');
        const data = await readFile(categoriesPath, 'utf8');
        customCategories = JSON.parse(data);
      } catch (e) {}

      let categoryOptions = [];
      
      if (session.destination === 'gallery') {
        categoryOptions = [
          { label: '📸 General Gallery', value: 'General Gallery' },
          { label: '❤️ Success Stories', value: 'Success Stories' },
          { label: '🎉 Event: Food Drive 2026', value: 'Event: Food Drive 2026' },
          { label: '🎉 Event: Spring Health Fair', value: 'Event: Spring Health Fair' },
          { label: '🎉 Event: Winter Formal', value: 'Event: Winter Formal' },
          // Add custom categories
          ...customCategories.map(cat => ({ label: `🏷️ ${cat}`, value: cat }))
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
          .addOptions(categoryOptions.slice(0, 25)) // Discord max 25 options
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

      // TEAM DESTINATION - Show special modal with Name, Role, Bio
      if (session.destination === 'team') {
        const modal = new ModalBuilder()
          .setCustomId(`team_info_${timestamp}`)
          .setTitle('Team Member Info')
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('team_name')
                .setLabel('Name')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('e.g., John Smith')
                .setRequired(true)
                .setMaxLength(100)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('team_role')
                .setLabel('Role / Title')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('e.g., Volunteer Coordinator')
                .setRequired(true)
                .setMaxLength(100)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('team_bio')
                .setLabel('Brief Introduction')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Write a short bio about this team member...')
                .setRequired(true)
                .setMaxLength(500)
            )
          );

        await interaction.showModal(modal);
      } else {
        // OTHER DESTINATIONS - Show regular caption modal
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
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TEAM INFO MODAL SUBMIT
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isModalSubmit() && interaction.customId.startsWith('team_info_')) {
      const timestamp = parseInt(interaction.customId.split('_')[2]);
      const session = uploadSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired. Please upload again.');
      }

      session.name = interaction.fields.getTextInputValue('team_name');
      session.role = interaction.fields.getTextInputValue('team_role');
      session.bio = interaction.fields.getTextInputValue('team_bio');
      session.userCaption = `${session.name} - ${session.role}`;

      console.log(`   👤 Team Member: ${session.name} (${session.role})`);

      // Skip social media selection for team, go straight to confirmation
      const confirmRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`confirm_${timestamp}`)
          .setLabel('✅ Add to Team Page')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`cancel_${timestamp}`)
          .setLabel('❌ Cancel')
          .setStyle(ButtonStyle.Danger)
      );

      const embed = new EmbedBuilder()
        .setColor(0x7CB342)
        .setTitle('📋 Confirm Team Member')
        .addFields(
          { name: '👤 Name', value: session.name, inline: true },
          { name: '💼 Role', value: session.role, inline: true },
          { name: '🏷️ Category', value: session.category, inline: true },
          { name: '📝 Bio', value: session.bio, inline: false }
        )
        .setFooter({ text: 'Click "Add to Team Page" to publish' });

      await safeReply(interaction, { embeds: [embed], components: [confirmRow] });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CAPTION MODAL SUBMIT (for non-team destinations)
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isModalSubmit() && interaction.customId.startsWith('caption_')) {
      const timestamp = parseInt(interaction.customId.split('_')[1]);
      const session = uploadSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired. Please upload again.');
      }

      session.userCaption = interaction.fields.getTextInputValue('caption_input');
      console.log(`   ✏️ Caption: "${session.userCaption}"`);

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

      if (platform === 'all') {
        session.platforms = ['instagram', 'facebook', 'tiktok'];
      } else if (platform === 'skip') {
        session.platforms = [];
      } else {
        session.platforms = [platform];
      }
      
      console.log(`   📱 Platforms: ${session.platforms.join(', ') || 'none'}`);

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

      await safeDeferReply(interaction);

      // Create metadata - include team fields if present
      const metadata = {
        timestamp: session.timestamp,
        filename: session.filename,
        destination: session.destination,
        category: session.category,
        caption: session.userCaption,
        platforms: session.platforms || [],
        published: new Date().toISOString(),
        uploadedBy: session.username,
        // Team-specific fields
        name: session.name || null,
        role: session.role || null,
        bio: session.bio || null
      };

      const metadataPath = path.join(METADATA_DIR, `${timestamp}.json`);
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

      console.log(`\n✅ PUBLISHED: ${session.filename}`);
      console.log(`   → Destination: ${session.destination}`);
      console.log(`   → Category: ${session.category}`);
      if (session.name) {
        console.log(`   → Team Member: ${session.name} (${session.role})`);
      } else {
        console.log(`   → Caption: "${session.userCaption}"`);
      }
      console.log(`   → Platforms: ${session.platforms?.join(', ') || 'website only'}`);

      const successEmbed = new EmbedBuilder()
        .setColor(0x7CB342)
        .setTitle('✅ Published Successfully!')
        .addFields(
          { name: '📂 Location', value: session.destination, inline: true },
          { name: '🏷️ Category', value: session.category, inline: true },
          { name: '📱 Shared to', value: session.platforms?.length ? session.platforms.join(', ') : 'Website only', inline: true }
        )
        .setFooter({ text: 'Image will appear on website within 1 minute' });

      await safeReply(interaction, { embeds: [successEmbed], components: [] });

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
