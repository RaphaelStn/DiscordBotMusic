const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("mets en pause la chanson"),
    execute: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if(!queue) {
            await interaction.reply("Pas de chanson en cours")
            return
        }

        queue.setPause(true);

        await interaction.reply("Chanson en pause")
    }
}