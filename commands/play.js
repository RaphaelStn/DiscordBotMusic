const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Joue une chanson")
    .addSubcommand(subcommand => {
        return subcommand.setName("search")
        .setDescription("Recherche une chanson")
        .addStringOption(option => {
            return option
                .setName('searchterms')
                .setDescription("Mot-clés")
                .setRequired(true)
        })
    })
    .addSubcommand(subcommand => {
        return subcommand.setName("playlist")
        .setDescription("Joue une playlist YT")
        .addStringOption(option => {
            return option
                .setName('url')
                .setDescription("playlist URL")
                .setRequired(true)
        })
    })
    .addSubcommand(subcommand => {
        return subcommand.setName("chanson")
        .setDescription("Joue une chanson YT")
        .addStringOption(option => {
            return option
                .setName('url')
                .setDescription("chanson URL")
                .setRequired(true)
        })
    }),
    execute: async ({client, interaction}) => {
        if(!interaction.member.voice.channel) {
            await interaction.replay("Pas de channel vocal disponible");
            return;
        }
        const queue = await client.player.nodes.create(interaction.guild);

        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder();
        if(interaction.option.getSubcommand() === "song") {
            let url = interaction.option.getString("url");
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            });
            if(result.tracks.length === 0) {
                await interaction.reply("Pas de résultat")
                return
            }
            const song = result.tracks[0]
            await queue.addTrack(song);

            embed
                .setDescription(`**[${song.title}]** ajouté à la file`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Durée: ${song.duration}`})
        } 
        else if(interaction.option.getSubcommand() === "playlist") {
            let url = interaction.option.getString("url");
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
            });
            if(result.tracks.length === 0) {
                await interaction.reply("Pas de résultat")
                return
            }
            const playlist = result.playlist
            await queue.addTracks(playlist);

            embed
                .setDescription(`**[${playlist.title}]** ajouté à la file`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({text: `Durée: ${playlist.duration}`})
        }
        else if(interaction.option.getSubcommand() === "search") {
            let url = interaction.option.getString("searchterms");
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });
            if(result.tracks.length === 0) {
                await interaction.reply("Pas de résultat")
                return
            }
            const song = result.tracks[0]
            await queue.addTrack(song);

            embed
                .setDescription(`**[${song.title}]** ajouté à la file`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Durée: ${song.duration}`})
        }
        if(!queue.playing) await queue.play()

        await interaction.reply({
            embeds: [embed]
        })
    }
}