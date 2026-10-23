# NightAuth Discord Bot (Auto-hospedado) — Deixe uma estrela no GitHub ⭐

Bot oficial de administração para Discord auto-hospedado para o [NightAuth](https://nightauth.org). Desenvolvido em **TypeScript** e **Discord.js v14**, este bot conecta-se diretamente à API Business do NightAuth para oferecer licenciamento automatizado, criação de contas, gestão de HWID, administração multi-aplicações e suporte dinâmico a 10 idiomas.

Portal Oficial: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!NOTE]
> ### 📺 Tutoriais em Vídeo e Guias de Configuração
> Tutoriais oficiais em vídeo e guias passo a passo sobre como configurar aplicativos, planos, assinaturas, variáveis em nuvem, webhooks e licenças no Painel do NightAuth serão disponibilizados em breve em nosso portal e canal oficial do YouTube.

---

## Recursos

- 📱 **Suporte Multi-Aplicações**: Gerencie múltiplos aplicativos NightAuth simultaneamente através de um único bot no Discord.
- 🌐 **Suporte Dinâmico a 10 Idiomas**: Alterne seu idioma com `/language`, `/lang` ou botões interativos (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). O bot salva a preferência individual de cada administrador.
- 🎨 **Interface Moderna e Interativa**: Construída com Discord Embeds ricos, botões dinâmicos, linhas de ações e menus de seleção intuitivos.
- 📝 **Modais Nativos do Discord**: Janelas popup para gerar chaves, cadastrar contas e limpar travas de HWID sem digitar comandos complexos.
- ⚡ **Comandos Slash Completos**:
  - `/panel`: Painel de controle visual com botões de ação rápida, seletor de apps e escolha de idioma.
  - `/app`: Visualize estatísticas, pause logins e alterne entre seus aplicativos.
  - `/license`: Crie, consulte, estenda, bana, desbana e delete licenças.
  - `/user`: Cadastre contas, resete travas de HWID, efetue banimentos e inspecione perfis.
  - `/language` ou `/lang`: Configure seu idioma pessoal.
- 🔒 **Controle de Acesso por Usuários e Cargos**: Restrinja o uso administrativo a IDs de usuário ou cargos específicos do Discord.
- 🌐 **Arquitetura TypeScript Limpa**: Compatível com Node.js 18+, Docker e PM2.

---

## Pré-requisitos

1. **Node.js**: `v18.0.0` ou superior.
2. **Token do Bot Discord**:
   - Abra o [Discord Developer Portal](https://discord.com/developers/applications).
   - Crie uma Nova Aplicação -> Acesse **Bot** -> Reset Token -> Copie o token.
   - Ative **Server Members Intent** nas Privileged Gateway Intents caso utilize restrição por cargos.
   - Acesse **OAuth2** -> **URL Generator** -> Marque `bot` e `applications.commands`, configure as permissões e adicione o bot ao seu servidor.
3. **Chave de API Business NightAuth**:
   - Faça login no Painel NightAuth.
   - Acesse sua Aplicação -> Vá até **Business Settings**.
   - Copie sua `Business API Key` (`biz_...`).

---

## Instalação e Inicialização

### 1. Clonar e Instalar Dependências

```bash
cd clients/bots/NightAuth-Discord-Bot
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite `.env`:

```env
# Credenciais Discord
DISCORD_TOKEN="SEU_DISCORD_BOT_TOKEN"
DISCORD_CLIENT_ID="SEU_CLIENT_ID"
DISCORD_GUILD_ID="" # Opcional: ID do servidor para testes imediatos

# API Business NightAuth
NIGHTAUTH_API_URL="https://nightauth.org/api/business"

# Configuração Multi-App (Pares Nome:ApiKey separados por vírgula)
NIGHTAUTH_APPS="AppUm:biz_0123456789abcdef0123456789abcdef,AppDois:biz_fedcba9876543210fedcba9876543210"

# Idioma Padrão (en, es, fr, de, it, pt, ru, tr, pl, zh)
DEFAULT_LANGUAGE="pt"

# Controle de Acesso (IDs do Discord autorizados separados por vírgula)
ADMIN_USER_IDS="123456789012345678"
ADMIN_ROLE_IDS="987654321098765432"
```

### 3. Registrar Comandos Slash

```bash
pnpm deploy-commands
```

### 4. Iniciar o Bot

**Modo Desenvolvimento (Hot Reload via tsx):**
```bash
pnpm dev
```

**Produção:**
```bash
pnpm build
pnpm start
```

---

## Referência de Comandos Slash

| Comando | Subcomandos / Parâmetros | Descrição |
| :--- | :--- | :--- |
| `/panel` | Nenhum | Exibe o painel de controle com botões rápidos e seletor de idiomas. |
| `/language` ou `/lang` | `[código]` | Altera o idioma (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). |
| `/app list` | Nenhum | Lista os apps configurados e destaca o aplicativo ativo. |
| `/app switch` | `name` | Define a aplicação ativa para a sua sessão. |
| `/app stats` | `[app]` | Métricas em tempo real (usuários, licenças, sessões ativas). |
| `/app pause` | `[app]` | Pausa logins na aplicação (modo de manutenção). |
| `/app unpause` | `[app]` | Retoma logins na aplicação. |
| `/license create` | `[amount] [days] [level] [mask] [app]` | Gera novos códigos de licença. |
| `/license list` | `[app]` | Lista as licenças geradas e o status de uso. |
| `/license info` | `key [app]` | Mostra detalhes completos da licença (criador, expiração, etc). |
| `/license extend` | `key days [app]` | Estende a validade da licença em dias. |
| `/license ban` | `key [reason] [app]` | Aplica banimento a uma licença. |
| `/license unban` | `key [app]` | Remove banimento de uma licença. |
| `/license delete` | `key [app]` | Remove permanentemente uma licença. |
| `/user list` | `[app]` | Lista usuários cadastrados. |
| `/user info` | `username [app]` | Inspeciona perfil do usuário, HWID e assinatura. |
| `/user add` | `username password [email] [license] [app]` | Cadastra uma nova conta de usuário. |
| `/user reset-hwid` | `username [app]` | Remove a trava de HWID associada ao usuário. |
| `/user ban` | `username [reason] [app]` | Bane uma conta de usuário. |
| `/user unban` | `username [app]` | Remove banimento de um usuário. |
| `/user pause` | `username [app]` | Suspende temporariamente uma conta. |
| `/user unpause` | `username [app]` | Reativa uma conta suspensa. |
| `/user delete` | `username [app]` | Exclui permanentemente uma conta de usuário. |

---

## Implantação com Docker

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

Construção e execução:
```bash
docker build -t nightauth-discord-bot .
docker run -d --name nightauth-discord --env-file .env nightauth-discord-bot
```

---

## Licença

Este software é distribuído sob os termos da [Elastic License 2.0](../LICENSE).
