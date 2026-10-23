# NightAuth Discord Bot (Auto-alojado) — Danos una estrella en GitHub ⭐

Bot oficial de administración para Discord auto-alojado para [NightAuth](https://nightauth.org). Desarrollado con **TypeScript** y **Discord.js v14**, este bot se conecta directamente con la API Business de NightAuth para brindar licenciamiento automatizado, aprovisionamiento de cuentas, gestión de HWID, administración multi-aplicación e internacionalización dinámica en 10 idiomas.

Portal Oficial: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!TIP]
> ### 🔒 Gestor de Paquetes Recomendado: pnpm
> Recomendamos enfáticamente utilizar **pnpm** (`pnpm install -g pnpm` o `corepack enable`) en lugar de npm. **pnpm** proporciona mayor seguridad en la cadena de suministro, almacenamiento eficiente basado en contenido, aislamiento estricto de `node_modules` (evitando dependencias fantasma) e integridad determinista en el lockfile.

---

> [!NOTE]
> ### 📺 Tutoriales en Video y Guías de Configuración
> Los video-tutoriales oficiales y las guías paso a paso para configurar aplicaciones, planes, suscripciones, variables en la nube, webhooks y licencias en el Panel de NightAuth serán publicados próximamente en nuestro portal oficial y canal de YouTube.

---

## Características

- 📱 **Soporte Multi-Aplicación**: Conecta y administra múltiples aplicaciones de NightAuth simultáneamente desde un único bot de Discord.
- 🌐 **Soporte Dinámico de 10 Idiomas**: Cambia tu idioma preferido mediante `/language`, `/lang` o botones interactivos (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). El bot recuerda el idioma de cada administrador.
- 🎨 **Interfaz Moderna e Interactiva**: Diseñada con Discord Embeds enriquecidos, botones dinámicos, filas de acciones y menús desplegables de selección interactivos.
- 📝 **Modales Nativos de Discord**: Formularios emergentes para generar licencias, crear cuentas de usuario y resetear bloqueos de HWID sin teclear comandos complejos.
- ⚡ **Comandos de Barra Diagonal (Slash Commands)**:
  - `/panel`: Panel de control gráfico e interactivo con botones de acción rápida, selector de apps y selector de idioma.
  - `/app`: Consulta estadísticas, pausa accesos y alterna entre aplicaciones configuradas.
  - `/license`: Crea, inspecciona, extiende, banea, desbanea y elimina licencias.
  - `/user`: Aprovisiona cuentas, resetea bloqueos de HWID, banea/desbanea, pausa/reanuda e inspecciona perfiles.
  - `/language` o `/lang`: Configura tu preferencia personal de idioma.
- 🔒 **Control de Acceso por Roles y Usuarios**: Restringe los comandos administrativos a IDs de usuario o roles de Discord autorizados.
- 🌐 **Arquitectura TypeScript Limpia**: Aplicación independiente compatible con Node.js 18+, Docker y PM2.

---

## Requisitos Previos

1. **Node.js**: `v18.0.0` o superior.
2. **Gestor de Paquetes**: Se recomienda **pnpm** por seguridad y rendimiento (`pnpm install -g pnpm` o `corepack enable`).
3. **Token de Bot de Discord**:
   - Ingresa al [Portal de Desarrolladores de Discord](https://discord.com/developers/applications).
   - Crea una nueva aplicación -> Ve a **Bot** -> Reset Token -> Copia tu token.
   - En **Privileged Gateway Intents**, habilita **Server Members Intent** si vas a restringir comandos por roles.
   - Ve a **OAuth2** -> **URL Generator** -> Selecciona `bot` y `applications.commands` -> Asigna permisos (por ej. `Administrator` o Enviar Mensajes/Insertar Enlaces) -> Invita al bot a tu servidor mediante el enlace generado.
4. **Clave de API Business de NightAuth**:
   - Inicia sesión en tu panel de NightAuth.
   - Selecciona tu aplicación -> Ve a **Configuración de Empresa (Business Settings)**.
   - Copia tu clave `Business API Key` (`biz_...`).

---

## Instalación y Puesta en Marcha

### 1. Clonar e Instalar Dependencias

```bash
cd clients/bots/NightAuth-Discord-Bot
pnpm install
```

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env` con tu editor preferido:

```env
# Credenciales de Discord
DISCORD_TOKEN="TU_TOKEN_DE_DISCORD"
DISCORD_CLIENT_ID="TU_CLIENT_ID_DE_DISCORD"
DISCORD_GUILD_ID="" # Opcional: ID de servidor para pruebas instantáneas

# API Business de NightAuth
NIGHTAUTH_API_URL="https://nightauth.org/api/business"

# Configuración Multi-App (Pares Nombre:ApiKey separados por comas)
NIGHTAUTH_APPS="CheatsApp:biz_0123456789abcdef0123456789abcdef,ToolsApp:biz_fedcba9876543210fedcba9876543210"

# Idioma Predeterminado (en, es, fr, de, it, pt, ru, tr, pl, zh)
DEFAULT_LANGUAGE="es"

# Control de Acceso (opcional: IDs de Discord separados por comas)
ADMIN_USER_IDS="123456789012345678"
ADMIN_ROLE_IDS="987654321098765432"
```

### 3. Desplegar Comandos Slash

Registra todos los comandos de barra en Discord:

```bash
pnpm deploy-commands
```

### 4. Ejecutar el Bot

**Modo Desarrollo (Recarga en caliente con tsx):**
```bash
pnpm dev
```

**Compilación para Producción:**
```bash
pnpm build
pnpm start
```

---

## Configuración Multi-Aplicación

El bot de Discord de NightAuth admite la gestión simultánea de múltiples aplicaciones. Puedes definirlas en `.env` mediante cualquiera de los siguientes formatos:

### Formato A: Pares Separados por Comas (Recomendado)
```env
NIGHTAUTH_APPS="AppOne:biz_key1,AppTwo:biz_key2,AppThree:biz_key3"
```

### Formato B: Cadena JSON
```env
NIGHTAUTH_APPS='[{"name":"AppOne","apiKey":"biz_key1"},{"name":"AppTwo","apiKey":"biz_key2"}]'
```

### Formato C: Aplicación Única
```env
NIGHTAUTH_APP_NAME="MainApp"
NIGHTAUTH_BUSINESS_KEY="biz_key1"
```

---

## Referencia de Comandos Slash

| Comando | Subcomandos / Parámetros | Descripción |
| :--- | :--- | :--- |
| `/panel` | Ninguno | Abre el panel interactivo con botones de acción, selector de app y cambio de idioma. |
| `/language` o `/lang` | `[código]` | Cambia el idioma (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). |
| `/app list` | Ninguno | Lista las apps configuradas y marca la app activa. |
| `/app switch` | `name` | Cambia la aplicación activa para tu sesión. |
| `/app stats` | `[app]` | Muestra usuarios registrados, licencias activas, sesiones y estado. |
| `/app pause` | `[app]` | Pausa los inicios de sesión de la aplicación (modo mantenimiento). |
| `/app unpause` | `[app]` | Reanuda los inicios de sesión de la aplicación. |
| `/license create` | `[amount] [days] [level] [mask] [app]` | Genera nuevas licencias. |
| `/license list` | `[app]` | Lista las licencias creadas y su estado de uso. |
| `/license info` | `key [app]` | Muestra detalles de la licencia (creador, uso, vencimiento). |
| `/license extend` | `key days [app]` | Extiende la validez de una licencia en días. |
| `/license ban` | `key [reason] [app]` | Banea una licencia. |
| `/license unban` | `key [app]` | Desbanea una licencia. |
| `/license delete` | `key [app]` | Elimina permanentemente una licencia. |
| `/user list` | `[app]` | Lista los usuarios registrados en la app. |
| `/user info` | `username [app]` | Inspecciona perfil de usuario, HWID y suscripción. |
| `/user add` | `username password [email] [license] [app]` | Crea una nueva cuenta de usuario. |
| `/user reset-hwid` | `username [app]` | Borra el hardware ID (HWID) vinculado a un usuario. |
| `/user ban` | `username [reason] [app]` | Banea una cuenta de usuario. |
| `/user unban` | `username [app]` | Desbanea una cuenta de usuario. |
| `/user pause` | `username [app]` | Pausa temporalmente un usuario. |
| `/user unpause` | `username [app]` | Reanuda un usuario en pausa. |
| `/user delete` | `username [app]` | Elimina permanentemente una cuenta de usuario. |

---

## Despliegue con Docker

Puedes usar un `Dockerfile` estándar con **pnpm** para ejecutar el bot de manera ininterrumpida en un contenedor ligero:

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

Compilar y ejecutar:
```bash
docker build -t nightauth-discord-bot .
docker run -d --name nightauth-discord --env-file .env nightauth-discord-bot
```

---

## Licencia

Este software está licenciado bajo los términos de la [Elastic License 2.0](../LICENSE).
