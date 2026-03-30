# Care4ME Discord Bot CMS Guide

This guide explains how to manage and update your Discord Bot, which currently acts as the backend Content Management System (CMS) for the Care4ME website.

## How to Add New Events (Categories)
As you run new events (like a "Summer Food Drive"), you'll want to add them to the bot so you can properly tag new photo uploads.

1. Open the file: `src/lib/discord-bot-interactive.js`
2. Scroll to roughly **Line 175** (or search for `categoryOptions` under the `session.destination === 'gallery'` area).
3. Add a new line with your event name. Follow the exact format below:

```javascript
categoryOptions = [
  { label: '📸 General Gallery', value: 'General Gallery' },
  { label: '❤️ Success Stories', value: 'Success Stories' },
  { label: '🎉 Event: Food Drive 2026', value: 'Event: Food Drive 2026' },
  { label: '🎉 Event: Spring Health Fair', value: 'Event: Spring Health Fair' },
  { label: '🎉 Event: Winter Formal', value: 'Event: Winter Formal' },
  // ADD YOUR NEW EVENT HERE:
  { label: '🎉 Event: Summer Cookout', value: 'Event: Summer Cookout' } // <-- New Line!
];
```

> **Important Constraints:** 
> * Discord only allows a **maximum of 25 items** in a single interactive dropdown list. If you exceed this, the bot will crash.
> * After saving the file, you **must restart the bot** in your terminal (press `Ctrl + C`, then type `npm run bot` again) for the new events to show up in Discord.

## How the Website Reads This
You do **not** need to update any website code (`GalleryClient.tsx`) when you add a new event to the bot! 

The Next.js Gallery Page is totally dynamic. It reads the `.json` metadata files inside `public/media-metadata/`. If a newly uploaded image is tagged with "Event: Summer Cookout" by the bot, that new event name will instantly appear as an option in the Gallery filter dropdown on the website!
