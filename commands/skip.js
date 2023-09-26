const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, Options } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip la chanson"),
    execute: async ({client, interaction}) => {
        const queue = client.player.nodes.create(interaction.guild);

        if(!queue) {
            await interaction.reply("Pas de chanson en cours")
            return
        }
        await queue.history.next();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Chanson passée`)
            ]
        })
    }
}