# NightAuth Discord 机器人（自托管）— 在 GitHub 上为我们点亮星标 ⭐

[NightAuth](https://nightauth.org) 官方自托管 Discord 管理机器人。基于 **TypeScript** 与 **Discord.js v14** 构建，直接对接 NightAuth Business API，提供自动化许可证分发、账户管理、HWID 解绑、多应用统一调度及动态 10 种语言国际化支持。

官方网站：[https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!NOTE]
> ### 📺 视频教程与系统配置指南
> 有关在 NightAuth 仪表板中配置应用程序、订阅计划、云变量、Webhook 和许可证的官方视频教程及分步指南将很快在我们的官方门户和 YouTube 频道上发布。

---

## 核心特性

- 📱 **多应用架构支持**：单个 Discord 机器人即可同时无缝接入与管理多个 NightAuth 独立应用。
- 🌐 **动态 10 种语言支持**：使用 `/language`、`/lang` 或点击交互式按钮随时切换语言（`en`、`es`、`fr`、`de`、`it`、`pt`, `ru`, `tr`, `pl`, `zh`）。机器人会自动保存每位管理员的语言偏好。
- 🎨 **现代化交互界面**：采用富文本 Discord Embed、动态操作按钮、交互式下拉选择菜单构建。
- 📝 **原生 Discord 模态弹窗 (Modals)**：无需在聊天框输入复杂指令，弹出表单即可快速生成密钥、创建用户或解绑机器码。
- ⚡ **完整斜杠指令集 (Slash Commands)**：
  - `/panel`：全功能可视化控制面板，提供快捷操作、应用切换与语言切换。
  - `/app`：查看实时统计数据、暂停客户端登录或切换当前会话应用。
  - `/license`：批量创建、查询、续期、封禁、解封及删除许可证。
  - `/user`：开通账户、重置硬件锁 (HWID)、封禁/解封、暂停及查询档案。
  - `/language` 或 `/lang`：设置个人偏好语言。
- 🔒 **严格角色与用户权限隔离**：可按指定 Discord 用户 ID 或服务器身份组限制管理权限。
- 🌐 **纯净 TypeScript 架构**：独立工程，完美兼容 Node.js 18+、Docker 与 PM2。

---

## 环境准备

1. **Node.js**：`v18.0.0` 或更高版本。
2. **Discord 机器人 Token**：
   - 访问 [Discord Developer Portal](https://discord.com/developers/applications)。
   - 创建新应用 -> 进入 **Bot** 页面 -> 重置并复制 Token。
   - 如需按身份组鉴权，请在 **Privileged Gateway Intents** 下开启 **Server Members Intent**。
   - 进入 **OAuth2** -> **URL Generator** -> 勾选 `bot` 与 `applications.commands` -> 分配权限后通过邀请链接添加至服务器。
3. **NightAuth Business API 密钥**：
   - 登录 NightAuth 控制台。
   - 打开您的应用 -> 进入 **Business Settings**。
   - 复制您的商业 API 密钥 `Business API Key` (`biz_...`)。

---

## 安装与快速启动

### 1. 克隆并安装依赖

```bash
cd clients/bots/NightAuth-Discord-Bot
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env`：

```env
# Discord 凭据
DISCORD_TOKEN="YOUR_BOT_TOKEN_HERE"
DISCORD_CLIENT_ID="YOUR_APPLICATION_CLIENT_ID"
DISCORD_GUILD_ID="" # 可选：用于即时调试的服务器 ID

# NightAuth Business API
NIGHTAUTH_API_URL="https://nightauth.org/api/business"

# 多应用配置（逗号分隔的 名称:ApiKey 键值对）
NIGHTAUTH_APPS="AppOne:biz_0123456789abcdef0123456789abcdef,AppTwo:biz_fedcba9876543210fedcba9876543210"

# 默认语言 (en, es, fr, de, it, pt, ru, tr, pl, zh)
DEFAULT_LANGUAGE="zh"

# 权限控制（逗号分隔的 Discord ID）
ADMIN_USER_IDS="123456789012345678"
ADMIN_ROLE_IDS="987654321098765432"
```

### 3. 同步注册斜杠命令

```bash
pnpm deploy-commands
```

### 4. 运行机器人

**开发模式（热重载运行）：**
```bash
pnpm dev
```

**生产环境构建运行：**
```bash
pnpm build
pnpm start
```

---

## 多应用配置说明

### 格式 A：逗号分隔键值对（推荐）
```env
NIGHTAUTH_APPS="AppOne:biz_key1,AppTwo:biz_key2,AppThree:biz_key3"
```

### 格式 B：JSON 字符串
```env
NIGHTAUTH_APPS='[{"name":"AppOne","apiKey":"biz_key1"},{"name":"AppTwo","apiKey":"biz_key2"}]'
```

### 格式 C：单应用模式
```env
NIGHTAUTH_APP_NAME="MainApp"
NIGHTAUTH_BUSINESS_KEY="biz_key1"
```

---

## 斜杠命令速查表

| 指令 | 子指令 / 参数 | 说明 |
| :--- | :--- | :--- |
| `/panel` | 无 | 打开可视化控制面板，支持快捷操作、应用选择与语言切换。 |
| `/language` 或 `/lang` | `[code]` | 切换界面语言（`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`）。 |
| `/app list` | 无 | 列出所有已配置应用并标明当前激活应用。 |
| `/app switch` | `name` | 为当前会话切换操作的应用。 |
| `/app stats` | `[app]` | 实时展示用户总数、有效卡密、在线会话及维护状态。 |
| `/app pause` | `[app]` | 开启维护模式（暂停客户端用户登录）。 |
| `/app unpause` | `[app]` | 恢复客户端用户登录。 |
| `/license create` | `[amount] [days] [level] [mask] [app]` | 批量生成新许可证卡密。 |
| `/license list` | `[app]` | 查看已生成许可证及其激活状态。 |
| `/license info` | `key [app]` | 查询指定卡密的详细属性（创建人、过期时间、绑定状态）。 |
| `/license extend` | `key days [app]` | 为卡密增加有效天数。 |
| `/license ban` | `key [reason] [app]` | 封禁指定许可证。 |
| `/license unban` | `key [app]` | 解封指定许可证。 |
| `/license delete` | `key [app]` | 永久删除指定许可证。 |
| `/user list` | `[app]` | 列出应用注册用户列表。 |
| `/user info` | `username [app]` | 查询用户档案、硬件码 (HWID) 及订阅状态。 |
| `/user add` | `username password [email] [license] [app]` | 创建新用户账户。 |
| `/user reset-hwid` | `username [app]` | 重置用户的硬件特征码绑定。 |
| `/user ban` | `username [reason] [app]` | 封禁用户账户。 |
| `/user unban` | `username [app]` | 解封用户账户。 |
| `/user pause` | `username [app]` | 临时暂停用户使用权限。 |
| `/user unpause` | `username [app]` | 恢复被暂停的用户账户。 |
| `/user delete` | `username [app]` | 永久注销用户账户。 |

---

## Docker 容器化部署

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

构建并启动：
```bash
docker build -t nightauth-discord-bot .
docker run -d --name nightauth-discord --env-file .env nightauth-discord-bot
```

---

## 许可证

本软件基于 [Elastic License 2.0](../LICENSE) 协议发布。
