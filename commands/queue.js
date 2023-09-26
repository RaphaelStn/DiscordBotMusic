const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Affiche la file"),
    execute: async ({client, interaction}) => {
        const queue = client.player.nodes.create(interaction.guild); 

        if(!queue || !queue.isPlaying()) {
            await interaction.reply("pas de chanson en cours yada yada")
            return
        }
        const queueString = queue.tracks.slice(0,10).map((song, i) => {
            return `${i+1}) [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`;
        }).join("\n");

        const currentSong = queue.current;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("A ajouter plus tard je suis fatigué là")
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}