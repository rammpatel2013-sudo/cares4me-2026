require('dotenv').config({ path: '.env.local' });

const { Client, GatewayIntentBits, Events } = require('discord.js');
const { createWriteStream } = require('fs');
const { mkdir } = require('fs/promises');
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

if (!DISCORD_TOKEN) {
  console.error('❌ Error: DISCORD_BOT_TOKEN not found in .env.local');
  process.exit(1);
}

client.once(Events.ClientReady, () => {
  console.log('✅ Discord Bot Ready!');
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Listening for images in channel: ${MEDIA_CHANNEL_ID}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.channelId !== MEDIA_CHANNEL_ID) return;
  if (message.author.bot) return;

  try {
    for (const attachment of message.attachments.values()) {
      if (!attachment.contentType?.startsWith('image')) continue;

      console.log(`📸 Processing: ${attachment.name}`);

      // Download image
      const response = await fetch(attachment.url);
      const buffer = Buffer.from(await response.arrayBuffer());

      // Create upload directory
      await mkdir(PUBLIC_MEDIA_DIR, { recursive: true });

      // Save original
      const filename = `${Date.now()}-${attachment.name}`;
      const filepath = path.join(PUBLIC_MEDIA_DIR, filename);

      const writeStream = createWriteStream(filepath);
      writeStream.write(buffer);
      writeStream.end();

      // Create optimized versions for web
      await sharp(buffer)
        .resize(1200, 800, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(path.join(PUBLIC_MEDIA_DIR, `${filename.replace(/\..+/, '')}-web.webp`));

      // Create thumbnail
      await sharp(buffer)
        .resize(400, 300, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(path.join(PUBLIC_MEDIA_DIR, `${filename.replace(/\..+/, '')}-thumb.webp`));

      console.log(`✅ Saved: ${filename}`);
      console.log(`Caption: ${message.content}`);

      // Tag the message
      await message.react('✅');
      await message.reply(`📦 **Uploaded & Tagged**\nFile: \`${filename}\`\nCaption: ${message.content}`);
    }
  } catch (error) {
    console.error('Error processing media:', error);
    message.reply('❌ Error processing image');
  }
});

client.on(Events.ClientError, (error) => {
  console.error('Discord client error:', error);
});

client.login(DISCORD_TOKEN);
