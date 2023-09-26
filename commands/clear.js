const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clean le chat de 10"),
    execute: async ({client, interaction}) => {
        const queue = client.player.nodes.create(interaction.guild);

        if(!queue) {
            await interaction.reply("Pas de chanson en cours")
            return
        }

        await interaction.channel.bulkDelete(10)
    }
}