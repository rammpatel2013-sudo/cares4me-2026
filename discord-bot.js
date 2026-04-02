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
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const BASE_DIR = process.env.APP_DIR || process.cwd();
const PUBLIC_MEDIA_DIR = path.join(BASE_DIR, 'public', 'uploads');
const METADATA_DIR = path.join(BASE_DIR, 'public', 'media-metadata');
const BLOG_DIR = path.join(BASE_DIR, 'public', 'blog-posts');
const BLOG_IMAGES_DIR = path.join(BASE_DIR, 'public', 'blog-images');

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
const blogSessions = new Map();

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
// AI IMAGE GENERATION (Multiple fallback providers for reliability)
// ═══════════════════════════════════════════════════════════════════════════════

async function generateBlogImage(topic, category) {
  // Create a prompt optimized for blog header images
  const stylePrompts = {
    'news': 'professional photography, news style, bright lighting, editorial',
    'events': 'event photography, celebration, community gathering, joyful',
    'success-stories': 'heartwarming, inspirational, people helping people, hopeful',
    'tips': 'clean modern style, educational, helpful, informative',
    'community': 'diverse community, togetherness, warm colors, unity'
  };

  const style = stylePrompts[category] || 'professional, nonprofit organization, community';
  const prompt = `${topic}, ${style}, high quality, photorealistic, no text, no watermark`;
  
  console.log(`🎨 Generating AI image for: "${topic}"`);

  // Try multiple providers in order
  const providers = [
    // Provider 1: Pollinations FLUX (usually most reliable)
    async () => {
      const encodedPrompt = encodeURIComponent(prompt);
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&model=flux&nologo=true`;
      console.log(`   Trying Pollinations FLUX...`);
      const response = await fetch(url, { timeout: 60000 });
      if (!response.ok) throw new Error(`Status ${response.status}`);
      return Buffer.from(await response.arrayBuffer());
    },
    
    // Provider 2: Pollinations Turbo (faster, lower quality)
    async () => {
      const encodedPrompt = encodeURIComponent(prompt);
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&model=turbo&nologo=true`;
      console.log(`   Trying Pollinations Turbo...`);
      const response = await fetch(url, { timeout: 45000 });
      if (!response.ok) throw new Error(`Status ${response.status}`);
      return Buffer.from(await response.arrayBuffer());
    },

    // Provider 3: Picsum (placeholder - always works, random photo)
    async () => {
      console.log(`   Falling back to placeholder image...`);
      const url = `https://picsum.photos/1200/630`;
      const response = await fetch(url, { timeout: 15000 });
      if (!response.ok) throw new Error(`Status ${response.status}`);
      return Buffer.from(await response.arrayBuffer());
    }
  ];

  for (const provider of providers) {
    try {
      const buffer = await provider();
      
      // Verify it's actually an image (at least 5KB)
      if (buffer.length < 5000) {
        throw new Error('Image too small');
      }
      
      console.log(`   ✅ AI image generated (${(buffer.length / 1024).toFixed(1)} KB)`);
      return buffer;
      
    } catch (error) {
      console.log(`   ⚠️ Provider failed: ${error.message}`);
      continue;
    }
  }
  
  console.error(`   ❌ All image providers failed`);
  return null;
}

async function saveBlogImage(buffer, timestamp, isAIGenerated = false) {
  await mkdir(BLOG_IMAGES_DIR, { recursive: true });
  
  const prefix = isAIGenerated ? 'ai' : 'upload';
  const filename = `${prefix}-${timestamp}.webp`;
  const filepath = path.join(BLOG_IMAGES_DIR, filename);
  
  // Optimize and save as webp
  await sharp(buffer)
    .resize(1200, 630, { fit: 'cover' })
    .webp({ quality: 85 })
    .toFile(filepath);
  
  console.log(`   💾 Blog image saved: ${filename}`);
  
  return filename;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GROQ AI BLOG GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

async function generateBlogPost(topic, keyPoints, category) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const prompt = `You are a professional blog writer for Care4ME, a nonprofit organization focused on restoring health and renewing hope through medical equipment donations and community care.

Write a compelling blog post about: "${topic}"

Key points to include:
${keyPoints}

Category: ${category}

Requirements:
- Write in a warm, inspiring tone
- Include a catchy title
- Write 3-5 paragraphs
- End with a call to action
- Make it suitable for a nonprofit website
- Do NOT use markdown formatting like ** or ## - just plain text with natural paragraphs

Format your response exactly like this:
TITLE: [Your title here]
CONTENT:
[Your blog content here with natural paragraph breaks]`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '';
  
  // Parse title and content
  const titleMatch = content.match(/TITLE:\s*(.+)/i);
  const contentMatch = content.match(/CONTENT:\s*([\s\S]+)/i);
  
  return {
    title: titleMatch ? titleMatch[1].trim() : topic,
    content: contentMatch ? contentMatch[1].trim() : content
  };
}

async function saveBlogPost(blogData) {
  await mkdir(BLOG_DIR, { recursive: true });
  
  const timestamp = Date.now();
  const slug = blogData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
  
  const filename = `${timestamp}-${slug}.json`;
  const filepath = path.join(BLOG_DIR, filename);
  
  const post = {
    id: timestamp,
    slug,
    title: blogData.title,
    content: blogData.content,
    category: blogData.category,
    author: blogData.author,
    image: blogData.image || null,  // NEW: image filename
    imageType: blogData.imageType || null,  // NEW: 'ai' or 'upload'
    published: new Date().toISOString(),
    status: 'published'
  };
  
  await writeFile(filepath, JSON.stringify(post, null, 2));
  return post;
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
  console.log(`  Blog:     ${BLOG_DIR}`);
  console.log(`  Blog Img: ${BLOG_IMAGES_DIR}`);
  console.log(`  Groq:     ${GROQ_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  try {
    await mkdir(PUBLIC_MEDIA_DIR, { recursive: true });
    await mkdir(METADATA_DIR, { recursive: true });
    await mkdir(BLOG_DIR, { recursive: true });
    await mkdir(BLOG_IMAGES_DIR, { recursive: true });
    console.log('✅ Directories verified');
  } catch (err) {
    console.error('❌ Directory creation failed:', err.message);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMMANDS - !help, !list, !delete, !addcategory, !blog
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
        { name: '!delete [number]', value: 'Delete by number from list', inline: true },
        { name: '!delete all', value: 'Delete ALL uploads', inline: true },
        { name: '!addcategory [name]', value: 'Add new gallery category', inline: true },
        { name: '!blog [topic]', value: 'Generate AI blog post', inline: true }
      )
      .setDescription('**📝 Blog Images:**\nAttach an image with `!blog` to use your own image, or let AI generate one!')
      .setFooter({ text: 'Made for Care4ME' });
    await message.reply({ embeds: [embed] });
    return;
  }

  // !list
  if (command === 'list') {
    try {
      const files = await readdir(METADATA_DIR).catch(() => []);
      const jsonFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('_'));
      
      if (jsonFiles.length === 0) {
        await message.reply('📭 No uploads yet. Drop an image to get started!');
        return;
      }

      global.fileList = [];
      let fileListText = '';
      let num = 1;
      
      for (const file of jsonFiles.slice(0, 20)) {
        try {
          const data = JSON.parse(await readFile(path.join(METADATA_DIR, file), 'utf8'));
          global.fileList.push({ file, data });
          
          const displayName = data.name || data.caption || data.originalName || data.filename;
          const dest = data.destination || '?';
          const cat = data.category || '';
          
          fileListText += `**${num}.** ${displayName} (${dest})\n`;
          num++;
        } catch (e) {}
      }

      const embed = new EmbedBuilder()
        .setColor(0x7CB342)
        .setTitle(`📁 Files (${jsonFiles.length})`)
        .setDescription(fileListText || 'No files')
        .setFooter({ text: '!delete [number] or !delete all' });
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
      await message.reply('❓ Usage: `!delete 1` or `!delete all`\nRun `!list` first to see numbers.');
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
          if (!file.startsWith('_')) {
            await unlink(path.join(METADATA_DIR, file)).catch(() => {});
          }
        }
        global.fileList = [];
        await message.reply(`🗑️ **Deleted all ${metadata.length} files!**`);
        console.log('🗑️ All deleted by', message.author.username);
        return;
      }

      const num = parseInt(target);
      if (!isNaN(num) && global.fileList && global.fileList[num - 1]) {
        const item = global.fileList[num - 1];
        const data = item.data;
        
        await unlink(path.join(METADATA_DIR, item.file)).catch(() => {});
        await unlink(path.join(PUBLIC_MEDIA_DIR, data.filename)).catch(() => {});
        await unlink(path.join(PUBLIC_MEDIA_DIR, `${data.timestamp}-web.webp`)).catch(() => {});
        await unlink(path.join(PUBLIC_MEDIA_DIR, `${data.timestamp}-thumb.webp`)).catch(() => {});
        
        const displayName = data.name || data.caption || data.filename;
        await message.reply(`🗑️ **Deleted #${num}:** ${displayName}`);
        console.log('🗑️ Deleted', displayName, 'by', message.author.username);
        global.fileList.splice(num - 1, 1);
        return;
      }

      const metadataFiles = await readdir(METADATA_DIR).catch(() => []);
      for (const file of metadataFiles) {
        try {
          const data = JSON.parse(await readFile(path.join(METADATA_DIR, file), 'utf8'));
          const searchText = `${data.filename} ${data.name || ''} ${data.caption || ''}`.toLowerCase();
          
          if (searchText.includes(target)) {
            await unlink(path.join(METADATA_DIR, file)).catch(() => {});
            await unlink(path.join(PUBLIC_MEDIA_DIR, data.filename)).catch(() => {});
            await unlink(path.join(PUBLIC_MEDIA_DIR, `${data.timestamp}-web.webp`)).catch(() => {});
            await unlink(path.join(PUBLIC_MEDIA_DIR, `${data.timestamp}-thumb.webp`)).catch(() => {});
            
            await message.reply(`🗑️ **Deleted:** ${data.name || data.caption || data.filename}`);
            return;
          }
        } catch (e) {}
      }
      await message.reply(`❌ Not found. Run \`!list\` first.`);
    } catch (error) {
      console.error('Delete error:', error);
      await message.reply('❌ Error deleting');
    }
    return;
  }

  // !addcategory [name]
  if (command === 'addcategory') {
    const categoryName = args.slice(1).join(' ');
    
    if (!categoryName) {
      await message.reply('❓ Usage: `!addcategory Summer Picnic 2026`');
      return;
    }

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

  // !blog [topic] - NOW WITH IMAGE SUPPORT!
  if (command === 'blog') {
    const topic = args.slice(1).join(' ');
    
    if (!topic) {
      await message.reply('❓ **Usage:** `!blog Food Drive Success Story`\n\n📸 **Tip:** Attach an image to use your own photo, or I\'ll generate one with AI!');
      return;
    }

    if (!GROQ_API_KEY) {
      await message.reply('❌ AI blog generation is not configured. Please add GROQ_API_KEY to .env.local');
      return;
    }

    // Check for attached image
    const images = [...message.attachments.values()].filter(
      att => att.contentType?.startsWith('image')
    );
    
    const timestamp = Date.now();
    let uploadedImageBuffer = null;
    
    if (images.length > 0) {
      // User attached an image - download it
      console.log(`\n📸 Blog with user image: ${images[0].name}`);
      try {
        const response = await fetch(images[0].url);
        if (response.ok) {
          uploadedImageBuffer = Buffer.from(await response.arrayBuffer());
          console.log(`   ✅ Downloaded user image (${(uploadedImageBuffer.length / 1024).toFixed(1)} KB)`);
        }
      } catch (err) {
        console.error('   ❌ Failed to download image:', err.message);
      }
    }

    // Store session for this blog
    blogSessions.set(timestamp, {
      topic,
      userId: message.author.id,
      username: message.author.username,
      uploadedImageBuffer,  // Store the user's image if provided
      hasUserImage: uploadedImageBuffer !== null
    });

    // Show category selection
    const categoryRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`blog_cat_${timestamp}`)
        .setPlaceholder('📁 Select blog category')
        .addOptions([
          { label: '📰 News', value: 'news', description: 'Organization news and updates' },
          { label: '🎉 Events', value: 'events', description: 'Event recaps and announcements' },
          { label: '❤️ Success Stories', value: 'success-stories', description: 'Impact stories' },
          { label: '💡 Tips & Resources', value: 'tips', description: 'Helpful information' },
          { label: '🤝 Community', value: 'community', description: 'Community highlights' }
        ])
    );

    const imageNote = uploadedImageBuffer 
      ? '✅ **Your image will be used!**' 
      : '🎨 **AI will generate an image** based on your topic';

    const embed = new EmbedBuilder()
      .setColor(0x2BA5D7)
      .setTitle('✍️ AI Blog Generator')
      .addFields(
        { name: '📝 Topic', value: topic, inline: false },
        { name: '🖼️ Image', value: imageNote, inline: false }
      )
      .setFooter({ text: 'Step 1 of 3: Choose a category' });

    if (uploadedImageBuffer && images.length > 0) {
      embed.setThumbnail(images[0].url);
    }

    await message.reply({ embeds: [embed], components: [categoryRow] });
    return;
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGE UPLOAD HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

client.on(Events.MessageCreate, async (message) => {
  if (message.channelId !== MEDIA_CHANNEL_ID) return;
  if (message.author.bot) return;
  if (message.content.startsWith('!')) return;

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
    // BLOG CATEGORY SELECT
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('blog_cat_')) {
      const timestamp = parseInt(interaction.customId.split('_')[2]);
      const session = blogSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired. Please run !blog again.');
      }

      session.category = interaction.values[0];

      // Show modal for key points
      const modal = new ModalBuilder()
        .setCustomId(`blog_points_${timestamp}`)
        .setTitle('Blog Key Points')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('key_points')
              .setLabel('Key points to include (one per line)')
              .setStyle(TextInputStyle.Paragraph)
              .setPlaceholder('- We collected 500 pairs of shoes\n- 50 volunteers participated\n- Distributed to 3 local shelters')
              .setRequired(true)
              .setMaxLength(1000)
          )
        );

      await interaction.showModal(modal);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BLOG KEY POINTS MODAL - NOW GENERATES IMAGE TOO!
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isModalSubmit() && interaction.customId.startsWith('blog_points_')) {
      const timestamp = parseInt(interaction.customId.split('_')[2]);
      const session = blogSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired. Please run !blog again.');
      }

      await interaction.deferReply();

      const keyPoints = interaction.fields.getTextInputValue('key_points');
      session.keyPoints = keyPoints;

      // Generate blog post with AI
      const embed = new EmbedBuilder()
        .setColor(0xFFA500)
        .setTitle('⏳ Generating Blog Post...')
        .setDescription(session.hasUserImage 
          ? 'AI is writing your blog post and processing your image...' 
          : 'AI is writing your blog post and generating an image...');

      await interaction.editReply({ embeds: [embed] });

      try {
        // Generate blog text
        const blogPost = await generateBlogPost(session.topic, keyPoints, session.category);
        session.generatedTitle = blogPost.title;
        session.generatedContent = blogPost.content;

        // Handle image - either use uploaded or generate
        let imageFilename = null;
        let imageType = null;

        if (session.uploadedImageBuffer) {
          // Use user's uploaded image
          imageFilename = await saveBlogImage(session.uploadedImageBuffer, timestamp, false);
          imageType = 'upload';
          console.log(`   📸 Using uploaded image: ${imageFilename}`);
        } else {
          // Generate AI image
          const aiImageBuffer = await generateBlogImage(session.topic, session.category);
          if (aiImageBuffer) {
            imageFilename = await saveBlogImage(aiImageBuffer, timestamp, true);
            imageType = 'ai';
            console.log(`   🎨 Using AI-generated image: ${imageFilename}`);
          }
        }

        session.imageFilename = imageFilename;
        session.imageType = imageType;

        // Show preview with edit/publish buttons
        const buttonRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`blog_edit_${timestamp}`)
            .setLabel('✏️ Edit')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`blog_regen_img_${timestamp}`)
            .setLabel('🎨 New Image')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`blog_publish_${timestamp}`)
            .setLabel('✅ Publish')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`blog_cancel_${timestamp}`)
            .setLabel('❌ Cancel')
            .setStyle(ButtonStyle.Danger)
        );

        const imageStatus = imageFilename 
          ? `✅ ${imageType === 'ai' ? 'AI Generated' : 'Your Image'}` 
          : '⚠️ No image (will use default)';

        const previewEmbed = new EmbedBuilder()
          .setColor(0x7CB342)
          .setTitle(`📝 ${blogPost.title}`)
          .setDescription(blogPost.content.substring(0, 3500))
          .addFields(
            { name: '📁 Category', value: session.category, inline: true },
            { name: '✍️ Author', value: session.username, inline: true },
            { name: '🖼️ Image', value: imageStatus, inline: true }
          )
          .setFooter({ text: 'Review and publish, or click "New Image" to regenerate' });

        await interaction.editReply({ embeds: [previewEmbed], components: [buttonRow] });

      } catch (error) {
        console.error('Blog generation error:', error);
        const errorEmbed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle('❌ Generation Failed')
          .setDescription(`Error: ${error.message}\n\nPlease try again with \`!blog ${session.topic}\``);
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BLOG REGENERATE IMAGE BUTTON
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isButton() && interaction.customId.startsWith('blog_regen_img_')) {
      const timestamp = parseInt(interaction.customId.split('_')[3]);
      const session = blogSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired.');
      }

      await interaction.deferUpdate();

      // Delete old image if exists
      if (session.imageFilename) {
        try {
          await unlink(path.join(BLOG_IMAGES_DIR, session.imageFilename));
          console.log(`   🗑️ Deleted old image: ${session.imageFilename}`);
        } catch (e) {}
      }

      // Generate new AI image
      const newTimestamp = Date.now();
      const aiImageBuffer = await generateBlogImage(session.topic, session.category);
      
      if (aiImageBuffer) {
        session.imageFilename = await saveBlogImage(aiImageBuffer, newTimestamp, true);
        session.imageType = 'ai';
      }

      // Update preview
      const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`blog_edit_${timestamp}`)
          .setLabel('✏️ Edit')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`blog_regen_img_${timestamp}`)
          .setLabel('🎨 New Image')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`blog_publish_${timestamp}`)
          .setLabel('✅ Publish')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`blog_cancel_${timestamp}`)
          .setLabel('❌ Cancel')
          .setStyle(ButtonStyle.Danger)
      );

      const imageStatus = session.imageFilename 
        ? `✅ AI Generated (new!)` 
        : '⚠️ Generation failed';

      const previewEmbed = new EmbedBuilder()
        .setColor(0x7CB342)
        .setTitle(`📝 ${session.generatedTitle}`)
        .setDescription(session.generatedContent.substring(0, 3500))
        .addFields(
          { name: '📁 Category', value: session.category, inline: true },
          { name: '✍️ Author', value: session.username, inline: true },
          { name: '🖼️ Image', value: imageStatus, inline: true }
        )
        .setFooter({ text: 'Image regenerated! Review and publish' });

      await interaction.editReply({ embeds: [previewEmbed], components: [buttonRow] });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BLOG EDIT BUTTON
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isButton() && interaction.customId.startsWith('blog_edit_')) {
      const timestamp = parseInt(interaction.customId.split('_')[2]);
      const session = blogSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired.');
      }

      const modal = new ModalBuilder()
        .setCustomId(`blog_edit_modal_${timestamp}`)
        .setTitle('Edit Blog Post')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('blog_title')
              .setLabel('Title')
              .setStyle(TextInputStyle.Short)
              .setValue(session.generatedTitle)
              .setRequired(true)
              .setMaxLength(200)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('blog_content')
              .setLabel('Content')
              .setStyle(TextInputStyle.Paragraph)
              .setValue(session.generatedContent.substring(0, 4000))
              .setRequired(true)
              .setMaxLength(4000)
          )
        );

      await interaction.showModal(modal);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BLOG EDIT MODAL SUBMIT
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isModalSubmit() && interaction.customId.startsWith('blog_edit_modal_')) {
      const timestamp = parseInt(interaction.customId.split('_')[3]);
      const session = blogSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired.');
      }

      session.generatedTitle = interaction.fields.getTextInputValue('blog_title');
      session.generatedContent = interaction.fields.getTextInputValue('blog_content');

      const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`blog_edit_${timestamp}`)
          .setLabel('✏️ Edit Again')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`blog_regen_img_${timestamp}`)
          .setLabel('🎨 New Image')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`blog_publish_${timestamp}`)
          .setLabel('✅ Publish')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`blog_cancel_${timestamp}`)
          .setLabel('❌ Cancel')
          .setStyle(ButtonStyle.Danger)
      );

      const imageStatus = session.imageFilename 
        ? `✅ ${session.imageType === 'ai' ? 'AI Generated' : 'Your Image'}` 
        : '⚠️ No image';

      const previewEmbed = new EmbedBuilder()
        .setColor(0x7CB342)
        .setTitle(`📝 ${session.generatedTitle}`)
        .setDescription(session.generatedContent.substring(0, 3500))
        .addFields(
          { name: '📁 Category', value: session.category, inline: true },
          { name: '✍️ Author', value: session.username, inline: true },
          { name: '🖼️ Image', value: imageStatus, inline: true }
        )
        .setFooter({ text: 'Updated! Review and publish' });

      await safeReply(interaction, { embeds: [previewEmbed], components: [buttonRow] });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BLOG PUBLISH BUTTON - NOW SAVES IMAGE REFERENCE
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isButton() && interaction.customId.startsWith('blog_publish_')) {
      const timestamp = parseInt(interaction.customId.split('_')[2]);
      const session = blogSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired.');
      }

      await safeDeferReply(interaction);

      try {
        const post = await saveBlogPost({
          title: session.generatedTitle,
          content: session.generatedContent,
          category: session.category,
          author: session.username,
          image: session.imageFilename || null,
          imageType: session.imageType || null
        });

        const imageInfo = post.image 
          ? `\n🖼️ **Image:** ${post.imageType === 'ai' ? 'AI Generated' : 'User Upload'}`
          : '';

        const successEmbed = new EmbedBuilder()
          .setColor(0x7CB342)
          .setTitle('✅ Blog Post Published!')
          .addFields(
            { name: '📝 Title', value: post.title, inline: false },
            { name: '📁 Category', value: post.category, inline: true },
            { name: '✍️ Author', value: post.author, inline: true },
            { name: '🖼️ Image', value: post.image ? (post.imageType === 'ai' ? 'AI Generated' : 'Your Image') : 'None', inline: true }
          )
          .setFooter({ text: 'Post will appear on the blog page' });

        await safeReply(interaction, { embeds: [successEmbed], components: [] });
        
        console.log(`\n✅ BLOG PUBLISHED: ${post.title}`);
        console.log(`   → Category: ${post.category}`);
        console.log(`   → Author: ${post.author}`);
        console.log(`   → Image: ${post.image || 'none'} (${post.imageType || 'n/a'})`);

        blogSessions.delete(timestamp);

      } catch (error) {
        console.error('Blog save error:', error);
        await safeReply(interaction, '❌ Failed to save blog post. Please try again.');
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BLOG CANCEL BUTTON
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isButton() && interaction.customId.startsWith('blog_cancel_')) {
      const timestamp = parseInt(interaction.customId.split('_')[2]);
      const session = blogSessions.get(timestamp);
      
      // Clean up image if it was generated
      if (session?.imageFilename) {
        try {
          await unlink(path.join(BLOG_IMAGES_DIR, session.imageFilename));
          console.log(`   🗑️ Cleaned up image: ${session.imageFilename}`);
        } catch (e) {}
      }
      
      blogSessions.delete(timestamp);

      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('❌ Blog Post Cancelled')
        .setDescription('The blog post was not published.');

      await safeReply(interaction, { embeds: [embed], components: [] });
    }

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
          { label: '🏛️ Board Members', value: 'board' },
          { label: '🌟 Advisors', value: 'advisors' }
        ];
      } else if (session.destination === 'social') {
        categoryOptions = [
          { label: '📸 General Post', value: 'general' },
          { label: '🎉 Event Highlight', value: 'event' },
          { label: '❤️ Impact Story', value: 'impact' },
          { label: '📢 Announcement', value: 'announcement' }
        ];
      }

      categoryOptions = categoryOptions.slice(0, 25);

      const categoryRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`cat_${timestamp}`)
          .setPlaceholder('🏷️ Select a category')
          .addOptions(categoryOptions)
      );

      const embed = new EmbedBuilder()
        .setColor(0x2BA5D7)
        .setTitle('🏷️ Choose Category')
        .addFields(
          { name: '📂 Destination', value: session.destination, inline: true },
          { name: '✏️ Caption', value: `"${session.userCaption}"`, inline: false }
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

      // If Team destination, show team member modal instead
      if (session.destination === 'team') {
        const modal = new ModalBuilder()
          .setCustomId(`team_${timestamp}`)
          .setTitle('Team Member Details')
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('name_input')
                .setLabel('Full Name')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Dr. Jane Smith')
                .setRequired(true)
                .setMaxLength(100)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('role_input')
                .setLabel('Role / Title')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Medical Director')
                .setRequired(true)
                .setMaxLength(100)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('bio_input')
                .setLabel('Short Bio')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Brief description of their role and background...')
                .setRequired(true)
                .setMaxLength(500)
            )
          );

        await interaction.showModal(modal);
        return;
      }

      // For non-team destinations, show caption modal
      const modal = new ModalBuilder()
        .setCustomId(`caption_${timestamp}`)
        .setTitle('Edit Caption')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('caption_input')
              .setLabel('Caption')
              .setStyle(TextInputStyle.Paragraph)
              .setValue(session.autoCaption)
              .setPlaceholder('Enter a caption for this image...')
              .setRequired(true)
              .setMaxLength(500)
          )
        );

      await interaction.showModal(modal);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TEAM MODAL SUBMIT
    // ─────────────────────────────────────────────────────────────────────────
    if (interaction.isModalSubmit() && interaction.customId.startsWith('team_')) {
      const timestamp = parseInt(interaction.customId.split('_')[1]);
      const session = uploadSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired. Please upload again.');
      }

      session.name = interaction.fields.getTextInputValue('name_input');
      session.role = interaction.fields.getTextInputValue('role_input');
      session.bio = interaction.fields.getTextInputValue('bio_input');

      console.log(`   👤 Team: ${session.name} (${session.role})`);

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

      const metadata = {
        timestamp: session.timestamp,
        filename: session.filename,
        destination: session.destination,
        category: session.category,
        caption: session.userCaption,
        platforms: session.platforms || [],
        published: new Date().toISOString(),
        uploadedBy: session.username,
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
