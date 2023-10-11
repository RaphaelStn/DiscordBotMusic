const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Joue une chanson")
    .addSubcommand(subcommand => 
         subcommand.setName("playlist")
        .setDescription("Joue une playlist YT")
        .addStringOption(option => 
             option
                .setName('url')
                .setDescription("playlist URL")
                .setRequired(true)
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName("recherche")
       .setDescription("Recherche une chanson")
       .addStringOption(option => 
            option
               .setName('keyword')
               .setDescription("Recherche")
               .setRequired(true)
       )
   )
    .addSubcommand(subcommand => 
         subcommand.setName("chanson")
        .setDescription("Joue une chanson YT")
        .addStringOption(option => 
             option
                .setName('url')
                .setDescription("chanson URL")
                .setRequired(true)
        )
    ),
    execute: async ({client, interaction}) => {
        // Nécessite un channel vocal
        if(!interaction.member.voice.channel) {
            await interaction.reply("Pas de channel vocal disponible");
            return;
        }
        const queue = await client.player.nodes.create(interaction.guild);

        if (!queue.connection) await queue.connect(interaction.member.voice.channel)
        
        let embed = new EmbedBuilder();

        // requête play chanson avec URL
        if(interaction.options.getSubcommand() === "chanson") {
            let url = interaction.options.getString("url");
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE,
            });
            if (result.tracks.length === 0)
                return interaction.reply("No results")

            const song = result.tracks[0]
            await queue.play(song);
            embed
                .setDescription(`**[${song.title}]** ajouté à la file`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Durée: ${song.duration}`})
        } 
        // requête play playst avec URL
        else if(interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url");
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
            });
            if(result.tracks.length === 0) {
                await interaction.reply("Pas de résultat")
                return
            }
            const playlist = result.playlist
            await queue.play(playlist);

            embed
                .setDescription(`**[${playlist.title}]** ajouté à la file`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({text: `Durée: ${playlist.duration}`})
        }
        else if(interaction.options.getSubcommand() === "recherche") {
            let keyword = interaction.options.getString("keyword");
            const result = await client.player.search(keyword, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_AUTO,
            });
            if(result.tracks.length === 0) {
                await interaction.reply("Pas de résultat")
                return
            }
            const song = result.tracks[0]
            await queue.play(song);
            embed
                .setDescription(`**[${song.title}]** ajouté à la file`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Durée: ${song.duration}`})
        }
        // requête play search avec URL
        await interaction.reply({
            embeds: [embed]
        })
    }
}