const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("pause la chanson"),
    execute: async ({client, interaction}) => {
        const queue = client.player.nodes.create(interaction.guild);

        if(!queue) {
            await interaction.reply("Pas de chanson en cours")
            return
        }
        await queue.node.pause();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Chanson en pause`)
            ]
        })
    }
}