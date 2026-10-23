# NightAuth Discord Bot (Self-Hosted) — GitHub'da Bize Yıldız Verin ⭐

[NightAuth](https://nightauth.org) için resmi self-hosted Discord yönetim botu. **TypeScript** ve **Discord.js v14** ile geliştirilen bu bot, doğrudan NightAuth Business API'sine bağlanarak otomatik lisanslama, kullanıcı oluşturma, HWID sıfırlama, çoklu uygulama yönetimi ve dinamik 10 dil desteği sunar.

Resmi Portal: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!NOTE]
> ### 📺 Video Eğitimleri ve Kurulum Kılavuzları
> NightAuth Kontrol Panelinde uygulamalar, planlar, abonelikler, bulut değişkenleri, webhook'lar ve lisansların nasıl yapılandırılacağını açıklayan resmi video eğitimleri ve adım adım kılavuzlar yakında portalımızda ve YouTube kanalımızda yayınlanacaktır.

---

## Özellikler

- 📱 **Çoklu Uygulama Desteği**: Tek bir Discord botu üzerinden birden fazla NightAuth uygulamasını eşzamanlı olarak bağlayın ve yönetin.
- 🌐 **Dinamik 10 Dil Desteği**: `/language`, `/lang` veya interaktif butonlar (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`) ile dil seçimi yapın. Bot her yöneticinin dil tercihini hatırlar.
- 🎨 **Modern ve Etkileşimli Arayüz**: Zengin Discord Embed'leri, dinamik butonlar ve interaktif açılır seçim menüleri ile tasarlandı.
- 📝 **Yerel Discord Modalları**: Karmaşık komutlar yazmadan lisans üretme, kullanıcı oluşturma ve HWID temizleme için açılır form pencereleri.
- ⚡ **Kapsamlı Eğik Çizgi (Slash) Komutları**:
  - `/panel`: Hızlı işlem butonları, uygulama ve dil seçicisi içeren etkileşimli kontrol paneli.
  - `/app`: İstatistikleri inceleyin, girişleri duraklatın ve uygulamalar arasında geçiş yapın.
  - `/license`: Lisans anahtarları oluşturun, inceleyin, süresini uzatın, yasaklayın veya silin.
  - `/user`: Kullanıcı hesapları açın, HWID kilitlerini sıfırlayın ve profilleri görüntüleyin.
  - `/language` veya `/lang`: Kişisel dil tercihinizi belirleyin.
- 🔒 **Rol ve Kullanıcı Erişim Denetimi**: Yönetici komutlarını yetkili Discord Kullanıcı ID'lerine veya Rol ID'lerine sınırlandırın.
- 🌐 **Temiz TypeScript Mimarisi**: Node.js 18+, Docker ve PM2 ile tam uyumlu bağımsız uygulama.

---

## Ön Koşullar

1. **Node.js**: `v18.0.0` veya daha üst sürüm.
2. **Discord Bot Token**:
   - [Discord Developer Portal](https://discord.com/developers/applications) adresine gidin.
   - Yeni Uygulama oluşturun -> **Bot** -> Token'ı sıfırlayıp kopyalayın.
   - Rol bazlı kısıtlama yapacaksanız Privileged Gateway Intents altında **Server Members Intent**'i etkinleştirin.
   - **OAuth2** -> **URL Generator** -> `bot` ve `applications.commands` seçerek izinleri verin ve botu sunucunuza ekleyin.
3. **NightAuth Business API Anahtarı**:
   - NightAuth Kontrol Paneline giriş yapın.
   - Uygulamanızı seçin -> **Business Settings** sekmesine gidin.
   - `Business API Key` (`biz_...`) anahtarınızı kopyalayın.

---

## Kurulum ve Hızlı Başlangıç

### 1. Klonlama ve Bağımlılıkları Yükleme

```bash
cd clients/bots/NightAuth-Discord-Bot
pnpm install
```

### 2. Ortam Değişkenlerini Yapılandırma

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
# Discord Kimlik Bilgileri
DISCORD_TOKEN="DISCORD_BOT_TOKENINIZ"
DISCORD_CLIENT_ID="CLIENT_ID_NUMARANIZ"
DISCORD_GUILD_ID="" # İsteğe bağlı: Anlık testler için sunucu ID'si

# NightAuth Business API
NIGHTAUTH_API_URL="https://nightauth.org/api/business"

# Çoklu Uygulama Yapılandırması (Virgülle ayrılmış İsim:ApiKey çiftleri)
NIGHTAUTH_APPS="UygulamaBir:biz_0123456789abcdef0123456789abcdef,UygulamaIki:biz_fedcba9876543210fedcba9876543210"

# Varsayılan Dil (en, es, fr, de, it, pt, ru, tr, pl, zh)
DEFAULT_LANGUAGE="tr"

# Erişim Denetimi (Virgülle ayrılmış Discord ID'leri)
ADMIN_USER_IDS="123456789012345678"
ADMIN_ROLE_IDS="987654321098765432"
```

### 3. Slash Komutlarını Dağıtma

```bash
pnpm deploy-commands
```

### 4. Botu Başlatma

**Geliştirme Modu (tsx ile anlık yenileme):**
```bash
pnpm dev
```

**Prodüksiyon Derlemesi:**
```bash
pnpm build
pnpm start
```

---

## Slash Komutları Kılavuzu

| Komut | Alt Komutlar / Parametreler | Açıklama |
| :--- | :--- | :--- |
| `/panel` | Yok | Hızlı butonlar ve dil seçici içeren kontrol panelini açar. |
| `/language` veya `/lang` | `[kod]` | Dili değiştirir (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). |
| `/app list` | Yok | Tanımlı uygulamaları listeler ve aktif olanı gösterir. |
| `/app switch` | `name` | Oturumunuz için aktif uygulamayı değiştirir. |
| `/app stats` | `[app]` | Gerçek zamanlı kullanıcı, lisans ve oturum istatistikleri. |
| `/app pause` | `[app]` | Bakım modunu etkinleştirir (girişleri duraklatır). |
| `/app unpause` | `[app]` | Girişleri tekrar aktif eder. |
| `/license create` | `[amount] [days] [level] [mask] [app]` | Yeni lisans anahtarları üretir. |
| `/license list` | `[app]` | Lisansları ve kullanım durumlarını listeler. |
| `/license info` | `key [app]` | Lisans ayrıntılarını (oluşturan, süre, durum) görüntüler. |
| `/license extend` | `key days [app]` | Lisans süresini gün bazında uzatır. |
| `/license ban` | `key [reason] [app]` | Lisansı yasaklar. |
| `/license unban` | `key [app]` | Lisans yasağını kaldırır. |
| `/license delete` | `key [app]` | Lisansı kalıcı olarak siler. |
| `/user list` | `[app]` | Kayıtlı kullanıcıları listeler. |
| `/user info` | `username [app]` | Kullanıcı profili, HWID ve aboneliğini inceler. |
| `/user add` | `username password [email] [license] [app]` | Yeni kullanıcı hesabı oluşturur. |
| `/user reset-hwid` | `username [app]` | Kullanıcının HWID kilidini sıfırlar. |
| `/user ban` | `username [reason] [app]` | Kullanıcıyı yasaklar. |
| `/user unban` | `username [app]` | Kullanıcı yasağını kaldırır. |
| `/user pause` | `username [app]` | Kullanıcı hesabını geçici olarak duraklatır. |
| `/user unpause` | `username [app]` | Duraklatılan kullanıcı hesabını yeniden etkinleştirir. |
| `/user delete` | `username [app]` | Kullanıcı hesabını kalıcı olarak siler. |

---

## Docker ile Dağıtım

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

Derleme ve çalıştırma:
```bash
docker build -t nightauth-discord-bot .
docker run -d --name nightauth-discord --env-file .env nightauth-discord-bot
```

---

## Lisans

Bu yazılım [Elastic License 2.0](../LICENSE) şartları altında lisanslanmıştır.
