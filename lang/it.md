# NightAuth Discord Bot (Self-Hosted) — Dacci una stella su GitHub ⭐

Bot ufficiale di amministrazione Discord self-hosted per [NightAuth](https://nightauth.org). Sviluppato con **TypeScript** e **Discord.js v14**, questo bot comunica direttamente con l'API Business di NightAuth per fornire rilascio licenze automatizzato, gestione account, azzeramento HWID, controllo multi-applicazione e supporto dinamico a 10 lingue.

Portale Ufficiale: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!NOTE]
> ### 📺 Tutorial Video e Guide di Configurazione
> I video tutorial ufficiali e le guide dettagliate passo-passo sulla configurazione di applicazioni, piani, abbonamenti, variabili cloud, webhook e licenze nella Dashboard di NightAuth saranno presto disponibili sul nostro portale e canale YouTube.

---

## Caratteristiche

- 📱 **Supporto Multi-Applicazione**: Gestisci contemporaneamente più applicazioni NightAuth da un unico bot Discord.
- 🌐 **Supporto Dinamico a 10 Lingue**: Seleziona la tua lingua preferita con `/language`, `/lang` o tramite pulsanti interattivi (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). Il bot ricorda la scelta di ogni amministratore.
- 🎨 **Interfaccia Utente Moderna**: Realizzata con Embed ricchi, pulsanti dinamici, righe di azioni e menu a tendina interattivi.
- 📝 **Modali Nativi Discord**: Moduli popup per generare codici licenza, creare account utente e resettare blocchi HWID senza scrivere complicati comandi testuali.
- ⚡ **Comandi Slash Completi**:
  - `/panel`: Pannello di controllo interattivo con pulsanti rapidi, selettore di app e cambio lingua.
  - `/app`: Consulta metriche, sospendi accessi e passa da un'app all'altra.
  - `/license`: Genera, consulta, estendi, banna, sbanna ed elimina licenze.
  - `/user`: Registra utenti, rimuovi blocchi HWID, gestisci ban/pause e visualizza profili.
  - `/language` o `/lang`: Imposta la tua lingua preferita.
- 🔒 **Controllo degli Accessi Avanzato**: Limita i comandi amministrativi agli ID utente o ruoli Discord autorizzati.
- 🌐 **Architettura Pulita in TypeScript**: Compatibile con Node.js 18+, Docker e PM2.

---

## Prerequisiti

1. **Node.js**: `v18.0.0` o superiore.
2. **Token del Bot Discord**:
   - Accedi al [Discord Developer Portal](https://discord.com/developers/applications).
   - Crea un'applicazione -> Vai su **Bot** -> Reset Token -> Copia il token.
   - Sotto **Privileged Gateway Intents**, attiva **Server Members Intent** per le restrizioni basate sui ruoli.
   - Vai su **OAuth2** -> **URL Generator** -> Seleziona `bot` e `applications.commands` -> Assegna i permessi e invita il bot nel tuo server.
3. **Chiave API Business NightAuth**:
   - Accedi alla Dashboard di NightAuth.
   - Seleziona la tua Applicazione -> Apri **Business Settings**.
   - Copia la tua `Business API Key` (`biz_...`).

---

## Installazione e Avvio Rapido

### 1. Clona e Installa le Dipendenze

```bash
cd clients/bots/NightAuth-Discord-Bot
pnpm install
```

### 2. Configura le Variabili d'Ambiente

Copia `.env.example` in `.env`:

```bash
cp .env.example .env
```

Modifica `.env`:

```env
# Credenziali Discord
DISCORD_TOKEN="IL_TUO_DISCORD_TOKEN"
DISCORD_CLIENT_ID="IL_TUO_CLIENT_ID"
DISCORD_GUILD_ID="" # Opzionale: ID del server per test istantanei

# API Business NightAuth
NIGHTAUTH_API_URL="https://nightauth.org/api/business"

# Configurazione Multi-App (Coppie Nome:ApiKey separate da virgola)
NIGHTAUTH_APPS="AppUno:biz_0123456789abcdef0123456789abcdef,AppDue:biz_fedcba9876543210fedcba9876543210"

# Lingua Predefinita (en, es, fr, de, it, pt, ru, tr, pl, zh)
DEFAULT_LANGUAGE="it"

# Controllo Accessi (ID Discord autorizzati separati da virgola)
ADMIN_USER_IDS="123456789012345678"
ADMIN_ROLE_IDS="987654321098765432"
```

### 3. Registra i Comandi Slash

```bash
pnpm deploy-commands
```

### 4. Avvia il Bot

**Modalità Sviluppo (Hot Reload con tsx):**
```bash
pnpm dev
```

**Produzione:**
```bash
pnpm build
pnpm start
```

---

## Guida ai Comandi Slash

| Comando | Sottocomandi / Parametri | Descrizione |
| :--- | :--- | :--- |
| `/panel` | Nessuno | Mostra il pannello di controllo con pulsanti e selettore lingua. |
| `/language` o `/lang` | `[codice]` | Cambia lingua (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). |
| `/app list` | Nessuno | Elenca le app collegate e contrassegna quella attiva. |
| `/app switch` | `name` | Seleziona l'applicazione attiva per la sessione corrente. |
| `/app stats` | `[app]` | Statistiche in tempo reale (utenti, licenze, sessioni). |
| `/app pause` | `[app]` | Attiva la modalità manutenzione (sospende i login). |
| `/app unpause` | `[app]` | Riattiva i login per l'applicazione. |
| `/license create` | `[amount] [days] [level] [mask] [app]` | Genera nuove chiavi di licenza. |
| `/license list` | `[app]` | Elenca le licenze e il rispettivo stato di attivazione. |
| `/license info` | `key [app]` | Visualizza i dettagli della licenza (data, creatore, scadenza). |
| `/license extend` | `key days [app]` | Estende la validità temporale della licenza. |
| `/license ban` | `key [reason] [app]` | Banna una licenza. |
| `/license unban` | `key [app]` | Sbanna una licenza. |
| `/license delete` | `key [app]` | Elimina definitivamente una licenza. |
| `/user list` | `[app]` | Elenca gli utenti registrati. |
| `/user info` | `username [app]` | Ispeziona il profilo utente, l'HWID e l'abbonamento. |
| `/user add` | `username password [email] [license] [app]` | Crea un nuovo account utente. |
| `/user reset-hwid` | `username [app]` | Azzera il blocco hardware ID di un utente. |
| `/user ban` | `username [reason] [app]` | Banna un account utente. |
| `/user unban` | `username [app]` | Sbanna un account utente. |
| `/user pause` | `username [app]` | Sospende temporaneamente un utente. |
| `/user unpause` | `username [app]` | Riattiva un account in pausa. |
| `/user delete` | `username [app]` | Rimuove definitivamente un utente. |

---

## Distribuzione con Docker

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

Compilazione ed esecuzione:
```bash
docker build -t nightauth-discord-bot .
docker run -d --name nightauth-discord --env-file .env nightauth-discord-bot
```

---

## Licenza

Questo software è distribuito sotto licenza [Elastic License 2.0](../LICENSE).
