import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { AppConfig } from "../config";
import { SUPPORTED_LANGUAGES, t } from "../i18n";

export const COLORS = {
  PRIMARY: 0x5865f2,
  SUCCESS: 0x10b981,
  DANGER: 0xef4444,
  INFO: 0x3b82f6,
  PURPLE: 0x8b5cf6,
  DARK: 0x1e1f22,
};

export function createBaseEmbed(title: string, color: number = COLORS.PRIMARY): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: "NightAuth • Self-Hosted Management Bot", iconURL: "https://nightauth.org/logo.png" });
}

export function createPanelEmbed(
  activeApp: AppConfig,
  allApps: AppConfig[],
  lang: string = "en",
): EmbedBuilder {
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return createBaseEmbed(t("botTitle", lang), COLORS.PRIMARY)
    .setDescription(
      `Welcome to your self-hosted **NightAuth Bot Console**.\nLanguage: **${currentLangObj.flag} ${currentLangObj.name}**\nUse the interactive buttons below to manage licenses, users, and applications.`,
    )
    .addFields(
      {
        name: "📱 Current Active Application",
        value: `\`\`\`fix\n${activeApp.name}\n\`\`\``,
        inline: true,
      },
      {
        name: "🌐 Configured Apps",
        value: `**${allApps.length}** application(s) linked`,
        inline: true,
      },
      {
        name: "🌐 Language / Idioma",
        value: `${currentLangObj.flag} **${currentLangObj.name}**`,
        inline: true,
      },
      {
        name: "⚡ Quick Actions",
        value:
          "• Generate licenses with custom masks\n• Provision & verify client accounts\n• Reset user hardware IDs (HWID)\n• Switch active app or language seamlessly",
      },
    );
}

export function createPanelComponents(
  activeApp: AppConfig,
  allApps: AppConfig[],
  lang: string = "en",
) {
  const rows: ActionRowBuilder<any>[] = [];

  // Quick Action Buttons Row 1
  const actionRow1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("btn_modal_create_license")
      .setLabel(t("btnCreateKey", lang))
      .setEmoji("🔑")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("btn_modal_add_user")
      .setLabel(t("btnAddUser", lang))
      .setEmoji("👤")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("btn_modal_reset_hwid")
      .setLabel(t("btnResetHwid", lang))
      .setEmoji("🔄")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("btn_action_stats")
      .setLabel(t("btnStats", lang))
      .setEmoji("📊")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("btn_action_language")
      .setLabel(t("btnLanguage", lang))
      .setEmoji("🌐")
      .setStyle(ButtonStyle.Secondary),
  );
  rows.push(actionRow1);

  // If multiple apps configured, add Select Menu to switch apps
  if (allApps.length > 1) {
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("select_switch_app")
      .setPlaceholder(`📱 Switch App (Currently: ${activeApp.name})`)
      .addOptions(
        allApps.map((app) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(app.name)
            .setValue(app.name)
            .setDescription(`Manage ${app.name} credentials & licenses`)
            .setEmoji(app.name === activeApp.name ? "✅" : "📱")
            .setDefault(app.name === activeApp.name),
        ),
      );

    const selectRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
    rows.push(selectRow);
  }

  return rows;
}

export function buildLanguageSelectMenu(currentLang: string = "en") {
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId("select_switch_language")
    .setPlaceholder("🌐 Choose Bot Language / Elige el idioma")
    .addOptions(
      SUPPORTED_LANGUAGES.map((l) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(`${l.flag} ${l.name} (${l.code.toUpperCase()})`)
          .setValue(l.code)
          .setDescription(`Switch bot language to ${l.name}`)
          .setDefault(l.code === currentLang.toLowerCase()),
      ),
    );

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
}

export function buildCreateLicenseModal(): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId("modal_submit_create_license")
    .setTitle("🔑 Generate New Licenses");

  const amountInput = new TextInputBuilder()
    .setCustomId("input_amount")
    .setLabel("Amount of Licenses to Generate (1-100)")
    .setStyle(TextInputStyle.Short)
    .setValue("1")
    .setRequired(true);

  const daysInput = new TextInputBuilder()
    .setCustomId("input_days")
    .setLabel("Duration in Days")
    .setStyle(TextInputStyle.Short)
    .setValue("30")
    .setRequired(true);

  const levelInput = new TextInputBuilder()
    .setCustomId("input_level")
    .setLabel("Subscription Level")
    .setStyle(TextInputStyle.Short)
    .setValue("1")
    .setRequired(false);

  const maskInput = new TextInputBuilder()
    .setCustomId("input_mask")
    .setLabel("Key Mask (e.g. NA-*****-*****-*****)")
    .setStyle(TextInputStyle.Short)
    .setValue("NA-*****-*****-*****")
    .setRequired(false);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(amountInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(daysInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(levelInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(maskInput),
  );

  return modal;
}

export function buildAddUserModal(): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId("modal_submit_add_user")
    .setTitle("👤 Provision New User");

  const usernameInput = new TextInputBuilder()
    .setCustomId("input_username")
    .setLabel("Username")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("e.g. johndoe")
    .setRequired(true);

  const passwordInput = new TextInputBuilder()
    .setCustomId("input_password")
    .setLabel("Password")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Must include uppercase, lowercase, digit, symbol")
    .setRequired(true);

  const emailInput = new TextInputBuilder()
    .setCustomId("input_email")
    .setLabel("Email Address (Optional)")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("user@example.com")
    .setRequired(false);

  const licenseInput = new TextInputBuilder()
    .setCustomId("input_license")
    .setLabel("License Key to Bind (Optional)")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("NA-XXXXX-XXXXX-XXXXX")
    .setRequired(false);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(usernameInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(passwordInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(emailInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(licenseInput),
  );

  return modal;
}

export function buildResetHwidModal(): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId("modal_submit_reset_hwid")
    .setTitle("🔄 Reset User Hardware ID (HWID)");

  const usernameInput = new TextInputBuilder()
    .setCustomId("input_username")
    .setLabel("Target Username")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Enter username to clear HWID lock")
    .setRequired(true);

  modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(usernameInput));
  return modal;
}
