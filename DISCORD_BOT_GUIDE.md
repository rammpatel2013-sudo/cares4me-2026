# Care4ME Discord Bot Guide

This bot is the content pipeline for gallery uploads and blog publishing.

## Start and Stop Bot

1. Start: npm run bot
2. Stop: Ctrl + C in the bot terminal
3. Restart after code changes: Ctrl + C, then npm run bot

## Core Commands

1. !help
2. !list
3. !delete [number]
4. !delete all
5. !addcategory [name]
6. !blog [topic]
7. !blog-images [SESSION_ID] (attach images in the same message)
8. !blogs
9. !edit [number]
10. !delete-blog [number]

## Gallery Category Management

Use !addcategory to add a new category without editing code.

Example:

!addcategory Event: Summer Cookout

Notes:

1. Discord dropdown menus support up to 25 options.
2. New category names are stored in public/media-metadata/_categories.json.

## Blog Workflow (Current)

1. Run !blog [topic]
2. Select category
3. Fill modal fields:
   - Author name (optional)
   - Key points (required)
   - AI image prompt (optional)
4. Review generated blog text
5. Optional: upload your own images with !blog-images [SESSION_ID]
6. Click Publish

If no user image exists, bot generates an AI hero preview and shows buttons:

1. Use This Image
2. Regenerate Image
3. Cancel

Publish happens only after final approval.

## Image Priority Rules

When publishing a post, hero image priority is:

1. Uploaded image from !blog-images (first uploaded image)
2. Uploaded image attached directly in !blog command
3. Approved AI preview image
4. New AI generation

This ensures user-submitted hero image overrides AI hero image.

## Inline Images

If multiple user images are uploaded:

1. First image becomes hero image
2. Remaining images become inline article images

## Storage Locations

1. Blog posts: public/blog-posts
2. Blog images: public/blog-images
3. Gallery uploads: public/uploads
4. Gallery metadata: public/media-metadata

## Troubleshooting

### Interaction failed after category select

1. Restart the bot
2. Run !blog again
3. Confirm bot is running the latest code

### Blog page shows broken image

1. Confirm image exists in public/blog-images
2. Confirm post JSON has image value in public/blog-posts
3. Hard refresh browser once (Ctrl + F5)

### Uploaded image did not become hero

1. Use !blog-images [SESSION_ID] before final publish
2. Attach image files in the same message as !blog-images command
3. Confirm bot reply says uploaded hero will be used instead of AI
