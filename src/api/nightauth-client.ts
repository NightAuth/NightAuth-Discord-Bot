export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  keys?: string[];
  key?: string;
  [key: string]: any;
}

export interface LicenseItem {
  id: number;
  key: string;
  level: number;
  note?: string | null;
  status: string;
  used: boolean;
  usedBy?: string | null;
  usedAt?: string | null;
  durationDays?: number;
  bannedReason?: string | null;
  createdAt: string;
}

export interface UserItem {
  id: number;
  username: string;
  email?: string | null;
  status: string;
  hwid?: string | null;
  ip?: string | null;
  lastLogin?: string | null;
  createdAt: string;
  subscription?: {
    level: number;
    expiresAt?: string | null;
  } | null;
}

export interface AppStats {
  appName?: string;
  usersCount?: number;
  licensesCount?: number;
  activeLicensesCount?: number;
  sessionsCount?: number;
  paused?: boolean;
  [key: string]: any;
}

export class NightAuthClient {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl.replace(/\/+$/, "");
    this.apiKey = apiKey.trim();
  }

  private async request<T = any>(
    action: string,
    params: Record<string, any> = {},
  ): Promise<ApiResponse<T>> {
    const payload = {
      type: action,
      ...params,
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      const json = (await response.json().catch(() => null)) as Record<string, any> | null;

      if (!response.ok) {
        const errorMsg =
          json?.message ||
          json?.error ||
          json?.details ||
          `HTTP Error ${response.status}: ${response.statusText}`;
        return {
          success: false,
          error: errorMsg,
          ...(json || {}),
        };
      }

      return {
        success: true,
        ...(json || {}),
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Failed to communicate with NightAuth Business API",
      };
    }
  }

  // --- Licenses ---

  async createLicenses(options: {
    amount: number;
    mask?: string;
    level?: number;
    expiry?: number;
    note?: string;
  }): Promise<ApiResponse> {
    return this.request("add", {
      amount: options.amount,
      mask: options.mask || "NA-*****-*****-*****",
      level: options.level || 1,
      expiry: options.expiry || 30,
      note: options.note || "Created via Discord Bot",
    });
  }

  async listLicenses(): Promise<ApiResponse<{ licenses: LicenseItem[] }>> {
    return this.request("fetchallkeys");
  }

  async getLicense(key: string): Promise<ApiResponse<{ license: LicenseItem }>> {
    return this.request("info", { key });
  }

  async getLicenseByUser(user: string): Promise<ApiResponse<{ key: string; license?: LicenseItem }>> {
    return this.request("getkey", { user });
  }

  async banLicense(key: string, reason?: string): Promise<ApiResponse> {
    return this.request("ban", {
      key,
      status: "banned",
      reason: reason || "Banned via Discord Bot",
    });
  }

  async unbanLicense(key: string): Promise<ApiResponse> {
    return this.request("unban", { key, status: "active" });
  }

  async deleteLicense(key: string): Promise<ApiResponse> {
    return this.request("del", { key });
  }

  async addLicenseTime(key: string, days: number): Promise<ApiResponse> {
    return this.request("addtime", { key, time: days });
  }

  // --- Users ---

  async listUsers(): Promise<ApiResponse<{ users: UserItem[] }>> {
    return this.request("fetchallusers");
  }

  async getUser(user: string): Promise<ApiResponse<{ user: UserItem }>> {
    return this.request("userdata", { user });
  }

  async createUser(options: {
    username: string;
    password?: string;
    email?: string;
    key?: string;
  }): Promise<ApiResponse> {
    return this.request("adduser", {
      user: options.username,
      password: options.password,
      email: options.email,
      key: options.key,
    });
  }

  async banUser(user: string, reason?: string): Promise<ApiResponse> {
    return this.request("banuser", {
      user,
      reason: reason || "Banned via Discord Bot",
    });
  }

  async unbanUser(user: string): Promise<ApiResponse> {
    return this.request("unbanuser", { user });
  }

  async pauseUser(user: string): Promise<ApiResponse> {
    return this.request("pauseuser", { user });
  }

  async unpauseUser(user: string): Promise<ApiResponse> {
    return this.request("unpauseuser", { user });
  }

  async resetUserHwid(user: string): Promise<ApiResponse> {
    return this.request("resetuser", { user });
  }

  async deleteUser(user: string): Promise<ApiResponse> {
    return this.request("deluser", { user });
  }

  // --- App Operations ---

  async getStats(): Promise<ApiResponse<AppStats>> {
    return this.request("stats");
  }

  async getAppDetails(): Promise<ApiResponse> {
    return this.request("appdetails");
  }

  async pauseApp(): Promise<ApiResponse> {
    return this.request("pauseapp");
  }

  async unpauseApp(): Promise<ApiResponse> {
    return this.request("unpauseapp");
  }
}
