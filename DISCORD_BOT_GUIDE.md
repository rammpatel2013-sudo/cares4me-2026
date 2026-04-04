# Care4ME Discord Bot Guide

This bot is the content pipeline for gallery uploads, blog publishing, campaign management, and singleton website page editing.

## Start and Stop Bot

1. Start: `npm run bot`
2. Stop: `Ctrl + C` in bot terminal
3. Restart after code changes: `Ctrl + C`, then `npm run bot`

## Core Commands

1. `!help`
2. `!all`
3. `!commands`
4. `!list`
5. `!delete [number]`
6. `!delete all`
7. `!addcategory [name]`
8. `!blog [topic]`
9. `!blog-images [SESSION_ID]` (attach images in same message)
10. `!blogs`
11. `!edit [number]`
12. `!delete-blog [number]`
13. `!pages`
14. `!page-edit [page] [section]`

## Campaign Commands

1. `!campaign-new` - create campaign through approval flow
2. `!campaign` - alias of `!campaign-new` (both currently work)
3. `!campaigns` - list campaigns
4. `!campaign-edit [number]` - edit and choose Active/Archived status
5. `!campaign-delete [number]` - delete with confirmation
6. `!campaign-clear-all` - delete all campaigns with confirmation
7. `!campaign-impact` - manually update impact counters

Recommended command for creating new campaigns: `!campaign-new`.

## Singleton Page Commands

Use these commands to update site pages that are not collections like blog, gallery, or campaigns.

1. `!pages` - list editable pages and sections
2. `!page-edit [page] [section]` - open edit flow for a specific singleton section

Current pages:

1. `home`
2. `about-us`
3. `donate`
4. `volunteer`
5. `contact-us`

Current editable sections:

1. `home hero`
2. `home hero-media`
3. `home stats`
4. `home featured`
5. `about-us hero`
6. `about-us impacts`
7. `about-us story`
8. `donate hero`
9. `donate tiers`
10. `volunteer hero`
11. `volunteer form`
12. `contact-us hero`
13. `contact-us cards`

Example:

`!page-edit home hero`

Flow:

1. Run the command
2. Review current section summary
3. Click `Open Editor`
4. Update fields in the modal
5. Review preview
6. Save or cancel

These edits update the JSON content files used by the website pages.

## Gallery Category Management

Use `!addcategory` to add a new category without editing code.

Example:

`!addcategory Event: Summer Cookout`

Notes:

1. Discord dropdown menus support up to 25 options.
2. New categories are stored in `public/media-metadata/_categories.json`.

## How to Update Gallery

Gallery updates are image-driven (not a text command).

1. Upload image directly in configured bot channel
2. In Step 1 destination dropdown, choose `Gallery`
3. In Step 2 choose a category (default or custom category)
4. Edit caption in Step 3
5. Select social sharing options or skip
6. Confirm publish

Useful commands for gallery maintenance:

1. `!list` - show uploaded items
2. `!delete [number]` - remove one item from list
3. `!delete all` - clear uploaded items
4. `!addcategory [name]` - add category option for future gallery uploads

Note: Campaign is no longer an image-upload destination in this flow. Campaigns should be managed with `!campaign-new` and campaign commands.

## How to Update Team

Team updates are also image-driven.

1. Upload image directly in configured bot channel
2. In Step 1 destination dropdown, choose `Team`
3. In Step 2 choose team category (Leadership, Volunteers, Staff, Board Members)
4. Team member modal opens automatically
5. Fill:
   - Name
   - Role/Title
   - Bio (optional)
6. Confirm `Add to Team Page`

After publish, metadata includes name/role/bio and destination=`team`.

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

## Website Behavior for Singleton Pages

1. Home, About Us, Donate, Volunteer, and Contact Us now load their main content from JSON files
2. Featured campaign on the home page can optionally connect to an active campaign by slug
3. If no linked active campaign exists, the home page uses the fallback featured campaign values stored in its page JSON
4. Runtime form behavior remains in code, but page copy and configurable options are now file-driven

## Storage Locations

1. Blog posts: `public/blog-posts`
2. Blog images: `public/blog-images`
3. Campaign files: `public/campaigns`
4. Campaign impact: `public/campaigns/_impact.json`
5. Gallery uploads: `public/uploads`
6. Gallery metadata: `public/media-metadata`
7. Singleton page content: `content/pages`

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

### Page edit command says page or section is invalid

1. Run `!pages` to confirm supported page keys and section keys
2. Use exact names like `about-us` or `hero-media`
3. Restart bot if commands were added recently and the old process is still running

### Singleton page changes do not appear on site

1. Confirm the edit was saved successfully in Discord
2. Check the matching file in `content/pages`
3. Refresh the browser once to pick up the latest dynamic page render

### PayPal/Venmo buttons not visible

1. Select preset amount or enter custom amount first
2. Confirm `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set on server
3. Run deploy sequence: pull, install, build, restart
