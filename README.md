# NightAuth Discord Bot (Self-Hosted) — Star us on GitHub ⭐

Official self-hosted Discord administration bot for [NightAuth](https://nightauth.org). Built with **TypeScript** and **Discord.js v14**, this bot connects directly to the NightAuth Business API to provide automated licensing, account provisioning, HWID management, multi-application administration, and dynamic 10-language internationalization.

Official Portal: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](README.md) • [Español](lang/es.md) • [Français](lang/fr.md) • [Deutsch](lang/de.md) • [Italiano](lang/it.md) • [Português](lang/pt.md) • [Русский](lang/ru.md) • [Türkçe](lang/tr.md) • [Polski](lang/pl.md) • [中文](lang/zh.md)

---

> [!TIP]
> ### 🔒 Recommended Package Manager: pnpm
> We strongly recommend using **pnpm** (`pnpm install -g pnpm` or `corepack enable`) instead of npm. **pnpm** provides superior supply-chain security, content-addressable storage, strict non-flat `node_modules` isolation (preventing phantom dependencies), and deterministic lockfile integrity.

---

> [!NOTE]
> ### 📺 Video Tutorials & System Setup Guides
> Official video tutorials and step-by-step guides explaining how to configure applications, plans, subscriptions, cloud variables, webhooks, and licenses in the NightAuth Dashboard will be published soon on our official portal and YouTube channel.

---

## Features

- 📱 **Multi-Application Support**: Connect and manage multiple NightAuth applications simultaneously from a single Discord bot.
- 🌐 **Dynamic 10-Language Support**: Choose your preferred language via `/language`, `/lang`, or interactive buttons (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). The bot remembers each administrator's language choice.
- 🎨 **Modern Interactive UI**: Built with rich Discord Embeds, dynamic Buttons, Action Rows, and interactive Select Menus.
- 📝 **Native Discord Modals**: Pop-up forms for license generation, user account creation, and HWID clearing without typing complex chat commands.
- ⚡ **Full Slash Command Coverage**:
  - `/panel`: Interactive graphical control panel with action buttons, language switcher, and app picker.
  - `/app`: View statistics, pause logins, and switch between applications.
  - `/license`: Create, inspect, extend, ban, unban, and delete licenses.
  - `/user`: Provision accounts, reset HWID locks, ban/unban, pause/unpause, and inspect profiles.
  - `/language` or `/lang`: Set your personal language preference.
- 🔒 **Role & User Access Control**: Restrict administrative commands to specified Discord User IDs or Server Role IDs.
- 🌐 **Clean TypeScript Architecture**: Standalone application compatible with Node.js 18+, Docker, and PM2.

---

## Prerequisites

1. **Node.js**: `v18.0.0` or higher.
2. **Package Manager**: **pnpm** is recommended for security and speed (`npm install -g pnpm` or `corepack enable`).
3. **Discord Bot Token**:
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications).
   - Create a New Application -> Go to **Bot** -> Reset Token -> Copy your token.
   - Under **Privileged Gateway Intents**, enable **Server Members Intent** if restricting by roles.
   - Go to **OAuth2** -> **URL Generator** -> Select `bot` and `applications.commands` -> Grant permissions (e.g. `Administrator` or Send Messages/Embed Links) -> Use the invite URL to add the bot to your server.
4. **NightAuth Business API Key**:
   - Access your NightAuth Dashboard.
   - Open your Application -> Navigate to **Business Settings**.
   - Copy your `Business API Key` (`biz_...`).

---

## Installation & Quick Start

### 1. Clone & Install Dependencies

```bash
cd clients/bots/NightAuth-Discord-Bot
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your preferred editor:

```env
# Discord Credentials
DISCORD_TOKEN="YOUR_BOT_TOKEN_HERE"
DISCORD_CLIENT_ID="YOUR_APPLICATION_CLIENT_ID"
DISCORD_GUILD_ID="" # Optional: guild ID for instant testing

# NightAuth Business API
NIGHTAUTH_API_URL="https://nightauth.org/api/business"

# Multi-App Configuration (Comma-separated Name:ApiKey pairs)
NIGHTAUTH_APPS="CheatsApp:biz_0123456789abcdef0123456789abcdef,ToolsApp:biz_fedcba9876543210fedcba9876543210"

# Default Language (en, es, fr, de, it, pt, ru, tr, pl, zh)
DEFAULT_LANGUAGE="en"

# Access Control (optional: comma-separated Discord IDs)
ADMIN_USER_IDS="123456789012345678"
ADMIN_ROLE_IDS="987654321098765432"
```

### 3. Deploy Slash Commands

Register all slash commands with Discord:

```bash
pnpm deploy-commands
```

### 4. Run the Bot

**Development Mode (Live Reloading via tsx):**
```bash
pnpm dev
```

**Production Build:**
```bash
pnpm build
pnpm start
```

---

## Multi-Application Setup

NightAuth Discord Bot natively supports managing multiple applications. You can define your applications in `.env` using any of the following formats:

### Format A: Comma-Separated Pairs (Recommended)
```env
NIGHTAUTH_APPS="AppOne:biz_key1,AppTwo:biz_key2,AppThree:biz_key3"
```

### Format B: JSON String
```env
NIGHTAUTH_APPS='[{"name":"AppOne","apiKey":"biz_key1"},{"name":"AppTwo","apiKey":"biz_key2"}]'
```

### Format C: Single Fallback App
```env
NIGHTAUTH_APP_NAME="MainApp"
NIGHTAUTH_BUSINESS_KEY="biz_key1"
```

When multiple applications are configured:
- Type `/panel` to view the control panel with an **App Selector dropdown menu**.
- Or use `/app switch <name>` to set your active app for subsequent commands.
- Or pass the optional `app:` parameter on any command (e.g. `/license create amount:5 app:AppTwo`).

---

## Slash Commands Reference

| Command | Subcommands / Options | Description |
| :--- | :--- | :--- |
| `/panel` | None | Displays the interactive control dashboard with action buttons, app switcher, and language button. |
| `/language` or `/lang` | `[code]` | Switches the interface language (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). |
| `/app list` | None | Lists all configured apps and shows the currently active application. |
| `/app switch` | `name` | Switches the active application for your session. |
| `/app stats` | `[app]` | Displays real-time user count, active licenses, sessions, and status. |
| `/app pause` | `[app]` | Pauses client logins for the application (maintenance mode). |
| `/app unpause` | `[app]` | Resumes client logins for the application. |
| `/license create` | `[amount] [days] [level] [mask] [app]` | Generates new license keys. |
| `/license list` | `[app]` | Lists generated license keys and usage status. |
| `/license info` | `key [app]` | Shows detailed license data (creator, used status, expiry). |
| `/license extend` | `key days [app]` | Extends the validity period of a license key. |
| `/license ban` | `key [reason] [app]` | Bans a license key. |
| `/license unban` | `key [app]` | Unbans a license key. |
| `/license delete` | `key [app]` | Permanently deletes a license key. |
| `/user list` | `[app]` | Lists registered application users. |
| `/user info` | `username [app]` | Inspects user profile, hardware ID, and subscription status. |
| `/user add` | `username password [email] [license] [app]` | Provisions a new user account. |
| `/user reset-hwid` | `username [app]` | Clears the hardware lock (HWID) for a user. |
| `/user ban` | `username [reason] [app]` | Bans a user account. |
| `/user unban` | `username [app]` | Unbans a user account. |
| `/user pause` | `username [app]` | Temporarily pauses a user account. |
| `/user unpause` | `username [app]` | Resumes a user account. |
| `/user delete` | `username [app]` | Permanently deletes a user account. |

---

## Deployment with Docker

A standard `Dockerfile` can be used to run the bot 24/7 in a lightweight container using **pnpm**:

```dockerfile
FROM node:20-alpine
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["node", "dist/index.js"]
```

Build and run:
```bash
docker build -t nightauth-discord-bot .
docker run -d --name nightauth-discord --env-file .env nightauth-discord-bot
```

---

## License

This software is licensed under the [Elastic License 2.0](LICENSE).
