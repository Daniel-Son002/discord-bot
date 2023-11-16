import { SlashCommandBuilder } from "discord.js";


export const data = new SlashCommandBuilder();

data.setName('daniel');
data.setDescription('demo');

export async function execute(interaction) {
    await interaction.reply('something');
}
