# 🔧 Alternative Tunneling Solutions

If ngrok doesn't work due to PowerShell execution policy, here are alternatives:

## Option 1: Use npx (No Installation Needed)

```bash
npx ngrok http 5000
```

This downloads and runs ngrok temporarily without installing globally.

## Option 2: Download ngrok.exe Directly

1. Go to: https://ngrok.com/download
2. Download the Windows version
3. Extract `ngrok.exe` to a folder (e.g., `C:\ngrok\`)
4. Run:
   ```bash
   C:\ngrok\ngrok.exe http 5000
   ```
   Or add it to your PATH and just run: `ngrok http 5000`

## Option 3: Use localtunnel (Alternative to ngrok)

```bash
npm install -g localtunnel
lt --port 5000
```

This will give you a URL like: `https://random-name.loca.lt`

## Option 4: Use Cloudflare Tunnel (cloudflared)

```bash
# Install cloudflared
# Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

# Run tunnel
cloudflared tunnel --url http://localhost:5000
```

## Option 5: Fix PowerShell Execution Policy (Permanent)

Run PowerShell as Administrator and execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try `ngrok http 5000` again.

## Option 6: Use Command Prompt Instead of PowerShell

1. Open **Command Prompt** (cmd.exe) instead of PowerShell
2. Run: `ngrok http 5000`

Command Prompt doesn't have the same execution policy restrictions.

---

## 🎯 Recommended Quick Fix

**Easiest solution:** Use Command Prompt (cmd.exe) instead of PowerShell:

1. Press `Win + R`
2. Type: `cmd`
3. Press Enter
4. Navigate to your project: `cd C:\Users\Veera\Test_own_chat`
5. Run: `npx ngrok http 5000`

This should work without any execution policy issues!

