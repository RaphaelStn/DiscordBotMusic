const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("kick le bot"),
    execute: async ({client, interaction}) => {
        const queue = client.player.nodes.create(interaction.guild);

        if(!queue) {
            await interaction.reply("Pas de chanson en cours")
            return
        }

        queue.delete();

        await interaction.reply("Apocalypse fin du game")
    }
}