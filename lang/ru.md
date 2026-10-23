# NightAuth Discord Bot (Self-Hosted) — Поставьте нам звезду на GitHub ⭐

Официальный бот администрирования Discord для платформы [NightAuth](https://nightauth.org). Разработан на **TypeScript** с использованием **Discord.js v14**. Бот напрямую взаимодействует с Business API NightAuth, обеспечивая генерацию лицензий, создание учетных записей, управление HWID, администрирование нескольких приложений и динамическую поддержку 10 языков.

Официальный портал: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!NOTE]
> ### 📺 Видеоинструкции и руководства по настройке
> Официальные видеоуроки и пошаговые руководства по настройке приложений, тарифов, подписок, облачных переменных, вебхуков и лицензий в панели NightAuth скоро будут опубликованы на нашем официальном портале и YouTube-канале.

---

## Возможности

- 📱 **Мультиприложения**: Управляйте несколькими приложениями NightAuth одновременно из одного бота Discord.
- 🌐 **Динамическая поддержка 10 языков**: Выбирайте язык с помощью `/language`, `/lang` или интерактивных кнопок (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). Бот сохраняет предпочтения каждого администратора.
- 🎨 **Современный интерактивный интерфейс**: Построен на основе Discord Embeds, динамических кнопок и выпадающих меню выбора.
- 📝 **Нативные модальные окна Discord**: Всплывающие формы для генерации ключей, добавления пользователей и сброса HWID без ввода громоздких команд.
- ⚡ **Полный набор Slash-команд**:
  - `/panel`: Интерактивная панель управления с быстрыми действиями, переключением приложений и выбором языка.
  - `/app`: Просмотр статистики, приостановка входов и переключение между приложениями.
  - `/license`: Создание, просмотр, продление, блокировка, разблокировка и удаление лицензий.
  - `/user`: Создание аккаунтов, сброс HWID, бан/разбан, приостановка и просмотр профилей.
  - `/language` или `/lang`: Настройка личного языка интерфейса.
- 🔒 **Контроль доступа по ролям и ID**: Ограничение прав администратора по ID пользователей или ролей Discord.
- 🌐 **Чистая архитектура на TypeScript**: Автономное приложение, готовое к запуску на Node.js 18+, Docker и PM2.

---

## Предварительные требования

1. **Node.js**: `v18.0.0` или выше.
2. **Токен бота Discord**:
   - Откройте [Discord Developer Portal](https://discord.com/developers/applications).
   - Создайте приложение -> Перейдите в **Bot** -> Сбросьте и скопируйте токен.
   - Включите **Server Members Intent** в разделе Privileged Gateway Intents при фильтрации по ролям.
   - Перейдите в **OAuth2** -> **URL Generator** -> Выберите `bot` и `applications.commands` -> Назначьте права и пригласите бота на сервер.
3. **Ключ Business API NightAuth**:
   - Войдите в личный кабинет NightAuth.
   - Выберите ваше приложение -> Откройте **Business Settings**.
   - Скопируйте ключ `Business API Key` (`biz_...`).

---

## Установка и быстрый старт

### 1. Клонирование и установка зависимостей

```bash
cd clients/bots/NightAuth-Discord-Bot
pnpm install
```

### 2. Настройка переменных окружения

Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

Отредактируйте `.env`:

```env
# Данные Discord
DISCORD_TOKEN="ВАШ_ТОКЕН_БОТА"
DISCORD_CLIENT_ID="ВАШ_CLIENT_ID"
DISCORD_GUILD_ID="" # Опционально: ID сервера для быстрых тестов

# Business API NightAuth
NIGHTAUTH_API_URL="https://nightauth.org/api/business"

# Конфигурация мультиприложений (пары Имя:Ключ через запятую)
NIGHTAUTH_APPS="AppOne:biz_0123456789abcdef0123456789abcdef,AppTwo:biz_fedcba9876543210fedcba9876543210"

# Язык по умолчанию (en, es, fr, de, it, pt, ru, tr, pl, zh)
DEFAULT_LANGUAGE="ru"

# Контроль доступа (ID администраторов через запятую)
ADMIN_USER_IDS="123456789012345678"
ADMIN_ROLE_IDS="987654321098765432"
```

### 3. Регистрация Slash-команд

```bash
pnpm deploy-commands
```

### 4. Запуск бота

**Режим разработки (автоперезагрузка tsx):**
```bash
pnpm dev
```

**Сборка для продакшена:**
```bash
pnpm build
pnpm start
```

---

## Справочник Slash-команд

| Команда | Подкоманды / Параметры | Описание |
| :--- | :--- | :--- |
| `/panel` | Нет | Отображает панель управления с кнопками, селектором приложений и языков. |
| `/language` или `/lang` | `[код]` | Переключает язык (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). |
| `/app list` | Нет | Показывает список приложений и текущее активное приложение. |
| `/app switch` | `name` | Переключает активное приложение для вашей сессии. |
| `/app stats` | `[app]` | Статистика пользователей, лицензий и сессий в реальном времени. |
| `/app pause` | `[app]` | Режим обслуживания (приостановка входов пользователей). |
| `/app unpause` | `[app]` | Возобновление входов пользователей. |
| `/license create` | `[amount] [days] [level] [mask] [app]` | Генерация новых лицензионных ключей. |
| `/license list` | `[app]` | Список созданных лицензий и статус их активации. |
| `/license info` | `key [app]` | Полная информация о ключе (создатель, срок действия, статус). |
| `/license extend` | `key days [app]` | Продление срока действия лицензии на указанное количество дней. |
| `/license ban` | `key [reason] [app]` | Блокировка лицензии. |
| `/license unban` | `key [app]` | Разблокировка лицензии. |
| `/license delete` | `key [app]` | Безвозвратное удаление лицензии. |
| `/user list` | `[app]` | Список зарегистрированных пользователей. |
| `/user info` | `username [app]` | Профиль пользователя, привязка HWID и подписка. |
| `/user add` | `username password [email] [license] [app]` | Регистрация новой учетной записи пользователя. |
| `/user reset-hwid` | `username [app]` | Сброс привязки оборудования (HWID) пользователя. |
| `/user ban` | `username [reason] [app]` | Блокировка аккаунта пользователя. |
| `/user unban` | `username [app]` | Разблокировка аккаунта пользователя. |
| `/user pause` | `username [app]` | Временная приостановка действия аккаунта. |
| `/user unpause` | `username [app]` | Возобновление действия аккаунта. |
| `/user delete` | `username [app]` | Безвозвратное удаление учетной записи. |

---

## Развертывание в Docker

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

Сборка и запуск:
```bash
docker build -t nightauth-discord-bot .
docker run -d --name nightauth-discord --env-file .env nightauth-discord-bot
```

---

## Лицензия

Программное обеспечение распространяется на условиях [Elastic License 2.0](../LICENSE).
