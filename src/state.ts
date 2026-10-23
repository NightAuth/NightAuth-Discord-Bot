import { GuildMember, User } from "discord.js";
import { AppConfig, config } from "./config";
import { NightAuthClient } from "./api/nightauth-client";

// In-memory mapping of userId/guildId -> activeAppName
const userActiveApp = new Map<string, string>();
const guildActiveApp = new Map<string, string>();

export function getAvailableApps(): AppConfig[] {
  return config.apps;
}

export function getAppByName(name?: string | null): AppConfig | undefined {
  if (!name) return undefined;
  const lower = name.trim().toLowerCase();
  return config.apps.find((a) => a.name.toLowerCase() === lower);
}

export function getDefaultApp(): AppConfig {
  if (config.apps.length === 0) {
    throw new Error(
      "No NightAuth applications configured! Please check your .env file and set NIGHTAUTH_APPS.",
    );
  }
  return config.apps[0];
}

export function setActiveApp(contextId: string, appName: string): boolean {
  const app = getAppByName(appName);
  if (!app) return false;
  userActiveApp.set(contextId, app.name);
  return true;
}

export function getActiveApp(userId: string, guildId?: string | null): AppConfig {
  if (config.apps.length === 0) {
    throw new Error("No NightAuth applications configured in .env!");
  }

  // 1. Check user preference
  const userPreferred = userActiveApp.get(userId);
  if (userPreferred) {
    const found = getAppByName(userPreferred);
    if (found) return found;
  }

  // 2. Check guild preference
  if (guildId) {
    const guildPreferred = guildActiveApp.get(guildId);
    if (guildPreferred) {
      const found = getAppByName(guildPreferred);
      if (found) return found;
    }
  }

  // 3. Fallback to first configured app
  return getDefaultApp();
}

export function getClientForApp(app: AppConfig): NightAuthClient {
  return new NightAuthClient(config.apiUrl, app.apiKey);
}

export function isUserAdmin(user: User, member?: GuildMember | null): boolean {
  // If no admin restrictions configured, allow server administrators or all
  if (config.adminUserIds.size === 0 && config.adminRoleIds.size === 0) {
    if (member?.permissions.has("Administrator")) return true;
    // If not in a guild (e.g. DM), allow
    return true;
  }

  // Check specific User ID
  if (config.adminUserIds.has(user.id)) {
    return true;
  }

  // Check Guild Member Roles & Administrator permission
  if (member) {
    if (member.permissions.has("Administrator")) return true;
    for (const roleId of config.adminRoleIds) {
      if (member.roles.cache.has(roleId)) return true;
    }
  }

  return false;
}

const userLanguage = new Map<string, string>();

export function getUserLanguage(userId: string): string {
  return userLanguage.get(userId) || config.defaultLanguage || "en";
}

export function setUserLanguage(userId: string, lang: string): boolean {
  const code = lang.trim().toLowerCase();
  userLanguage.set(userId, code);
  return true;
}
