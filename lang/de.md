# NightAuth Discord Bot (Self-Hosted) — Gib uns einen Stern auf GitHub ⭐

Offizieller selbst gehosteter Discord-Verwaltungsbot für [NightAuth](https://nightauth.org). Entwickelt mit **TypeScript** und **Discord.js v14**, verbindet sich dieser Bot direkt mit der NightAuth Business-API und ermöglicht automatisierte Lizenzierung, Benutzerkonten-Erstellung, HWID-Verwaltung, Multi-App-Administration und dynamische Mehrsprachigkeit in 10 Sprachen.

Offizielles Portal: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!NOTE]
> ### 📺 Video-Tutorials und Einrichtungsleitfäden
> Offizielle Video-Tutorials und detaillierte Schritt-für-Schritt-Anleitungen zur Konfiguration von Anwendungen, Plänen, Abonnements, Cloud-Variablen, Webhooks und Lizenzen im NightAuth-Dashboard werden in Kürze auf unserem offiziellen Portal und YouTube-Kanal veröffentlicht.

---

## Funktionen

- 📱 **Multi-Anwendungs-Unterstützung**: Verwalten Sie mehrere NightAuth-Anwendungen gleichzeitig über einen einzigen Discord-Bot.
- 🌐 **Dynamische Mehrsprachigkeit (10 Sprachen)**: Wechseln Sie Ihre Sprache per `/language`, `/lang` oder interaktive Buttons (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). Der Bot speichert die Sprache jedes Administrators.
- 🎨 **Moderne interaktive Benutzeroberfläche**: Realisiert mit detaillierten Discord Embeds, Aktions-Buttons und interaktiven Auswahlmenüs.
- 📝 **Native Discord-Modals**: Popup-Formulare zum Generieren von Lizenzen, Anlegen von Benutzern und Zurücksetzen von HWID-Sperren ohne komplexe Chat-Befehle.
- ⚡ **Vollständige Slash-Befehle**:
  - `/panel`: Interaktives Kontrollzentrum mit Schnellaktions-Buttons, App-Wechsler und Sprachauswahl.
  - `/app`: Statistiken anzeigen, Logins pausieren und aktive Anwendung wechseln.
  - `/license`: Lizenzen erstellen, prüfen, verlängern, sperren, entsperren und löschen.
  - `/user`: Benutzer anlegen, HWID-Sperren aufheben, bannen/entbannen, pausieren und Profile einsehen.
  - `/language` oder `/lang`: Persönliche Spracheinstellung festlegen.
- 🔒 **Rollen- & Benutzer-Zugriffskontrolle**: Schränken Sie administrative Befehle auf autorisierte Discord-Nutzer-IDs oder Server-Rollen-IDs ein.
- 🌐 **Saubere TypeScript-Architektur**: Eigenständige Anwendung, kompatibel mit Node.js 18+, Docker und PM2.

---

## Voraussetzungen

1. **Node.js**: Version `v18.0.0` oder höher.
2. **Discord Bot Token**:
   - Öffnen Sie das [Discord Developer Portal](https://discord.com/developers/applications).
   - Neue Anwendung erstellen -> **Bot** -> Token zurücksetzen und kopieren.
   - Aktivieren Sie unter **Privileged Gateway Intents** den **Server Members Intent**, falls Sie Befehle nach Rollen einschränken möchten.
   - Unter **OAuth2** -> **URL Generator** wählen Sie `bot` und `applications.commands`, vergeben Berechtigungen und laden den Bot auf Ihren Server ein.
3. **NightAuth Business-API-Schlüssel**:
   - Melden Sie sich im NightAuth Dashboard an.
   - Öffnen Sie Ihre Anwendung -> **Business Settings**.
   - Kopieren Sie Ihren `Business API Key` (`biz_...`).

---

## Installation & Schnellstart

### 1. Klonen & Abhängigkeiten installieren

```bash
cd clients/bots/NightAuth-Discord-Bot
pnpm install
```

### 2. Umgebungsvariablen konfigurieren

Kopieren Sie `.env.example` nach `.env`:

```bash
cp .env.example .env
```

Bearbeiten Sie die Datei `.env`:

```env
# Discord-Zugangsdaten
DISCORD_TOKEN="IHR_DISCORD_BOT_TOKEN"
DISCORD_CLIENT_ID="IHRE_CLIENT_ID"
DISCORD_GUILD_ID="" # Optional: Server-ID für sofortige Tests

# NightAuth Business API
NIGHTAUTH_API_URL="https://nightauth.org/api/business"

# Multi-App-Konfiguration (Kommagetrennte Name:Schlüssel-Paare)
NIGHTAUTH_APPS="AppEins:biz_0123456789abcdef0123456789abcdef,AppZwei:biz_fedcba9876543210fedcba9876543210"

# Standardsprache (en, es, fr, de, it, pt, ru, tr, pl, zh)
DEFAULT_LANGUAGE="de"

# Zugriffskontrolle (Kommagetrennte IDs autorisierter Administratoren)
ADMIN_USER_IDS="123456789012345678"
ADMIN_ROLE_IDS="987654321098765432"
```

### 3. Slash-Befehle registrieren

```bash
pnpm deploy-commands
```

### 4. Bot starten

**Entwicklungsmodus (Hot-Reload mit tsx):**
```bash
pnpm dev
```

**Produktion:**
```bash
pnpm build
pnpm start
```

---

## Slash-Befehlsübersicht

| Befehl | Unterbefehle / Parameter | Beschreibung |
| :--- | :--- | :--- |
| `/panel` | Keine | Öffnet das interaktive Dashboard mit Aktions-Buttons und Sprachauswahl. |
| `/language` oder `/lang` | `[code]` | Wechselt die Sprache (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). |
| `/app list` | Keine | Zeigt alle konfigurierten Anwendungen und hebt die aktive hervor. |
| `/app switch` | `name` | Wechselt die aktive Anwendung für Ihre Sitzung. |
| `/app stats` | `[app]` | Echtzeit-Statistiken zu Benutzern, Lizenzen und Sitzungen. |
| `/app pause` | `[app]` | Wartungsmodus aktivieren (Logins pausieren). |
| `/app unpause` | `[app]` | Logins für die Anwendung wieder freigeben. |
| `/license create` | `[amount] [days] [level] [mask] [app]` | Neue Lizenzschlüssel generieren. |
| `/license list` | `[app]` | Vorhandene Lizenzen und deren Nutzungsstatus auflisten. |
| `/license info` | `key [app]` | Detailinformationen zu einer Lizenz abrufen. |
| `/license extend` | `key days [app]` | Gültigkeit einer Lizenz um Tage verlängern. |
| `/license ban` | `key [reason] [app]` | Eine Lizenz sperren. |
| `/license unban` | `key [app]` | Eine Lizenz entsperren. |
| `/license delete` | `key [app]` | Eine Lizenz unwiderruflich löschen. |
| `/user list` | `[app]` | Registrierte Benutzerkonten auflisten. |
| `/user info` | `username [app]` | Benutzerprofil, HWID-Status und Abonnement anzeigen. |
| `/user add` | `username password [email] [license] [app]` | Ein neues Benutzerkonto anlegen. |
| `/user reset-hwid` | `username [app]` | HWID-Bindung eines Benutzers zurücksetzen. |
| `/user ban` | `username [reason] [app]` | Benutzerkonto sperren. |
| `/user unban` | `username [app]` | Benutzerkonto entsperren. |
| `/user pause` | `username [app]` | Benutzerkonto temporär pausieren. |
| `/user unpause` | `username [app]` | Benutzerkonto reaktivieren. |
| `/user delete` | `username [app]` | Benutzerkonto dauerhaft löschen. |

---

## Docker-Bereitstellung

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

Erstellen und starten:
```bash
docker build -t nightauth-discord-bot .
docker run -d --name nightauth-discord --env-file .env nightauth-discord-bot
```

---

## Lizenz

Diese Software ist unter der [Elastic License 2.0](../LICENSE) lizenziert.
