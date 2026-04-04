# Care4ME Discord Bot Guide

This bot is the content pipeline for gallery uploads, blog publishing, and campaign management.

## Start and Stop Bot

1. Start: `npm run bot`
2. Stop: `Ctrl + C` in bot terminal
3. Restart after code changes: `Ctrl + C`, then `npm run bot`

## Core Commands

1. `!help`
2. `!list`
3. `!delete [number]`
4. `!delete all`
5. `!addcategory [name]`
6. `!blog [topic]`
7. `!blog-images [SESSION_ID]` (attach images in same message)
8. `!blogs`
9. `!edit [number]`
10. `!delete-blog [number]`

## Campaign Commands

1. `!campaign-new` - create campaign through approval flow
2. `!campaign` - alias of `!campaign-new` (both currently work)
3. `!campaigns` - list campaigns
4. `!campaign-edit [number]` - edit and choose Active/Archived status
5. `!campaign-delete [number]` - delete with confirmation
6. `!campaign-clear-all` - delete all campaigns with confirmation
7. `!campaign-impact` - manually update impact counters

Recommended command for creating new campaigns: `!campaign-new`.

## Gallery Category Management

Use `!addcategory` to add a new category without editing code.

Example:

`!addcategory Event: Summer Cookout`

Notes:

1. Discord dropdown menus support up to 25 options.
2. New categories are stored in `public/media-metadata/_categories.json`.

## Blog Workflow (Current)

1. Run `!blog [topic]`
2. Select category
3. Fill modal fields:
   - Author name (optional)
   - Key points (required)
   - AI image prompt (optional)
4. Review generated blog text
5. Optional: upload your own images with `!blog-images [SESSION_ID]`
6. Approve publish

If no user image exists, bot generates an AI hero preview and shows:

1. Use This Image
2. Regenerate Image
3. Cancel

Publish happens only after final approval.

## Blog Image Priority Rules

When publishing a post, hero image priority is:

1. Uploaded image from `!blog-images` (first uploaded image)
2. Uploaded image attached directly in `!blog` flow
3. Approved AI preview image
4. New AI generation

This ensures user-submitted hero image overrides AI image.

## Campaign Workflow (Current)

1. Run `!campaign-new`
2. Fill modal fields:
   - Title
   - Description
   - Target amount/value
   - Raised amount/value
   - Beneficiaries/impact (optional)
3. Choose unit in Step 2:
   - Dollar Amount
   - Pairs of Shoes
   - Cans of Food
   - Clothing Items
   - Kits / Packages
   - General Items
   - Custom Unit
4. Review preview
5. Click Publish

For edit flow, use `!campaign-edit [number]` and then choose:

1. Save as Active
2. Save as Archived
3. Cancel

Archived campaigns are hidden from `/campaigns` and blocked from payment form.

## Website Behavior for Campaigns

1. Campaign listing page: `/campaigns`
2. Support button route: `/campaigns/[slug]/pay`
3. Payment page supports preset amounts + custom amount
4. PayPal/Venmo buttons appear only after valid amount selection

## Storage Locations

1. Blog posts: `public/blog-posts`
2. Blog images: `public/blog-images`
3. Campaign files: `public/campaigns`
4. Campaign impact: `public/campaigns/_impact.json`
5. Gallery uploads: `public/uploads`
6. Gallery metadata: `public/media-metadata`

## Troubleshooting

### Interaction failed after category select

1. Restart bot
2. Run `!blog` again
3. Confirm bot is latest code

### Blog page shows broken image

1. Confirm image exists in `public/blog-images`
2. Confirm post JSON references valid image
3. Hard refresh browser once (`Ctrl + F5`)

### Uploaded image did not become hero

1. Use `!blog-images [SESSION_ID]` before final publish
2. Attach image files in same message as command
3. Confirm bot response says uploaded hero will be used

### Campaign pay page returns 404

1. Confirm campaign exists in `public/campaigns` (non-archived)
2. Confirm URL slug matches campaign `slug` in JSON
3. Refresh campaign page and reopen support button

### PayPal/Venmo buttons not visible

1. Select preset amount or enter custom amount first
2. Confirm `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set on server
3. Run deploy sequence: pull, install, build, restart
