# PayPal and Venmo Update Guide

This guide explains exactly how to update and verify the campaign payment flow using PayPal Smart Buttons (including Venmo where available).

## What This Update Does

1. Adds campaign payment route: `/campaigns/[slug]/pay`
2. Shows preset donation amounts plus custom amount
3. Loads PayPal Smart Buttons
4. Shows Venmo option for eligible users
5. Blocks archived campaigns from payment form

## Prerequisites

1. A PayPal Business account
2. Access to PayPal Developer Dashboard
3. Server shell access
4. GitHub repo access

## Step 1: Create or Locate PayPal App

1. Open `https://developer.paypal.com`
2. Sign in with your PayPal account
3. Go to Apps and Credentials
4. Create app (or open existing app)
5. Copy Client ID

Use Sandbox Client ID for testing first, then Live Client ID for production.

## Step 2: Set Environment Variable

Set this in your environment file on server:

`NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID`

If you keep env values in `.env.local`, update that file in your app directory.

## Step 3: Pull Latest Code on Server

Run in server terminal:

1. `cd ~/cares4me-2026`
2. `git checkout main`
3. `git pull origin main`

## Step 4: Install Dependencies

1. `npm install`
2. `npm install @paypal/react-paypal-js`

If install fails, run:

1. `npm cache clean --force`
2. `npm install`

## Step 5: Build and Restart

1. `npm run build`
2. `pm2 restart all`
3. `pm2 save`
4. `pm2 status`

Expected: process is online and no crash loop.

## Step 6: Verify Website Flow

1. Open `/campaigns`
2. Click `Support This Campaign`
3. Confirm route is `/campaigns/<slug>/pay`
4. Confirm amount chips appear (`$10`, `$25`, `$50`, `$100`)
5. Confirm custom amount field works
6. Confirm PayPal/Venmo buttons appear only after valid amount

## Step 6A: How Venmo Works

Venmo is not a separate payment integration in this project. It is provided through PayPal Smart Buttons.

What this means:

1. The website loads PayPal Smart Buttons using your PayPal Client ID.
2. PayPal decides which buttons to show for that visitor.
3. Eligible Venmo users may see a Venmo button.
4. Other users may see PayPal and Debit/Credit Card options instead.
5. All payments still flow into your PayPal Business account.

Important notes:

1. Venmo availability depends on PayPal account eligibility, region, device, and browser.
2. If Venmo is not available, the site should still show PayPal or card payment options.
3. You do not need a second Venmo-only code path.

How to verify Venmo specifically:

1. Open a live campaign pay page on a supported mobile device or compatible browser.
2. Select a valid amount.
3. Check whether PayPal renders a Venmo button.
4. If Venmo is not shown, confirm another payment method is still available.

## Step 7: Verify Archived Campaign Protection

1. Archive campaign from Discord (`!campaign-edit [number]` then Save as Archived)
2. Confirm campaign is hidden from `/campaigns`
3. Open `/campaigns/<slug>/pay` directly
4. Confirm `Campaign Closed` appears and payment form is blocked

## Step 8: Discord Campaign Command Reference

1. `!campaign-new` (recommended create command)
2. `!campaign` (alias of `!campaign-new`)
3. `!campaigns`
4. `!campaign-edit [number]`
5. `!campaign-delete [number]`
6. `!campaign-clear-all`
7. `!campaign-impact`

## Step 9: Rollback (If Needed)

If production issue appears after deploy:

1. `git checkout main`
2. `git pull origin main`
3. `git revert <bad_commit_hash>`
4. `git push origin main`
5. `npm install`
6. `npm run build`
7. `pm2 restart all`

## Common Issues

### Build error: Cannot find module @paypal/react-paypal-js

Fix:

1. `npm install @paypal/react-paypal-js`
2. `npm run build`

### PayPal buttons do not show

Check:

1. `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set
2. Valid donation amount selected
3. Build and restart completed after env update

### Campaign pay page 404

Check:

1. Campaign exists in `public/campaigns`
2. URL slug matches campaign slug in JSON
3. Campaign is not archived
