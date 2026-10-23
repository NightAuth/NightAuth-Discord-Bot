# NightAuth Discord Bot (Self-Hosted) — Zostaw gwiazdkę na GitHubie ⭐

Oficjalny bot administracyjny Discord self-hosted dla [NightAuth](https://nightauth.org). Zbudowany w oparciu o **TypeScript** oraz **Discord.js v14**, bot łączy się bezpośrednio z API Business platformy NightAuth, zapewniając automatyczne licencjonowanie, zarządzanie kontami, resetowanie blokad HWID, administrację wieloma aplikacjami oraz dynamiczne wsparcie dla 10 języków.

Oficjalny portal: [https://nightauth.org](https://nightauth.org)

---

**Languages / Idiomas / Langues / Sprachen:**  
[English](../README.md) • [Español](es.md) • [Français](fr.md) • [Deutsch](de.md) • [Italiano](it.md) • [Português](pt.md) • [Русский](ru.md) • [Türkçe](tr.md) • [Polski](pl.md) • [中文](zh.md)

---

> [!NOTE]
> ### 📺 Poradniki wideo i instrukcje konfiguracji
> Oficjalne przewodniki wideo oraz szczegółowe instrukcje krok po kroku dotyczące konfigurowania aplikacji, planów, subskrypcji, zmiennych w chmurze, webhooków i licencji w panelu NightAuth zostaną wkrótce opublikowane na naszym portalu oraz kanale YouTube.

---

## Funkcje

- 📱 **Obsługa wielu aplikacji**: Zarządzaj wieloma aplikacjami NightAuth jednocześnie za pośrednictwem pojedynczego bota Discord.
- 🌐 **Dynamiczna obsługa 10 języków**: Wybierz preferowany język za pomocą `/language`, `/lang` lub interaktywnych przycisków (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). Bot zapamiętuje wybór każdego administratora.
- 🎨 **Nowoczesny interfejs graficzny**: Zbudowany z wykorzystaniem bogatych obiektów Discord Embed, dynamicznych przycisków i interaktywnych menu wyboru.
- 📝 **Natywne okna modalne Discord**: Formularze popup do generowania licencji, dodawania kont i resetowania HWID bez konieczności wpisywania długich poleceń tekstowych.
- ⚡ **Kompletny zestaw komend ukośnika (Slash)**:
  - `/panel`: Interaktywny pulpit nawigacyjny z przyciskami szybkich akcji, przełącznikiem aplikacji i zmianą języka.
  - `/app`: Wyświetl statystyki, wstrzymaj logowanie i przełączaj się między aplikacjami.
  - `/license`: Generuj, sprawdzaj, przedłużaj, banuj, odbanowuj i usuwaj klucze licencyjne.
  - `/user`: Rejestruj konta, usuwaj blokady HWID, zarządzaj banami i przeglądaj profile użytkowników.
  - `/language` lub `/lang`: Ustaw indywidualny język interfejsu.
- 🔒 **Kontrola dostępu oparta na rolach i ID**: Ogranicz komendy administracyjne do wskazanych identyfikatorów użytkowników lub ról Discord.
- 🌐 **Czysta architektura TypeScript**: Samodzielna aplikacja kompatybilna z Node.js 18+, Dockerem oraz PM2.

---

## Wymagania wstępne

1. **Node.js**: `v18.0.0` lub nowszy.
2. **Token bota Discord**:
   - Przejdź do [Discord Developer Portal](https://discord.com/developers/applications).
   - Utwórz aplikację -> Otwórz zakładkę **Bot** -> Zresetuj i skopiuj token.
   - W sekcji Privileged Gateway Intents włącz **Server Members Intent**, jeśli filtrujesz uprawnienia według ról.
   - W sekcji **OAuth2** -> **URL Generator** zaznacz `bot` oraz `applications.commands`, nadaj uprawnienia i zaproś bota na swój serwer.
3. **Klucz API Business NightAuth**:
   - Zaloguj się do panelu NightAuth.
   - Wybierz aplikację -> Przejdź do **Business Settings**.
   - Skopiuj klucz `Business API Key` (`biz_...`).

---

## Instalacja i uruchomienie

### 1. Klonowanie i instalacja zależności

```bash
cd clients/bots/NightAuth-Discord-Bot
pnpm install
```

### 2. Konfiguracja zmiennych środowiskowych

Skopiuj plik `.env.example` jako `.env`:

```bash
cp .env.example .env
```

Zmodyfikuj `.env`:

```env
# Dane Discord
DISCORD_TOKEN="TWOJ_TOKEN_BOTA"
DISCORD_CLIENT_ID="TWOJ_CLIENT_ID"
DISCORD_GUILD_ID="" # Opcjonalnie: ID serwera do natychmiastowych testów

# NightAuth Business API
NIGHTAUTH_API_URL="https://nightauth.org/api/business"

# Konfiguracja wielu aplikacji (Pary Nazwa:Klucz rozdzielone przecinkami)
NIGHTAUTH_APPS="AppJeden:biz_0123456789abcdef0123456789abcdef,AppDwa:biz_fedcba9876543210fedcba9876543210"

# Domyślny język (en, es, fr, de, it, pt, ru, tr, pl, zh)
DEFAULT_LANGUAGE="pl"

# Kontrola dostępu (Identyfikatory Discord rozdzielone przecinkami)
ADMIN_USER_IDS="123456789012345678"
ADMIN_ROLE_IDS="987654321098765432"
```

### 3. Wdrożenie komend ukośnika

```bash
pnpm deploy-commands
```

### 4. Uruchomienie bota

**Tryb deweloperski (przeładowywanie w czasie rzeczywistym przez tsx):**
```bash
pnpm dev
```

**Kompilacja produkcyjna:**
```bash
pnpm build
pnpm start
```

---

## Zestawienie komend Slash

| Komenda | Podkomendy / Parametry | Opis |
| :--- | :--- | :--- |
| `/panel` | Brak | Otwiera panel sterowania z przyciskami i wyborem języka. |
| `/language` lub `/lang` | `[kod]` | Zmienia język (`en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `tr`, `pl`, `zh`). |
| `/app list` | Brak | Wyświetla zdefiniowane aplikacje i wskazuje aktywną. |
| `/app switch` | `name` | Zmienia aktywną aplikację dla Twojej sesji. |
| `/app stats` | `[app]` | Statystyki użytkowników, licencji i aktywnych sesji w czasie rzeczywistym. |
| `/app pause` | `[app]` | Włącza tryb konserwacji (wstrzymuje logowanie klientów). |
| `/app unpause` | `[app]` | Wznawia logowanie klientów. |
| `/license create` | `[amount] [days] [level] [mask] [app]` | Generuje nowe klucze licencyjne. |
| `/license list` | `[app]` | Wyświetla wygenerowane licencje i ich stan użycia. |
| `/license info` | `key [app]` | Szczegółowe informacje o licencji (twórca, wygaśnięcie, stan). |
| `/license extend` | `key days [app]` | Przedłuża ważność licencji o wskazaną liczbę dni. |
| `/license ban` | `key [reason] [app]` | Nakłada bana na licencję. |
| `/license unban` | `key [app]` | Zdejmuje bana z licencji. |
| `/license delete` | `key [app]` | Trwale usuwa licencję z bazy. |
| `/user list` | `[app]` | Wyświetla zarejestrowanych użytkowników. |
| `/user info` | `username [app]` | Sprawdza profil użytkownika, identyfikator HWID i subskrypcję. |
| `/user add` | `username password [email] [license] [app]` | Tworzy nowe konto użytkownika. |
| `/user reset-hwid` | `username [app]` | Resetuje blokadę sprzętową (HWID) przypisaną do konta. |
| `/user ban` | `username [reason] [app]` | Nakłada bana na użytkownika. |
| `/user unban` | `username [app]` | Zdejmuje bana z użytkownika. |
| `/user pause` | `username [app]` | Tymczasowo wstrzymuje konto użytkownika. |
| `/user unpause` | `username [app]` | Przywraca wstrzymane konto. |
| `/user delete` | `username [app]` | Trwale usuwa konto użytkownika. |

---

## Wdrożenie w kontenerze Docker

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

Budowa i uruchomienie:
```bash
docker build -t nightauth-discord-bot .
docker run -d --name nightauth-discord --env-file .env nightauth-discord-bot
```

---

## Licencja

Oprogramowanie jest udostępniane na warunkach licencji [Elastic License 2.0](../LICENSE).
