import { REST, Routes } from "discord.js";
import { config } from "./config";
import { slashCommands } from "./commands/definitions";

export async function deploySlashCommands() {
  if (!config.token || !config.clientId) {
    console.error("❌ Cannot deploy commands: DISCORD_TOKEN or DISCORD_CLIENT_ID is missing from .env");
    return;
  }

  const rest = new REST({ version: "10" }).setToken(config.token);
  const commandData = slashCommands.map((cmd) => cmd.toJSON());

  try {
    console.log(`🚀 Registering ${commandData.length} application (/) commands...`);

    if (config.guildId) {
      console.log(`🎯 Deploying to test Guild: ${config.guildId}`);
      await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commandData },
      );
      console.log("✅ Successfully registered guild slash commands.");
    } else {
      console.log("🌐 Deploying globally to all guilds...");
      await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commandData },
      );
      console.log("✅ Successfully registered global slash commands.");
    }
  } catch (error) {
    console.error("❌ Failed to deploy slash commands:", error);
    throw error;
  }
}

if (require.main === module) {
  deploySlashCommands().catch(() => process.exit(1));
}
