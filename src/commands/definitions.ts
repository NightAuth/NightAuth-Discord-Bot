import {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export const slashCommands: (
  | SlashCommandBuilder
  | SlashCommandSubcommandsOnlyBuilder
  | SlashCommandOptionsOnlyBuilder
)[] = [
  // 1. /panel
  new SlashCommandBuilder()
    .setName("panel")
    .setDescription("Open the NightAuth interactive Management Dashboard"),

  // 2. /app
  new SlashCommandBuilder()
    .setName("app")
    .setDescription("Manage and switch between authorized NightAuth applications")
    .addSubcommand((sub) =>
      sub.setName("list").setDescription("List all configured applications and active selection"),
    )
    .addSubcommand((sub) =>
      sub
        .setName("switch")
        .setDescription("Switch the active application for subsequent commands")
        .addStringOption((opt) =>
          opt
            .setName("name")
            .setDescription("The name of the application to activate")
            .setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("stats")
        .setDescription("View real-time metrics for an application")
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Application name (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("pause")
        .setDescription("Pause client authentication for the application")
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Application name (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("unpause")
        .setDescription("Resume client authentication for the application")
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Application name (defaults to active app)")
            .setRequired(false),
        ),
    ),

  // 3. /license
  new SlashCommandBuilder()
    .setName("license")
    .setDescription("Manage product licenses and keys")
    .addSubcommand((sub) =>
      sub
        .setName("create")
        .setDescription("Generate new license keys")
        .addIntegerOption((opt) =>
          opt
            .setName("amount")
            .setDescription("Number of licenses to generate (1-100)")
            .setRequired(false),
        )
        .addIntegerOption((opt) =>
          opt
            .setName("days")
            .setDescription("Duration in days (default: 30)")
            .setRequired(false),
        )
        .addIntegerOption((opt) =>
          opt
            .setName("level")
            .setDescription("Subscription level (default: 1)")
            .setRequired(false),
        )
        .addStringOption((opt) =>
          opt
            .setName("mask")
            .setDescription("Key mask format (default: NA-*****-*****-*****)")
            .setRequired(false),
        )
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("list")
        .setDescription("List licenses for the application")
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("info")
        .setDescription("View details and usage status of a license key")
        .addStringOption((opt) =>
          opt.setName("key").setDescription("The license key to inspect").setRequired(true),
        )
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("extend")
        .setDescription("Add days to an existing license key")
        .addStringOption((opt) =>
          opt.setName("key").setDescription("License key").setRequired(true),
        )
        .addIntegerOption((opt) =>
          opt.setName("days").setDescription("Days to add").setRequired(true),
        )
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("ban")
        .setDescription("Ban a license key")
        .addStringOption((opt) =>
          opt.setName("key").setDescription("License key to ban").setRequired(true),
        )
        .addStringOption((opt) =>
          opt.setName("reason").setDescription("Reason for banning").setRequired(false),
        )
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("unban")
        .setDescription("Unban a license key")
        .addStringOption((opt) =>
          opt.setName("key").setDescription("License key to unban").setRequired(true),
        )
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("delete")
        .setDescription("Permanently delete a license key")
        .addStringOption((opt) =>
          opt.setName("key").setDescription("License key to delete").setRequired(true),
        )
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    ),

  // 4. /user
  new SlashCommandBuilder()
    .setName("user")
    .setDescription("Manage application end users and hardware locks")
    .addSubcommand((sub) =>
      sub
        .setName("list")
        .setDescription("List registered users for the application")
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("info")
        .setDescription("View user details, hardware ID, and subscription status")
        .addStringOption((opt) =>
          opt.setName("username").setDescription("Target username").setRequired(true),
        )
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Provision a new user account")
        .addStringOption((opt) =>
          opt.setName("username").setDescription("Username").setRequired(true),
        )
        .addStringOption((opt) =>
          opt.setName("password").setDescription("User password").setRequired(true),
        )
        .addStringOption((opt) =>
          opt.setName("email").setDescription("User email address").setRequired(false),
        )
        .addStringOption((opt) =>
          opt.setName("license").setDescription("License key to bind").setRequired(false),
        )
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("reset-hwid")
        .setDescription("Reset user Hardware ID (HWID) lock")
        .addStringOption((opt) =>
          opt.setName("username").setDescription("Target username").setRequired(true),
        )
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("ban")
        .setDescription("Ban a user account")
        .addStringOption((opt) =>
          opt.setName("username").setDescription("Username to ban").setRequired(true),
        )
        .addStringOption((opt) =>
          opt.setName("reason").setDescription("Reason for ban").setRequired(false),
        )
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("unban")
        .setDescription("Unban a user account")
        .addStringOption((opt) =>
          opt.setName("username").setDescription("Username to unban").setRequired(true),
        )
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("pause")
        .setDescription("Pause a user account")
        .addStringOption((opt) =>
          opt.setName("username").setDescription("Username to pause").setRequired(true),
        )
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("unpause")
        .setDescription("Unpause a user account")
        .addStringOption((opt) =>
          opt.setName("username").setDescription("Username to unpause").setRequired(true),
        )
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("delete")
        .setDescription("Permanently delete a user account")
        .addStringOption((opt) =>
          opt.setName("username").setDescription("Username to delete").setRequired(true),
        )
        .addStringOption((opt) =>
          opt
            .setName("app")
            .setDescription("Target application (defaults to active app)")
            .setRequired(false),
        ),
    ),

  // 5. /language
  new SlashCommandBuilder()
    .setName("language")
    .setDescription("Switch bot language / Cambiar idioma del bot")
    .addStringOption((opt) =>
      opt
        .setName("code")
        .setDescription("Language code")
        .setRequired(false)
        .addChoices(
          { name: "🇺🇸 English (en)", value: "en" },
          { name: "🇪🇸 Español (es)", value: "es" },
          { name: "🇩🇪 Deutsch (de)", value: "de" },
          { name: "🇫🇷 Français (fr)", value: "fr" },
          { name: "🇮🇹 Italiano (it)", value: "it" },
          { name: "🇵🇱 Polski (pl)", value: "pl" },
          { name: "🇧🇷 Português (pt)", value: "pt" },
          { name: "🇷🇺 Русский (ru)", value: "ru" },
          { name: "🇹🇷 Türkçe (tr)", value: "tr" },
          { name: "🇨🇳 中文 (zh)", value: "zh" },
        ),
    ),

  // 6. /lang (alias)
  new SlashCommandBuilder()
    .setName("lang")
    .setDescription("Switch bot language / Cambiar idioma del bot")
    .addStringOption((opt) =>
      opt
        .setName("code")
        .setDescription("Language code")
        .setRequired(false)
        .addChoices(
          { name: "🇺🇸 English (en)", value: "en" },
          { name: "🇪🇸 Español (es)", value: "es" },
          { name: "🇩🇪 Deutsch (de)", value: "de" },
          { name: "🇫🇷 Français (fr)", value: "fr" },
          { name: "🇮🇹 Italiano (it)", value: "it" },
          { name: "🇵🇱 Polski (pl)", value: "pl" },
          { name: "🇧🇷 Português (pt)", value: "pt" },
          { name: "🇷🇺 Русский (ru)", value: "ru" },
          { name: "🇹🇷 Türkçe (tr)", value: "tr" },
          { name: "🇨🇳 中文 (zh)", value: "zh" },
        ),
    ),
];
