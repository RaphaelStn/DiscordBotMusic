const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("reprends la chanson"),
    execute: async ({client, interaction}) => {
        const queue = client.player.nodes.create(interaction.guild);

        if(!queue) {
            await interaction.reply("Pas de chanson en cours")
            return
        }
        await queue.node.resume();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Chanson reprise`)
            ]
        })
    }
}