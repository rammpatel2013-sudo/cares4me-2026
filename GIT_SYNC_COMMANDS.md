# Git Sync Commands

This project should sync through GitHub.

That means:
- Server does `commit -> push to GitHub`
- Laptop does `pull from GitHub`

Or:
- Laptop does `commit -> push to GitHub`
- Server does `pull from GitHub`

There is no direct `push to folder` between the server and laptop with Git. One side pushes to GitHub, and the other side pulls from GitHub.

## 1. Server To GitHub To Laptop

Run these on the website server:

```bash
cd /root/cares4me-2026
git status
git add -A
git commit -m "Update site from server"
git push origin main
```

Then run these on your laptop PowerShell:

```powershell
cd "C:\Users\drmit\Desktop\cares4me-clean - Copy"
git pull origin main
```

## 2. Laptop To GitHub To Server

Run these on your laptop PowerShell:

```powershell
cd "C:\Users\drmit\Desktop\cares4me-clean - Copy"
git status
git add -A
git commit -m "Update site from laptop"
git push origin main
```

Then run these on the website server:

```bash
cd /root/cares4me-2026
git pull origin main
```

## 3. If Git Says There Are Local Changes

If the machine you are pulling on already has uncommitted changes, do one of these first.

Commit them:

```bash
git add -A
git commit -m "Save local changes"
git pull --rebase origin main
```

Or stash them:

```bash
git stash
git pull origin main
git stash pop
```

PowerShell uses the same git commands:

```powershell
git stash
git pull origin main
git stash pop
```

## 4. Check Which Remote Is Connected

Run this on either machine:

```bash
git remote -v
```

If needed, set the GitHub remote:

```bash
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
```

## 5. Recommended Workflow

Best routine:
- Make code changes on your laptop
- `git add -A`
- `git commit -m "message"`
- `git push origin main`
- SSH into server
- `git pull origin main`

Use server-side push only for emergency live fixes.