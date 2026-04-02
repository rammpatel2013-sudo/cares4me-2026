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

// ═══════════════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════════════

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const MEDIA_CHANNEL_ID = process.env.DISCORD_MEDIA_CHANNEL_ID || '1484953248560447703';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const BASE_DIR = process.env.APP_DIR || process.cwd();
const PUBLIC_MEDIA_DIR = path.join(BASE_DIR, 'public', 'uploads');
const METADATA_DIR = path.join(BASE_DIR, 'public', 'media-metadata');
const BLOG_DIR = path.join(BASE_DIR, 'public', 'blog-posts');
const BLOG_IMAGES_DIR = path.join(BASE_DIR, 'public', 'blog-images');

const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

// ═══════════════════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════════════

if (!DISCORD_TOKEN) {
  console.error('❌ DISCORD_BOT_TOKEN not found in .env.local');
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// CLIENT SETUP
// ═══════════════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════════════
// AI IMAGE GENERATION
// ═══════════════════════════════════════════════════════════════════════════════════════

async function generateBlogImage(title, category) {
  const timestamp = Date.now();
  const imageFilename = `${timestamp}-blog.webp`;
  
  // Create prompt for image generation
  const imagePrompt = `${title}, nonprofit charity organization, professional photography, warm hopeful atmosphere, community care, ${category}`;
  const encodedPrompt = encodeURIComponent(imagePrompt);
  
  // List of image generation services to try (free, no API key needed)
  const imageProviders = [
    // Pollinations FLUX (best quality)
    `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&model=flux&nologo=true`,
    // Pollinations Turbo (faster fallback)  
    `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&model=turbo&nologo=true`,
    // Placeholder as last resort
    `https://picsum.photos/1200/630?random=${timestamp}`
  ];
  
  await mkdir(BLOG_IMAGES_DIR, { recursive: true });
  
  for (const imageUrl of imageProviders) {
    try {
      console.log(`   🎨 Trying image generation...`);
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000); // 45 second timeout
      
      const imageResponse = await fetch(imageUrl, { 
        signal: controller.signal,
        headers: { 'User-Agent': 'Care4ME-Bot/1.0' }
      });
      
      clearTimeout(timeout);
      
      if (!imageResponse.ok) {
        console.log(`   ⚠️ Provider returned ${imageResponse.status}, trying next...`);
        continue;
      }
      
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      
      // Check if we got a valid image (at least 10KB)
      if (imageBuffer.length < 10000) {
        console.log(`   ⚠️ Image too small (${imageBuffer.length} bytes), trying next...`);
        continue;
      }
      
      // Convert to WebP and save
      await sharp(imageBuffer)
        .resize(1200, 630, { fit: 'cover' })
        .webp({ quality: 85 })
        .toFile(path.join(BLOG_IMAGES_DIR, imageFilename));
      
      console.log(`   ✅ Image saved: ${imageFilename}`);
      return imageFilename;
      
    } catch (error) {
      console.log(`   ⚠️ Image generation failed: ${error.message}`);
      continue;
    }
  }
  
  console.log('   ❌ All image providers failed, proceeding without image');
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// GROQ AI BLOG GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════════════

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
  
  // Generate AI image for the blog post
  let imageFilename = null;
  let imageType = null;
  
  // If user provided an image, use that
  if (blogData.userImage) {
    imageFilename = blogData.userImage;
    imageType = 'upload';
  } else {
    // Generate AI image
    imageFilename = await generateBlogImage(blogData.title, blogData.category);
    if (imageFilename) {
      imageType = 'ai';
    }
  }
  
  const post = {
    id: timestamp,
    slug,
    title: blogData.title,
    content: blogData.content,
    category: blogData.category,
    author: blogData.author,
    published: new Date().toISOString(),
    status: 'published',
    image: imageFilename,
    imageType: imageType
  };
  
  await writeFile(filepath, JSON.stringify(post, null, 2));
  return post;
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// BOT READY
// ═══════════════════════════════════════════════════════════════════════════════════════

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
  console.log(`  Images:   ${BLOG_IMAGES_DIR}`);
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

// ═══════════════════════════════════════════════════════════════════════════════════════
// COMMANDS - !help, !list, !delete, !addcategory, !blog
// ═══════════════════════════════════════════════════════════════════════════════════════

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
        { name: '!blog [topic]', value: 'Generate AI blog post with image', inline: true },
        { name: '📝 BLOG MANAGEMENT', value: '─────────────────────────────', inline: false },
        { name: '!blogs', value: 'List all published blog posts', inline: true },
        { name: '!edit [number]', value: 'Edit a published blog post', inline: true },
        { name: '!delete-blog [number]', value: 'Delete a published blog post', inline: true }
      )
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

  // !blog [topic]
  if (command === 'blog') {
    const topic = args.slice(1).join(' ');
    
    if (!topic) {
      await message.reply('❓ Usage: `!blog Food Drive Success Story`\n\nI\'ll generate an AI blog post with a featured image!\n\n**Tip:** Attach an image to use your own instead of AI-generated.');
      return;
    }

    if (!GROQ_API_KEY) {
      await message.reply('❌ AI blog generation is not configured. Please add GROQ_API_KEY to .env.local');
      return;
    }

    // Check if user attached an image
    let userImageFilename = null;
    const images = [...message.attachments.values()].filter(
      att => att.contentType?.startsWith('image')
    );
    
    if (images.length > 0) {
      const attachment = images[0];
      console.log(`   📷 User attached image: ${attachment.name}`);
      
      try {
        await mkdir(BLOG_IMAGES_DIR, { recursive: true });
        const response = await fetch(attachment.url);
        const buffer = Buffer.from(await response.arrayBuffer());
        
        userImageFilename = `${Date.now()}-${attachment.name.replace(/\.[^/.]+$/, '')}.webp`;
        
        await sharp(buffer)
          .resize(1200, 630, { fit: 'cover' })
          .webp({ quality: 85 })
          .toFile(path.join(BLOG_IMAGES_DIR, userImageFilename));
        
        console.log(`   ✅ User image saved: ${userImageFilename}`);
      } catch (err) {
        console.error('   ⚠️ Failed to save user image:', err.message);
        userImageFilename = null;
      }
    }

    // Store session for this blog
    const timestamp = Date.now();
    blogSessions.set(timestamp, {
      topic,
      userId: message.author.id,
      username: message.author.username,
      userImage: userImageFilename
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

    const embed = new EmbedBuilder()
      .setColor(0x2BA5D7)
      .setTitle('✍️ AI Blog Generator')
      .addFields(
        { name: '📝 Topic', value: topic, inline: false },
        { name: '🖼️ Image', value: userImageFilename ? '✅ Your uploaded image will be used' : '🎨 AI will generate a featured image', inline: false }
      )
      .setFooter({ text: 'Step 1 of 3: Choose a category' });

    await message.reply({ embeds: [embed], components: [categoryRow] });
    return;
  }

  // !blogs - List all published blog posts
  if (command === 'blogs') {
    try {
      const files = await readdir(BLOG_DIR).catch(() => []);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      
      if (jsonFiles.length === 0) {
        await message.reply('📭 No blog posts yet. Use `!blog [topic]` to create one!');
        return;
      }

      global.blogList = [];
      let blogListText = '';
      let num = 1;
      
      for (const file of jsonFiles.sort().reverse()) {
        try {
          const data = JSON.parse(await readFile(path.join(BLOG_DIR, file), 'utf8'));
          if (data.status === 'published') {
            global.blogList.push({ file, data });
            
            const pubDate = new Date(data.published).toLocaleDateString();
            blogListText += `**${num}.** ${data.title}\n   📅 ${pubDate} | ✍️ ${data.author}\n`;
            num++;
          }
        } catch (e) {}
      }

      const embed = new EmbedBuilder()
        .setColor(0x7CB342)
        .setTitle(`📝 Blog Posts (${global.blogList.length})`)
        .setDescription(blogListText || 'No published posts')
        .setFooter({ text: '!edit [number] or !delete-blog [number]' });
      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('List blogs error:', error);
      await message.reply('❌ Error listing blog posts');
    }
    return;
  }

  // !edit [number] - Edit a published blog post
  if (command === 'edit') {
    const target = args.slice(1).join(' ');
    
    if (!target) {
      await message.reply('❓ Usage: `!edit 1`\nRun `!blogs` first to see numbers.');
      return;
    }

    try {
      const num = parseInt(target);
      if (!isNaN(num) && global.blogList && global.blogList[num - 1]) {
        const item = global.blogList[num - 1];
        const data = item.data;
        
        // Store edit session
        const editSessionId = num;
        blogSessions.set(editSessionId, {
          editFile: item.file,
          editData: JSON.parse(JSON.stringify(data)), // Deep copy
          originalData: data,
          isEditing: true
        });

        const embed = new EmbedBuilder()
          .setColor(0x2BA5D7)
          .setTitle(`✏️ Editing Post #${num}`)
          .addFields(
            { name: '📝 Title', value: data.title, inline: false },
            { name: '📄 Content', value: data.content.substring(0, 500) + (data.content.length > 500 ? '...' : ''), inline: false }
          )
          .setFooter({ text: 'Now use the commands below to edit' });

        const helpEmbed = new EmbedBuilder()
          .setColor(0x7CB342)
          .setTitle('Commands to edit:')
          .addFields(
            { name: `!edit-title ${num} [new title]`, value: 'Update the title', inline: false },
            { name: `!edit-content ${num} [new content]`, value: 'Update the content', inline: false },
            { name: `!save ${num}`, value: 'Save changes to website', inline: false },
            { name: `!cancel ${num}`, value: 'Cancel editing', inline: false }
          );

        await message.reply({ embeds: [embed, helpEmbed] });
        return;
      }

      await message.reply(`❌ Blog post #${target} not found. Run \`!blogs\` to see the list.`);
    } catch (error) {
      console.error('Edit error:', error);
      await message.reply('❌ Error editing blog post');
    }
    return;
  }

  // !edit-title [number] [new title]
  if (command === 'edit-title') {
    const num = parseInt(args[1]);
    const newTitle = args.slice(2).join(' ');

    if (!newTitle) {
      await message.reply(`❓ Usage: \`!edit-title 1 Your New Title Here\``);
      return;
    }

    const session = blogSessions.get(num);
    if (!session || !session.isEditing) {
      await message.reply(`❌ Not editing post #${num}. Run \`!edit ${num}\` first.`);
      return;
    }

    session.editData.title = newTitle;
    const embed = new EmbedBuilder()
      .setColor(0x7CB342)
      .setTitle('✅ Title Updated')
      .addFields(
        { name: '📝 New Title', value: newTitle, inline: false },
        { name: 'Next Step', value: `Use \`!edit-content ${num} [new content]\` or \`!save ${num}\``, inline: false }
      );
    await message.reply({ embeds: [embed] });
    return;
  }

  // !edit-content [number] [new content]
  if (command === 'edit-content') {
    const num = parseInt(args[1]);
    const newContent = args.slice(2).join(' ');

    if (!newContent) {
      await message.reply(`❓ Usage: \`!edit-content 1 Your new content here...\``);
      return;
    }

    const session = blogSessions.get(num);
    if (!session || !session.isEditing) {
      await message.reply(`❌ Not editing post #${num}. Run \`!edit ${num}\` first.`);
      return;
    }

    session.editData.content = newContent;
    const embed = new EmbedBuilder()
      .setColor(0x7CB342)
      .setTitle('✅ Content Updated')
      .addFields(
        { name: '📄 New Content Preview', value: newContent.substring(0, 300) + (newContent.length > 300 ? '...' : ''), inline: false },
        { name: 'Next Step', value: `Use \`!save ${num}\` to save changes`, inline: false }
      );
    await message.reply({ embeds: [embed] });
    return;
  }

  // !save [number] - Save edited blog post
  if (command === 'save') {
    const target = args.slice(1).join(' ');
    const num = parseInt(target);

    if (!num) {
      await message.reply('❓ Usage: `!save 1`');
      return;
    }

    const session = blogSessions.get(num);
    if (!session || !session.isEditing) {
      await message.reply(`❌ Not editing post #${num}. Run \`!edit ${num}\` first.`);
      return;
    }

    try {
      const filepath = path.join(BLOG_DIR, session.editFile);
      
      // Save updated post
      await writeFile(filepath, JSON.stringify(session.editData, null, 2));

      console.log('\n✅ BLOG UPDATED:', session.editData.title);
      console.log(`   → File: ${session.editFile}`);
      console.log(`   → Author: ${session.editData.author}`);

      const successEmbed = new EmbedBuilder()
        .setColor(0x7CB342)
        .setTitle('✅ Blog Post Saved!')
        .addFields(
          { name: '📝 Title', value: session.editData.title, inline: false },
          { name: '✍️ Author', value: session.editData.author || 'Unknown', inline: true },
          { name: '🔄 Status', value: 'Live on website NOW!', inline: true }
        )
        .setFooter({ text: 'Changes appear immediately!' });

      await message.reply({ embeds: [successEmbed] });

      blogSessions.delete(num);

    } catch (error) {
      console.error('Blog save error:', error);
      await message.reply(`❌ Error saving: ${error.message}`);
    }
    return;
  }

  // !cancel [number] - Cancel editing
  if (command === 'cancel') {
    const target = args.slice(1).join(' ');
    const num = parseInt(target);

    if (!num) {
      await message.reply('❓ Usage: `!cancel 1`');
      return;
    }

    const session = blogSessions.get(num);
    if (!session || !session.isEditing) {
      await message.reply(`❌ Not editing post #${num}.`);
      return;
    }

    blogSessions.delete(num);
    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('❌ Editing Cancelled')
      .setDescription('No changes were saved.');

    await message.reply({ embeds: [embed] });
    return;
  }

  // !delete-blog [number] - Delete a published blog post
  if (command === 'delete-blog') {
    const target = args.slice(1).join(' ');
    
    if (!target) {
      await message.reply('❓ Usage: `!delete-blog 1`\nRun `!blogs` first to see numbers.');
      return;
    }

    try {
      const num = parseInt(target);
      if (!isNaN(num) && global.blogList && global.blogList[num - 1]) {
        const item = global.blogList[num - 1];
        const data = item.data;
        
        // Store confirmation session
        const confirmSessionId = Date.now();
        blogSessions.set(confirmSessionId, {
          deleteFile: item.file,
          deleteData: data
        });

        const confirmRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`blog_confirm_delete_${confirmSessionId}`)
            .setLabel('⚠️ Yes, Delete It')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId(`blog_cancel_delete_${confirmSessionId}`)
            .setLabel('❌ Cancel')
            .setStyle(ButtonStyle.Secondary)
        );

        const confirmEmbed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle('⚠️ Delete Blog Post?')
          .addFields(
            { name: '📝 Title', value: data.title, inline: false },
            { name: '⚠️ Warning', value: 'This CANNOT be undone!', inline: false }
          )
          .setFooter({ text: 'Choose carefully' });

        await message.reply({ embeds: [confirmEmbed], components: [confirmRow] });
        return;
      }

      await message.reply(`❌ Blog post #${target} not found. Run \`!blogs\` to see the list.`);
    } catch (error) {
      console.error('Delete-blog error:', error);
      await message.reply('❌ Error deleting blog post');
    }
    return;
  }
});

// ═══════════════════════════════════════════════════════════════════════════════════════
// IMAGE UPLOAD HANDLER
// ═══════════════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════════════
// INTERACTION HANDLER
// ═══════════════════════════════════════════════════════════════════════════════════════

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    // ───────────────────────────────────────────────────────────────────────────────
    // BLOG CATEGORY SELECT
    // ───────────────────────────────────────────────────────────────────────────────
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

    // ───────────────────────────────────────────────────────────────────────────────
    // BLOG KEY POINTS MODAL
    // ───────────────────────────────────────────────────────────────────────────────
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
        .setDescription('AI is writing your blog post. This may take a few seconds...');

      await interaction.editReply({ embeds: [embed] });

      try {
        const blogPost = await generateBlogPost(session.topic, keyPoints, session.category);
        session.generatedTitle = blogPost.title;
        session.generatedContent = blogPost.content;

        // Show preview with edit/publish buttons
        const buttonRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`blog_edit_${timestamp}`)
            .setLabel('✏️ Edit')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`blog_publish_${timestamp}`)
            .setLabel('✅ Publish')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`blog_cancel_${timestamp}`)
            .setLabel('❌ Cancel')
            .setStyle(ButtonStyle.Danger)
        );

        const previewEmbed = new EmbedBuilder()
          .setColor(0x7CB342)
          .setTitle(`📝 ${blogPost.title}`)
          .setDescription(blogPost.content.substring(0, 4000))
          .addFields(
            { name: '📁 Category', value: session.category, inline: true },
            { name: '✍️ Author', value: session.username, inline: true },
            { name: '🖼️ Image', value: session.userImage ? '📷 Your upload' : '🎨 AI will generate', inline: true }
          )
          .setFooter({ text: 'Review and publish or edit' });

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

    // ───────────────────────────────────────────────────────────────────────────────
    // BLOG EDIT BUTTON
    // ───────────────────────────────────────────────────────────────────────────────
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

    // ───────────────────────────────────────────────────────────────────────────────
    // BLOG EDIT MODAL SUBMIT
    // ───────────────────────────────────────────────────────────────────────────────
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
          .setCustomId(`blog_publish_${timestamp}`)
          .setLabel('✅ Publish')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`blog_cancel_${timestamp}`)
          .setLabel('❌ Cancel')
          .setStyle(ButtonStyle.Danger)
      );

      const previewEmbed = new EmbedBuilder()
        .setColor(0x7CB342)
        .setTitle(`📝 ${session.generatedTitle}`)
        .setDescription(session.generatedContent.substring(0, 4000))
        .addFields(
          { name: '📁 Category', value: session.category, inline: true },
          { name: '✍️ Author', value: session.username, inline: true }
        )
        .setFooter({ text: 'Updated! Review and publish' });

      await safeReply(interaction, { embeds: [previewEmbed], components: [buttonRow] });
    }

    // ───────────────────────────────────────────────────────────────────────────────
    // BLOG PUBLISH BUTTON
    // ───────────────────────────────────────────────────────────────────────────────
    if (interaction.isButton() && interaction.customId.startsWith('blog_publish_')) {
      const timestamp = parseInt(interaction.customId.split('_')[2]);
      const session = blogSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired.');
      }

      await safeDeferReply(interaction);

      // Show generating image message
      const genEmbed = new EmbedBuilder()
        .setColor(0xFFA500)
        .setTitle('⏳ Publishing Blog Post...')
        .setDescription(session.userImage ? 'Saving your blog post...' : 'Generating AI image and saving blog post...');

      await interaction.editReply({ embeds: [genEmbed], components: [] });

      try {
        const savedPost = await saveBlogPost({
          title: session.generatedTitle,
          content: session.generatedContent,
          category: session.category,
          author: session.username,
          userImage: session.userImage
        });

        console.log('\n✅ BLOG PUBLISHED:', savedPost.title);
        console.log(`   → Category: ${savedPost.category}`);
        console.log(`   → Author: ${savedPost.author}`);
        console.log(`   → Image: ${savedPost.image || 'none'} (${savedPost.imageType || 'none'})`);

        const successEmbed = new EmbedBuilder()
          .setColor(0x7CB342)
          .setTitle('✅ Blog Post Published!')
          .addFields(
            { name: '📝 Title', value: savedPost.title, inline: false },
            { name: '📁 Category', value: savedPost.category, inline: true },
            { name: '✍️ Author', value: savedPost.author, inline: true },
            { name: '🖼️ Image', value: savedPost.image ? `✅ ${savedPost.imageType === 'ai' ? 'AI Generated' : 'Your Upload'}` : '❌ None', inline: true }
          )
          .setFooter({ text: 'Blog post will appear on website immediately!' });

        await interaction.editReply({ embeds: [successEmbed], components: [] });

        blogSessions.delete(timestamp);

      } catch (error) {
        console.error('Blog publish error:', error);
        const errorEmbed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle('❌ Publish Failed')
          .setDescription(`Error: ${error.message}`);
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
      }
    }

    // ───────────────────────────────────────────────────────────────────────────────
    // BLOG CANCEL BUTTON
    // ───────────────────────────────────────────────────────────────────────────────
    if (interaction.isButton() && interaction.customId.startsWith('blog_cancel_')) {
      const timestamp = parseInt(interaction.customId.split('_')[2]);
      blogSessions.delete(timestamp);

      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('❌ Blog Post Cancelled')
        .setDescription('The blog post was not published.');

      await safeReply(interaction, { embeds: [embed], components: [] });
    }

    // ───────────────────────────────────────────────────────────────────────────────
    // CONFIRM DELETE BUTTON
    // ───────────────────────────────────────────────────────────────────────────────
    if (interaction.isButton() && interaction.customId.startsWith('blog_confirm_delete_')) {
      const sessionId = parseInt(interaction.customId.split('_')[3]);
      const session = blogSessions.get(sessionId);

      if (!session || !session.deleteFile) {
        return await safeReply(interaction, '❌ Session expired.');
      }

      await safeDeferReply(interaction);

      try {
        const filepath = path.join(BLOG_DIR, session.deleteFile);
        
        // Delete the file
        await unlink(filepath);

        console.log('\n🗑️ BLOG DELETED:', session.deleteData.title);
        console.log(`   → File: ${session.deleteFile}`);
        console.log(`   → Author: ${session.deleteData.author}`);

        const successEmbed = new EmbedBuilder()
          .setColor(0x7CB342)
          .setTitle('✅ Blog Post Deleted')
          .addFields(
            { name: '📝 Title', value: session.deleteData.title, inline: false },
            { name: '🗑️ Status', value: 'Removed from website', inline: true }
          )
          .setFooter({ text: 'Post is no longer visible' });

        await interaction.editReply({ embeds: [successEmbed], components: [] });

        blogSessions.delete(sessionId);
        // Refresh the blog list
        global.blogList = [];

      } catch (error) {
        console.error('Blog delete error:', error);
        const errorEmbed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle('❌ Delete Failed')
          .setDescription(`Error: ${error.message}`);
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
      }
    }

    // ───────────────────────────────────────────────────────────────────────────────
    // CANCEL DELETE BUTTON
    // ───────────────────────────────────────────────────────────────────────────────
    if (interaction.isButton() && interaction.customId.startsWith('blog_cancel_delete_')) {
      const sessionId = parseInt(interaction.customId.split('_')[3]);
      blogSessions.delete(sessionId);

      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('❌ Delete Cancelled')
        .setDescription('The blog post was NOT deleted.');

      await safeReply(interaction, { embeds: [embed], components: [] });
    }

    // ───────────────────────────────────────────────────────────────────────────────
    // DESTINATION SELECT (Image Uploads)
    // ───────────────────────────────────────────────────────────────────────────────
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('dest_')) {
      const timestamp = parseInt(interaction.customId.split('_')[1]);
      const session = uploadSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired. Please upload again.');
      }

      session.destination = interaction.values[0];
      console.log(`   📂 Destination: ${session.destination}`);

      let categoryOptions = [];

      if (session.destination === 'gallery') {
        // Load custom categories
        let customCategories = [];
        try {
          const categoriesPath = path.join(METADATA_DIR, '_categories.json');
          const data = await readFile(categoriesPath, 'utf8');
          customCategories = JSON.parse(data);
        } catch (e) {}

        categoryOptions = [
          { label: '📸 General Gallery', value: 'General Gallery' },
          { label: '❤️ Success Stories', value: 'Success Stories' },
          { label: '🎉 Event: Food Drive 2026', value: 'Event: Food Drive 2026' },
          { label: '🎉 Event: Spring Health Fair', value: 'Event: Spring Health Fair' },
          ...customCategories.slice(0, 20).map(cat => ({
            label: `🏷️ ${cat}`,
            value: cat
          }))
        ];
      } else if (session.destination === 'campaign') {
        categoryOptions = [
          { label: '🏥 Medical Equipment', value: 'Medical Equipment' },
          { label: '🍎 Food Drive', value: 'Food Drive' },
          { label: '📚 Education', value: 'Education' },
          { label: '🏠 Housing', value: 'Housing' },
          { label: '💊 Healthcare', value: 'Healthcare' }
        ];
      } else if (session.destination === 'team') {
        categoryOptions = [
          { label: '👔 Leadership', value: 'Leadership' },
          { label: '🤝 Volunteers', value: 'Volunteers' },
          { label: '💼 Staff', value: 'Staff' },
          { label: '🌟 Board Members', value: 'Board Members' }
        ];
      } else {
        categoryOptions = [
          { label: '📱 General', value: 'General' },
          { label: '🎉 Event', value: 'Event' },
          { label: '📢 Announcement', value: 'Announcement' }
        ];
      }

      const categoryRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`cat_${timestamp}`)
          .setPlaceholder('🏷️ Select a category')
          .addOptions(categoryOptions.slice(0, 25))
      );

      const embed = new EmbedBuilder()
        .setColor(0x2BA5D7)
        .setTitle('🏷️ Choose Category')
        .addFields(
          { name: '📂 Destination', value: session.destination, inline: true },
          { name: '✏️ Caption', value: `"${session.userCaption}"`, inline: false }
        )
        .setFooter({ text: 'Step 2 of 4: Select a category' });

      await safeReply(interaction, { embeds: [embed], components: [categoryRow] });
    }

    // ───────────────────────────────────────────────────────────────────────────────
    // CATEGORY SELECT (Image Uploads)
    // ───────────────────────────────────────────────────────────────────────────────
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('cat_')) {
      const timestamp = parseInt(interaction.customId.split('_')[1]);
      const session = uploadSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired. Please upload again.');
      }

      session.category = interaction.values[0];
      console.log(`   🏷️ Category: ${session.category}`);

      // For team destination, show team member modal
      if (session.destination === 'team') {
        const modal = new ModalBuilder()
          .setCustomId(`team_modal_${timestamp}`)
          .setTitle('Team Member Details')
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('team_name')
                .setLabel('Name')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('John Smith')
                .setRequired(true)
                .setMaxLength(100)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('team_role')
                .setLabel('Role/Title')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Executive Director')
                .setRequired(true)
                .setMaxLength(100)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('team_bio')
                .setLabel('Bio (optional)')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('A short bio about this team member...')
                .setRequired(false)
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
              .setLabel('Caption for this image')
              .setStyle(TextInputStyle.Paragraph)
              .setValue(session.autoCaption)
              .setRequired(true)
              .setMaxLength(500)
          )
        );

      await interaction.showModal(modal);
    }

    // ───────────────────────────────────────────────────────────────────────────────
    // TEAM MODAL SUBMIT
    // ───────────────────────────────────────────────────────────────────────────────
    if (interaction.isModalSubmit() && interaction.customId.startsWith('team_modal_')) {
      const timestamp = parseInt(interaction.customId.split('_')[2]);
      const session = uploadSessions.get(timestamp);

      if (!session) {
        return await safeReply(interaction, '❌ Session expired. Please upload again.');
      }

      session.name = interaction.fields.getTextInputValue('team_name');
      session.role = interaction.fields.getTextInputValue('team_role');
      session.bio = interaction.fields.getTextInputValue('team_bio') || '';
      session.userCaption = `${session.name} - ${session.role}`;

      console.log(`   👤 Team member: ${session.name} (${session.role})`);

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
          { name: '📝 Bio', value: session.bio || 'No bio provided', inline: false }
        )
        .setFooter({ text: 'Click "Add to Team Page" to publish' });

      await safeReply(interaction, { embeds: [embed], components: [confirmRow] });
    }

    // ───────────────────────────────────────────────────────────────────────────────
    // CAPTION MODAL SUBMIT
    // ───────────────────────────────────────────────────────────────────────────────
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

    // ───────────────────────────────────────────────────────────────────────────────
    // PLATFORM BUTTONS
    // ───────────────────────────────────────────────────────────────────────────────
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

    // ───────────────────────────────────────────────────────────────────────────────
    // CONFIRM BUTTON
    // ───────────────────────────────────────────────────────────────────────────────
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

    // ───────────────────────────────────────────────────────────────────────────────
    // CANCEL BUTTON
    // ───────────────────────────────────────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════════════════════════
// ERROR HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════════════
// START BOT
// ═══════════════════════════════════════════════════════════════════════════════════════

console.log('🚀 Starting Care4ME Discord Bot...');
client.login(DISCORD_TOKEN);
