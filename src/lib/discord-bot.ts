import { Client, GatewayIntentBits, Events } from 'discord.js';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const MEDIA_CHANNEL_ID = '1484953284807626992';
const PUBLIC_MEDIA_DIR = path.join(process.cwd(), 'public', 'uploads');

client.once(Events.ClientReady, () => {
  console.log('✅ Discord Bot Ready!');
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
      const buffer = await response.arrayBuffer();

      // Create upload directory
      await mkdir(PUBLIC_MEDIA_DIR, { recursive: true });

      // Save original
      const filename = `${Date.now()}-${attachment.name}`;
      const filepath = path.join(PUBLIC_MEDIA_DIR, filename);

      const writeStream = createWriteStream(filepath);
      writeStream.write(Buffer.from(buffer));
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

export async function startDiscordBot() {
  try {
    await client.login(DISCORD_TOKEN);
  } catch (error) {
    console.error('Failed to start Discord bot:', error);
  }
}

export { client };