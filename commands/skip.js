const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip la chanson"),
    execute: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if(!queue) {
            await interaction.reply("Pas de chanson en cours")
            return
        }
        const currentSong = queue.current;

        queue.skip();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**${currentSong.title}** passée`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}