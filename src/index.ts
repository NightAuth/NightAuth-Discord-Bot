import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  GatewayIntentBits,
  GuildMember,
  Interaction,
  MessageFlags,
} from "discord.js";
import { config } from "./config";
import {
  getActiveApp,
  getAppByName,
  getAvailableApps,
  getClientForApp,
  getUserLanguage,
  isUserAdmin,
  setActiveApp,
  setUserLanguage,
} from "./state";
import {
  buildAddUserModal,
  buildCreateLicenseModal,
  buildLanguageSelectMenu,
  buildResetHwidModal,
  COLORS,
  createBaseEmbed,
  createPanelComponents,
  createPanelEmbed,
} from "./ui/embeds";
import { getLanguageName, t } from "./i18n";
import { deploySlashCommands } from "./deploy-commands";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", async () => {
  console.log(`🤖 NightAuth Discord Bot logged in as ${client.user?.tag}!`);
  console.log(`🔗 Connected Business API Endpoint: ${config.apiUrl}`);
  console.log(`📱 Loaded ${config.apps.length} application(s): ${config.apps.map((a) => a.name).join(", ") || "None"}`);

  // Automatically register slash commands on startup
  try {
    await deploySlashCommands();
  } catch (err) {
    console.warn("⚠️ Could not auto-deploy slash commands on startup:", err);
  }
});

client.on("interactionCreate", async (interaction: Interaction) => {
  try {
    const member = interaction.member instanceof GuildMember ? interaction.member : null;
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const userLang = getUserLanguage(userId);

    // -------------------------------------------------------------------------
    // 1. Select Menus: Switch App & Switch Language
    // -------------------------------------------------------------------------
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "select_switch_language") {
        const selectedLang = interaction.values[0];
        setUserLanguage(userId, selectedLang);
        const activeApp = getActiveApp(userId, guildId);
        const allApps = getAvailableApps();
        const embed = createPanelEmbed(activeApp, allApps, selectedLang);
        const components = createPanelComponents(activeApp, allApps, selectedLang);

        await interaction.update({
          embeds: [embed],
          components,
        });
        return;
      }

      if (interaction.customId === "select_switch_app") {
        if (!isUserAdmin(interaction.user, member)) {
          await interaction.reply({ content: t("unauthorized", userLang), flags: MessageFlags.Ephemeral });
          return;
        }

        const selectedName = interaction.values[0];
        const switched = setActiveApp(userId, selectedName);

        if (!switched) {
          await interaction.reply({
            content: t("appNotFound", userLang, { app: selectedName }),
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const activeApp = getActiveApp(userId, guildId);
        const allApps = getAvailableApps();
        const embed = createPanelEmbed(activeApp, allApps, userLang);
        const components = createPanelComponents(activeApp, allApps, userLang);

        await interaction.update({
          embeds: [embed],
          components,
        });
        return;
      }
    }

    // -------------------------------------------------------------------------
    // 2. Buttons: Open Modals or Quick Actions
    // -------------------------------------------------------------------------
    if (interaction.isButton()) {
      if (!isUserAdmin(interaction.user, member)) {
        await interaction.reply({ content: t("unauthorized"), flags: MessageFlags.Ephemeral });
        return;
      }

      if (interaction.customId === "btn_modal_create_license") {
        await interaction.showModal(buildCreateLicenseModal());
        return;
      }

      if (interaction.customId === "btn_modal_add_user") {
        await interaction.showModal(buildAddUserModal());
        return;
      }

      if (interaction.customId === "btn_modal_reset_hwid") {
        await interaction.showModal(buildResetHwidModal());
        return;
      }

      if (interaction.customId === "btn_action_language") {
        const langRow = buildLanguageSelectMenu(userLang);
        await interaction.reply({
          content: t("chooseLanguage", userLang),
          components: [langRow],
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      if (interaction.customId === "btn_action_stats") {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const app = getActiveApp(userId, guildId);
        const nightClient = getClientForApp(app);
        const res = await nightClient.getStats();

        if (!res.success) {
          await interaction.editReply({
            content: `❌ Failed to fetch stats for **${app.name}**: ${res.error || res.message}`,
          });
          return;
        }

        const stats = res.data || res;
        const embed = createBaseEmbed(`📊 Statistics: ${app.name}`, COLORS.PRIMARY).addFields(
          { name: "👥 Total Users", value: String(stats.usersCount ?? stats.users ?? "0"), inline: true },
          { name: "🔑 Total Licenses", value: String(stats.licensesCount ?? stats.licenses ?? "0"), inline: true },
          { name: "🟢 Active Subscriptions", value: String(stats.activeLicensesCount ?? stats.active ?? "0"), inline: true },
          { name: "⚡ Active Sessions", value: String(stats.sessionsCount ?? stats.sessions ?? "0"), inline: true },
          { name: "⏸️ App Paused", value: stats.paused ? "Yes (Maintenance)" : "No (Active)", inline: true },
        );

        await interaction.editReply({ embeds: [embed] });
        return;
      }
    }

    // -------------------------------------------------------------------------
    // 3. Modal Submissions
    // -------------------------------------------------------------------------
    if (interaction.isModalSubmit()) {
      if (!isUserAdmin(interaction.user, member)) {
        await interaction.reply({ content: t("unauthorized"), flags: MessageFlags.Ephemeral });
        return;
      }

      const app = getActiveApp(userId, guildId);
      const nightClient = getClientForApp(app);

      if (interaction.customId === "modal_submit_create_license") {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const amount = parseInt(interaction.fields.getTextInputValue("input_amount") || "1", 10) || 1;
        const days = parseInt(interaction.fields.getTextInputValue("input_days") || "30", 10) || 30;
        const level = parseInt(interaction.fields.getTextInputValue("input_level") || "1", 10) || 1;
        const mask = interaction.fields.getTextInputValue("input_mask") || "NA-*****-*****-*****";

        const res = await nightClient.createLicenses({ amount, expiry: days, level, mask });

        if (!res.success) {
          await interaction.editReply({
            content: `❌ Failed to generate licenses for **${app.name}**: ${res.error || res.message}`,
          });
          return;
        }

        const keys: string[] = res.keys || (res.key ? [res.key] : []) || [];
        const keyList = keys.length > 0 ? keys.join("\n") : "License created successfully.";

        const embed = createBaseEmbed(`🔑 ${keys.length} License(s) Generated`, COLORS.SUCCESS)
          .setDescription(`Application: **${app.name}**\nDuration: **${days} days** | Level: **${level}**`)
          .addFields({
            name: "📋 Generated Keys",
            value: `\`\`\`text\n${keyList}\n\`\`\``,
          });

        await interaction.editReply({ embeds: [embed] });
        return;
      }

      if (interaction.customId === "modal_submit_add_user") {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const username = interaction.fields.getTextInputValue("input_username").trim();
        const password = interaction.fields.getTextInputValue("input_password").trim();
        const email = interaction.fields.getTextInputValue("input_email")?.trim() || undefined;
        const key = interaction.fields.getTextInputValue("input_license")?.trim() || undefined;

        const res = await nightClient.createUser({ username, password, email, key });

        if (!res.success) {
          await interaction.editReply({
            content: `❌ Failed to create user for **${app.name}**: ${res.error || res.message}`,
          });
          return;
        }

        const embed = createBaseEmbed("👤 User Account Created", COLORS.SUCCESS).addFields(
          { name: "App", value: app.name, inline: true },
          { name: "Username", value: username, inline: true },
          { name: "Email", value: email || "None", inline: true },
          { name: "Attached License", value: key ? `\`${key}\`` : "None", inline: false },
        );

        await interaction.editReply({ embeds: [embed] });
        return;
      }

      if (interaction.customId === "modal_submit_reset_hwid") {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const username = interaction.fields.getTextInputValue("input_username").trim();
        const res = await nightClient.resetUserHwid(username);

        if (!res.success) {
          await interaction.editReply({
            content: `❌ Failed to reset HWID for user **${username}** in **${app.name}**: ${res.error || res.message}`,
          });
          return;
        }

        const embed = createBaseEmbed("🔄 HWID Reset Completed", COLORS.SUCCESS).setDescription(
          `Hardware lock for user **${username}** in **${app.name}** has been cleared successfully.`,
        );

        await interaction.editReply({ embeds: [embed] });
        return;
      }
    }

    // -------------------------------------------------------------------------
    // 4. Slash Commands
    // -------------------------------------------------------------------------
    if (interaction.isChatInputCommand()) {
      if (!isUserAdmin(interaction.user, member)) {
        await interaction.reply({ content: t("unauthorized"), flags: MessageFlags.Ephemeral });
        return;
      }

      const { commandName, options } = interaction;

      // /panel
      if (commandName === "panel") {
        const activeApp = getActiveApp(userId, guildId);
        const allApps = getAvailableApps();
        const embed = createPanelEmbed(activeApp, allApps, userLang);
        const components = createPanelComponents(activeApp, allApps, userLang);

        await interaction.reply({
          embeds: [embed],
          components,
        });
        return;
      }

      // /language & /lang
      if (commandName === "language" || commandName === "lang") {
        const code = options.getString("code");
        if (code) {
          setUserLanguage(userId, code);
          await interaction.reply({
            content: t("langSwitched", code, { lang: getLanguageName(code) }),
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const langRow = buildLanguageSelectMenu(userLang);
        await interaction.reply({
          content: t("chooseLanguage", userLang),
          components: [langRow],
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // /app
      if (commandName === "app") {
        const sub = options.getSubcommand();

        if (sub === "list") {
          const allApps = getAvailableApps();
          const active = getActiveApp(userId, guildId);

          const embed = createBaseEmbed("📱 Configured Applications", COLORS.PRIMARY).setDescription(
            allApps.length === 0
              ? t("noAppsConfigured")
              : allApps
                  .map((a) => (a.name === active.name ? `• **${a.name}** 🟢 *(Active)*` : `• **${a.name}**`))
                  .join("\n"),
          );

          await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
          return;
        }

        if (sub === "switch") {
          const name = options.getString("name", true);
          const switched = setActiveApp(userId, name);

          if (!switched) {
            await interaction.reply({
              content: t("appNotFound", config.defaultLanguage, { app: name }),
              flags: MessageFlags.Ephemeral,
            });
            return;
          }

          await interaction.reply({
            content: t("appSwitched", config.defaultLanguage, { app: name }),
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        // stats, pause, unpause
        const explicitAppName = options.getString("app");
        const targetApp = explicitAppName ? getAppByName(explicitAppName) || getActiveApp(userId, guildId) : getActiveApp(userId, guildId);
        const nightClient = getClientForApp(targetApp);

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        if (sub === "stats") {
          const res = await nightClient.getStats();
          if (!res.success) {
            await interaction.editReply({ content: `❌ Failed: ${res.error || res.message}` });
            return;
          }
          const stats = res.data || res;
          const embed = createBaseEmbed(`📊 Statistics: ${targetApp.name}`, COLORS.PRIMARY).addFields(
            { name: "👥 Total Users", value: String(stats.usersCount ?? stats.users ?? "0"), inline: true },
            { name: "🔑 Total Licenses", value: String(stats.licensesCount ?? stats.licenses ?? "0"), inline: true },
            { name: "🟢 Active Subscriptions", value: String(stats.activeLicensesCount ?? stats.active ?? "0"), inline: true },
            { name: "⚡ Sessions", value: String(stats.sessionsCount ?? stats.sessions ?? "0"), inline: true },
            { name: "⏸️ App Paused", value: stats.paused ? "Yes (Maintenance)" : "No (Active)", inline: true },
          );
          await interaction.editReply({ embeds: [embed] });
          return;
        }

        if (sub === "pause") {
          const res = await nightClient.pauseApp();
          await interaction.editReply({
            content: res.success
              ? `⏸️ Application **${targetApp.name}** has been paused.`
              : `❌ Failed: ${res.error || res.message}`,
          });
          return;
        }

        if (sub === "unpause") {
          const res = await nightClient.unpauseApp();
          await interaction.editReply({
            content: res.success
              ? `▶️ Application **${targetApp.name}** has been unpaused.`
              : `❌ Failed: ${res.error || res.message}`,
          });
          return;
        }
      }

      // /license
      if (commandName === "license") {
        const sub = options.getSubcommand();
        const explicitAppName = options.getString("app");
        const targetApp = explicitAppName ? getAppByName(explicitAppName) || getActiveApp(userId, guildId) : getActiveApp(userId, guildId);
        const nightClient = getClientForApp(targetApp);

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        if (sub === "create") {
          const amount = options.getInteger("amount") || 1;
          const days = options.getInteger("days") || 30;
          const level = options.getInteger("level") || 1;
          const mask = options.getString("mask") || "NA-*****-*****-*****";

          const res = await nightClient.createLicenses({ amount, expiry: days, level, mask });
          if (!res.success) {
            await interaction.editReply({ content: `❌ Error: ${res.error || res.message}` });
            return;
          }

          const keys: string[] = res.keys || (res.key ? [res.key] : []) || [];
          const embed = createBaseEmbed(`🔑 ${keys.length} License(s) Generated`, COLORS.SUCCESS)
            .setDescription(`App: **${targetApp.name}** | Duration: **${days}d** | Level: **${level}**`)
            .addFields({
              name: "Generated Keys",
              value: `\`\`\`text\n${keys.join("\n") || "Key created."}\n\`\`\``,
            });

          await interaction.editReply({ embeds: [embed] });
          return;
        }

        if (sub === "list") {
          const res = await nightClient.listLicenses();
          if (!res.success) {
            await interaction.editReply({ content: `❌ Error: ${res.error || res.message}` });
            return;
          }

          const list = (res.data?.licenses || res.licenses || []) as any[];
          const slice = list.slice(0, 15);
          const formatted = slice
            .map(
              (l) =>
                `• \`${l.key}\` — Level ${l.level} | ${l.used ? `Used by **${l.usedBy || "User"}**` : "🟢 *Available*"}`,
            )
            .join("\n");

          const embed = createBaseEmbed(`🔑 Licenses: ${targetApp.name} (${list.length} total)`, COLORS.PRIMARY)
            .setDescription(formatted || "No licenses found.")
            .setFooter({ text: `Showing ${slice.length} of ${list.length} total keys` });

          await interaction.editReply({ embeds: [embed] });
          return;
        }

        if (sub === "info") {
          const key = options.getString("key", true);
          const res = await nightClient.getLicense(key);
          if (!res.success) {
            await interaction.editReply({ content: `❌ Error: ${res.error || res.message}` });
            return;
          }

          const lic = res.data?.license || res.license || res;
          const embed = createBaseEmbed("🔍 License Details", COLORS.INFO).addFields(
            { name: "Key", value: `\`${lic.key || key}\``, inline: false },
            { name: "App", value: targetApp.name, inline: true },
            { name: "Status", value: lic.status || "active", inline: true },
            { name: "Level", value: String(lic.level ?? 1), inline: true },
            { name: "Used", value: lic.used ? `Yes (${lic.usedBy || "Unknown"})` : "No", inline: true },
            { name: "Duration", value: `${lic.durationDays ?? lic.expiry ?? "30"} days`, inline: true },
          );

          await interaction.editReply({ embeds: [embed] });
          return;
        }

        if (sub === "extend") {
          const key = options.getString("key", true);
          const days = options.getInteger("days", true);
          const res = await nightClient.addLicenseTime(key, days);

          await interaction.editReply({
            content: res.success
              ? `⏱️ Added **${days} days** to license \`${key}\` on **${targetApp.name}**.`
              : `❌ Error: ${res.error || res.message}`,
          });
          return;
        }

        if (sub === "ban") {
          const key = options.getString("key", true);
          const reason = options.getString("reason") || undefined;
          const res = await nightClient.banLicense(key, reason);

          await interaction.editReply({
            content: res.success
              ? `🚫 License \`${key}\` has been banned on **${targetApp.name}**.`
              : `❌ Error: ${res.error || res.message}`,
          });
          return;
        }

        if (sub === "unban") {
          const key = options.getString("key", true);
          const res = await nightClient.unbanLicense(key);

          await interaction.editReply({
            content: res.success
              ? `✅ License \`${key}\` has been unbanned on **${targetApp.name}**.`
              : `❌ Error: ${res.error || res.message}`,
          });
          return;
        }

        if (sub === "delete") {
          const key = options.getString("key", true);
          const res = await nightClient.deleteLicense(key);

          await interaction.editReply({
            content: res.success
              ? `🗑️ License \`${key}\` was deleted from **${targetApp.name}**.`
              : `❌ Error: ${res.error || res.message}`,
          });
          return;
        }
      }

      // /user
      if (commandName === "user") {
        const sub = options.getSubcommand();
        const explicitAppName = options.getString("app");
        const targetApp = explicitAppName ? getAppByName(explicitAppName) || getActiveApp(userId, guildId) : getActiveApp(userId, guildId);
        const nightClient = getClientForApp(targetApp);

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        if (sub === "list") {
          const res = await nightClient.listUsers();
          if (!res.success) {
            await interaction.editReply({ content: `❌ Error: ${res.error || res.message}` });
            return;
          }

          const users = (res.data?.users || res.users || []) as any[];
          const slice = users.slice(0, 15);
          const formatted = slice
            .map((u) => `• **${u.username}** — Status: \`${u.status || "active"}\` | HWID: ${u.hwid ? "🔒" : "🔓"}`)
            .join("\n");

          const embed = createBaseEmbed(`👥 Users: ${targetApp.name} (${users.length} total)`, COLORS.PRIMARY)
            .setDescription(formatted || "No users found.")
            .setFooter({ text: `Showing ${slice.length} of ${users.length} total users` });

          await interaction.editReply({ embeds: [embed] });
          return;
        }

        if (sub === "info") {
          const username = options.getString("username", true);
          const res = await nightClient.getUser(username);
          if (!res.success) {
            await interaction.editReply({ content: `❌ Error: ${res.error || res.message}` });
            return;
          }

          const user = res.data?.user || res.user || res;
          const embed = createBaseEmbed(`👤 User Profile: ${username}`, COLORS.INFO).addFields(
            { name: "App", value: targetApp.name, inline: true },
            { name: "Status", value: user.status || "active", inline: true },
            { name: "Email", value: user.email || "None", inline: true },
            { name: "HWID Lock", value: user.hwid ? `\`${user.hwid.slice(0, 16)}...\`` : "🔓 *Unlocked*", inline: false },
            { name: "Last Login", value: user.lastLogin || "Never", inline: true },
            { name: "IP Address", value: user.ip || "None", inline: true },
          );

          await interaction.editReply({ embeds: [embed] });
          return;
        }

        if (sub === "add") {
          const username = options.getString("username", true);
          const password = options.getString("password", true);
          const email = options.getString("email") || undefined;
          const key = options.getString("license") || undefined;

          const res = await nightClient.createUser({ username, password, email, key });
          await interaction.editReply({
            content: res.success
              ? `✅ User **${username}** created successfully in **${targetApp.name}**.`
              : `❌ Error: ${res.error || res.message}`,
          });
          return;
        }

        if (sub === "reset-hwid") {
          const username = options.getString("username", true);
          const res = await nightClient.resetUserHwid(username);
          await interaction.editReply({
            content: res.success
              ? `🔄 HWID lock for **${username}** in **${targetApp.name}** has been cleared.`
              : `❌ Error: ${res.error || res.message}`,
          });
          return;
        }

        if (sub === "ban") {
          const username = options.getString("username", true);
          const reason = options.getString("reason") || undefined;
          const res = await nightClient.banUser(username, reason);
          await interaction.editReply({
            content: res.success
              ? `🚫 User **${username}** has been banned in **${targetApp.name}**.`
              : `❌ Error: ${res.error || res.message}`,
          });
          return;
        }

        if (sub === "unban") {
          const username = options.getString("username", true);
          const res = await nightClient.unbanUser(username);
          await interaction.editReply({
            content: res.success
              ? `✅ User **${username}** has been unbanned in **${targetApp.name}**.`
              : `❌ Error: ${res.error || res.message}`,
          });
          return;
        }

        if (sub === "pause") {
          const username = options.getString("username", true);
          const res = await nightClient.pauseUser(username);
          await interaction.editReply({
            content: res.success
              ? `⏸️ User **${username}** has been paused in **${targetApp.name}**.`
              : `❌ Error: ${res.error || res.message}`,
          });
          return;
        }

        if (sub === "unpause") {
          const username = options.getString("username", true);
          const res = await nightClient.unpauseUser(username);
          await interaction.editReply({
            content: res.success
              ? `▶️ User **${username}** has been unpaused in **${targetApp.name}**.`
              : `❌ Error: ${res.error || res.message}`,
          });
          return;
        }

        if (sub === "delete") {
          const username = options.getString("username", true);
          const res = await nightClient.deleteUser(username);
          await interaction.editReply({
            content: res.success
              ? `🗑️ User **${username}** has been deleted from **${targetApp.name}**.`
              : `❌ Error: ${res.error || res.message}`,
          });
          return;
        }
      }
    }
  } catch (error: any) {
    console.error("❌ Unhandled interaction error:", error);
    if (interaction.isRepliable()) {
      const msg = "An unexpected error occurred while processing this action.";
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: `❌ ${msg}` }).catch(() => {});
      } else {
        await interaction.reply({ content: `❌ ${msg}`, flags: MessageFlags.Ephemeral }).catch(() => {});
      }
    }
  }
});

client.login(config.token).catch((err) => {
  console.error("❌ Failed to login to Discord. Check your DISCORD_TOKEN:", err.message);
});
