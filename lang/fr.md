# NightAuth Discord Bot (Auto-hébergé) — Donnez-nous une étoile sur GitHub ⭐

Bot officiel d'administration Discord auto-hébergé pour [NightAuth](https://nightauth.org). Conçu avec **TypeScript** et **Discord.js v14**, ce bot se connecte directement à l'API Business de NightAuth pour automatiser la gestion des licences, la création de comptes, la réinitialisation HWID, l'administration multi-applications et la prise en charge dynamique de 10 langues.

Portail Officiel : [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!NOTE]
> ### 📺 Tutoriels Vidéo et Guides de Configuration
> Les tutoriels vidéo officiels et les guides détaillés pas à pas expliquant comment configurer vos applications, plans, abonnements, variables cloud, webhooks et licences sur le tableau de bord NightAuth seront publiés très prochainement sur notre portail et chaîne YouTube.

---

## Fonctionnalités

- 📱 **Support Multi-Applications** : Connectez et pilotez plusieurs applications NightAuth simultanément depuis un seul bot Discord.
- 🌐 **Internationalisation Dynamique (10 langues)** : Choisissez votre langue préférée via `/language`, `/lang` ou des boutons interactifs (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). Le bot mémorise le choix de chaque administrateur.
- 🎨 **Interface Moderne & Interactive** : Conçue avec des Discord Embeds riches, des boutons dynamiques et des menus déroulants interactifs.
- 📝 **Modales Natives Discord** : Formulaires contextuels pour générer des clés, créer des comptes et réinitialiser les verrous HWID sans saisir de commandes complexes.
- ⚡ **Commandes Slash Complètes** :
  - `/panel` : Tableau de bord interactif avec boutons d'actions, sélecteur d'application et sélection de langue.
  - `/app` : Affichez les métriques, activez le mode maintenance et basculez d'une application à l'autre.
  - `/license` : Créez, inspectez, prolongez, bannissez, débannissez et supprimez des clés de licence.
  - `/user` : Créez des comptes, supprimez les verrous HWID, gérez les bannissements et inspectez les profils.
  - `/language` ou `/lang` : Définissez votre langue personnelle.
- 🔒 **Contrôle d'Accès Sécurisé** : Restreignez les commandes aux identifiants utilisateurs ou rôles autorisés.
- 🌐 **Architecture TypeScript Propre** : Compatible Node.js 18+, Docker et PM2.

---

## Prérequis

1. **Node.js** : `v18.0.0` ou version supérieure.
2. **Token de Bot Discord** :
   - Rendez-vous sur le [Discord Developer Portal](https://discord.com/developers/applications).
   - Créez une Application -> Allez dans **Bot** -> Réinitialisez et copiez votre token.
   - Activez **Server Members Intent** dans les Privileged Gateway Intents si vous filtrez par rôles.
   - Dans **OAuth2** -> **URL Generator**, cochez `bot` et `applications.commands`, accordez les autorisations nécessaires et invitez le bot sur votre serveur.
3. **Clé API Business NightAuth** :
   - Connectez-vous au portail NightAuth.
   - Sélectionnez votre application -> Ouvrez **Business Settings**.
   - Copiez votre `Business API Key` (`biz_...`).

---

## Installation et Démarrage Rapide

### 1. Cloner et Installer les Dépendances

```bash
cd clients/bots/NightAuth-Discord-Bot
pnpm install
```

### 2. Configurer les Variables d'Environnement

Copiez le modèle `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Modifiez `.env` :

```env
# Informations Discord
DISCORD_TOKEN="VOTRE_TOKEN_BOT"
DISCORD_CLIENT_ID="VOTRE_CLIENT_ID"
DISCORD_GUILD_ID="" # Optionnel : ID du serveur pour test immédiat

# API Business NightAuth
NIGHTAUTH_API_URL="https://nightauth.org/api/business"

# Configuration Multi-Apps (paires Nom:CléAPI séparées par des virgules)
NIGHTAUTH_APPS="AppOne:biz_0123456789abcdef0123456789abcdef,AppTwo:biz_fedcba9876543210fedcba9876543210"

# Langue par Défaut (en, es, fr, de, it, pt, ru, tr, pl, zh)
DEFAULT_LANGUAGE="fr"

# Contrôle d'Accès (IDs Discord autorisés séparés par des virgules)
ADMIN_USER_IDS="123456789012345678"
ADMIN_ROLE_IDS="987654321098765432"
```

### 3. Déployer les Commandes Slash

```bash
pnpm deploy-commands
```

### 4. Lancer le Bot

**Mode Développement (Rechargement automatique avec tsx) :**
```bash
pnpm dev
```

**Production :**
```bash
pnpm build
pnpm start
```

---

## Configuration Multi-Applications

### Format A : Paires séparées par des virgules (Recommandé)
```env
NIGHTAUTH_APPS="AppOne:biz_key1,AppTwo:biz_key2,AppThree:biz_key3"
```

### Format B : Chaîne JSON
```env
NIGHTAUTH_APPS='[{"name":"AppOne","apiKey":"biz_key1"},{"name":"AppTwo","apiKey":"biz_key2"}]'
```

### Format C : Application Unique
```env
NIGHTAUTH_APP_NAME="MainApp"
NIGHTAUTH_BUSINESS_KEY="biz_key1"
```

---

## Référence des Commandes Slash

| Commande | Sous-commandes / Paramètres | Description |
| :--- | :--- | :--- |
| `/panel` | Aucun | Affiche le tableau de bord avec boutons d'actions rapides et sélecteur d'app. |
| `/language` ou `/lang` | `[code]` | Change la langue active (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). |
| `/app list` | Aucun | Liste toutes les applications et indique l'application active. |
| `/app switch` | `name` | Change l'application active pour votre session. |
| `/app stats` | `[app]` | Statistiques en temps réel (utilisateurs, licences, sessions). |
| `/app pause` | `[app]` | Active le mode maintenance (suspend les connexions). |
| `/app unpause` | `[app]` | Rétablit les connexions clients. |
| `/license create` | `[amount] [days] [level] [mask] [app]` | Génère de nouvelles licences. |
| `/license list` | `[app]` | Liste les licences et leur statut d'utilisation. |
| `/license info` | `key [app]` | Détails complets d'une licence (créateur, expiration, statut). |
| `/license extend` | `key days [app]` | Prolonge la validité d'une licence en jours. |
| `/license ban` | `key [reason] [app]` | Bannit une licence. |
| `/license unban` | `key [app]` | Débannit une licence. |
| `/license delete` | `key [app]` | Supprime définitivement une licence. |
| `/user list` | `[app]` | Liste les comptes utilisateurs enregistrés. |
| `/user info` | `username [app]` | Affiche le profil utilisateur, l'empreinte HWID et l'abonnement. |
| `/user add` | `username password [email] [license] [app]` | Crée un nouveau compte utilisateur. |
| `/user reset-hwid` | `username [app]` | Supprime le verrou HWID associé à un compte. |
| `/user ban` | `username [reason] [app]` | Bannit un utilisateur. |
| `/user unban` | `username [app]` | Débannit un utilisateur. |
| `/user pause` | `username [app]` | Met un compte utilisateur en pause temporaire. |
| `/user unpause` | `username [app]` | Réactive un compte utilisateur. |
| `/user delete` | `username [app]` | Supprime définitivement un utilisateur. |

---

## Déploiement Docker

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

Exécution :
```bash
docker build -t nightauth-discord-bot .
docker run -d --name nightauth-discord --env-file .env nightauth-discord-bot
```

---

## Licence

Ce logiciel est sous licence [Elastic License 2.0](../LICENSE).
