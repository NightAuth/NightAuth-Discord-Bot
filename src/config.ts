import dotenv from "dotenv";

dotenv.config();

export interface AppConfig {
  name: string;
  apiKey: string;
}

export interface BotConfig {
  token: string;
  clientId: string;
  guildId?: string;
  apiUrl: string;
  apps: AppConfig[];
  adminUserIds: Set<string>;
  adminRoleIds: Set<string>;
  defaultLanguage: string;
}

function parseAppsFromEnv(): AppConfig[] {
  const apps: AppConfig[] = [];
  const rawApps = process.env.NIGHTAUTH_APPS?.trim();

  if (rawApps) {
    if (rawApps.startsWith("[") || rawApps.startsWith("{")) {
      try {
        const parsed = JSON.parse(rawApps);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of list) {
          const name = item.name || item.appName || item.title;
          const apiKey = item.apiKey || item.businessKey || item.key;
          if (name && apiKey) {
            apps.push({ name: String(name).trim(), apiKey: String(apiKey).trim() });
          }
        }
      } catch (err) {
        console.warn("[Config] Failed to parse NIGHTAUTH_APPS as JSON:", err);
      }
    }

    if (apps.length === 0) {
      // Split by comma: "App1:biz_key1,App2:biz_key2"
      const entries = rawApps.split(",");
      for (const entry of entries) {
        const colonIndex = entry.indexOf(":");
        if (colonIndex > 0) {
          const name = entry.slice(0, colonIndex).trim();
          const apiKey = entry.slice(colonIndex + 1).trim();
          if (name && apiKey) {
            apps.push({ name, apiKey });
          }
        }
      }
    }
  }

  // Fallback to individual numbered variables: NIGHTAUTH_APP_1_NAME / KEY
  for (let i = 1; i <= 20; i++) {
    const name = process.env[`NIGHTAUTH_APP_${i}_NAME`]?.trim();
    const apiKey = (
      process.env[`NIGHTAUTH_APP_${i}_KEY`] ||
      process.env[`NIGHTAUTH_APP_${i}_API_KEY`] ||
      process.env[`NIGHTAUTH_APP_${i}_BUSINESS_KEY`]
    )?.trim();
    if (name && apiKey) {
      if (!apps.some((a) => a.name.toLowerCase() === name.toLowerCase())) {
        apps.push({ name, apiKey });
      }
    }
  }

  // Fallback to single app env: NIGHTAUTH_BUSINESS_KEY / NIGHTAUTH_APP_NAME
  const singleKey = (
    process.env.NIGHTAUTH_BUSINESS_KEY ||
    process.env.NIGHTAUTH_API_KEY ||
    process.env.BUSINESS_KEY
  )?.trim();
  const singleName = process.env.NIGHTAUTH_APP_NAME?.trim() || "DefaultApp";

  if (singleKey && !apps.some((a) => a.apiKey === singleKey)) {
    apps.push({ name: singleName, apiKey: singleKey });
  }

  return apps;
}

function parseIdSet(raw?: string): Set<string> {
  const set = new Set<string>();
  if (!raw) return set;
  for (const part of raw.split(/[\s,]+/)) {
    const trimmed = part.trim();
    if (trimmed && /^\d+$/.test(trimmed)) {
      set.add(trimmed);
    }
  }
  return set;
}

export function loadConfig(): BotConfig {
  const token = process.env.DISCORD_TOKEN?.trim() || "";
  const clientId = process.env.DISCORD_CLIENT_ID?.trim() || "";
  const guildId = process.env.DISCORD_GUILD_ID?.trim() || undefined;
  const apiUrl = (
    process.env.NIGHTAUTH_API_URL?.trim() || "https://nightauth.org/api/business"
  ).replace(/\/+$/, "");

  const apps = parseAppsFromEnv();
  const adminUserIds = parseIdSet(process.env.ADMIN_USER_IDS);
  const adminRoleIds = parseIdSet(process.env.ADMIN_ROLE_IDS);
  const defaultLanguage = (process.env.DEFAULT_LANGUAGE?.trim() || "en").toLowerCase();

  return {
    token,
    clientId,
    guildId,
    apiUrl,
    apps,
    adminUserIds,
    adminRoleIds,
    defaultLanguage,
  };
}

export const config = loadConfig();
