const { MessageEmbed, Util, MessageFlags } = require('discord.js');
const ytdl = require('ytdl-core');
const youtube = require('youtube-sr');
const ytpl = require("@distube/ytpl");

module.exports = {
    name: 'play',
    description: 'Play requested song',
    execute: async (message, args) => {
        const { channel } = message.member.voice;

        if (!channel) return message.reply('You need to be in a voice channel to play music');

        const permissions = channel.permissionsFor(message.client.user);

        if (!permissions.has("CONNECT")) return message.reply("I don't have the permissions to connect to the VC you're in");
        if (!permissions.has("SPEAK")) return message.reply("I don't have the permissions to speak in the VC you're in");

        const ytRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const plRegex = /^.*(list=)([^#\&\?]*).*/gi;
        const serverQueue = message.client.queue.get(message.guild.id);
        const argument = args.join(' ');
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: channel,
            connection: null,
            songs: [],
            volume: 50,
            playing: true,
            repeatMode: 0
        }

        function createSong(title, url, duration, thumbnail) {
            const song = {
                "title": title,
                "url": url,
                "duration": duration,
                "thumbnail": thumbnail
            }

            return song;
        }

        function announce(song, started, isPlaylist) {
            let e;
            if (isPlaylist) {
                e = "Playlist Added";
            } else if (started) {
                e = "Started Playing";
            } else {
                e = "Added to Queue";
            }

            const embed = new MessageEmbed()
                .setTitle(song.title)
                .setURL(song.url)
                .setDescription(`Duration: ${song.duration}`)
                .setThumbnail(song.thumbnail)
                .addField(e, message.author)
                .setColor('RANDOM')
                .setTimestamp()
                .setFooter('Song')

            return embed;
        }

        if (ytRegex.test(argument) && plRegex.test(argument)) {
            message.reply("Songs are being loaded, please wait").then(async message => {
                if (!serverQueue) {
                    message.client.queue.set(message.guild.id, queueConstruct);
                }

                try {
                    const playlist = await ytpl(argument);
                    for (video in playlist.items) {
                        let plSong = playlist.items[video];
                        let song = createSong(Util.escapeMarkdown(plSong.title). plSong.url, plSong.duration, plSong.thumbnail);
                        playSong(song, message, channel, serverQueue, true);
                    }
                    const playlistInfo = {
                        title: playlist.title.charAt(0).toUpperCase() + playlist.title.slice(1),
                        url: playlist.url,
                        thumbnail: playlist.items[0].thumbnail,
                        duration: 'No duration for playlist',
                    }

                    message.channel.send(announce(playlistInfo, false, true));

                    return message.delete();
                } catch (e) {
                    message.channel.send("Invalid Playlist URL");
                    message.client.queue.delete(message.guild.id);
                    console.log(e);
                    return message.delete();
                };
            });
        } else {
            let song;
            if (ytdl.validateURL(argument)) {
                let e = await ytdl.getBasicInfo(argument);
                let songInfo = e.videoDetails;
                let duration = new Date(songInfo.lengthSeconds * 1000).toISOString().substr(11, 8);

                if (duration.startsWith('00:')) {
                    duration = duration.replace('00:', '')
                }

                song = createSong(Util.escapeMarkdown(songInfo.title), songInfo.video_url, duration, songInfo.thumbnails[0].url);
            } else {
                let songInfo = await youtube.searchOne(argument);

                if (songInfo === null) {
                    return message.reply("No results found.");
                }

                song = createSong(Util.escapeMarkdown(songInfo.title), songInfo.url, songInfo.durationFormatted, songInfo.thumbnail.url);
            }

            playSong(song, message, channel, serverQueue, false);
        }

        async function playSong(song, message, vc, queue, ifPlaylist) {
            if (queue) {
                queue.songs.push(song);
                if (!ifPlaylist) {
                    message.channel.send(announce(song, false, false));
                };

                return;
            }

            message.client.queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);

            const play = async song => {
                const queue = message.client.queue.get(message.guild.id);
                if (!song) {
                    message.guild.me.voice.channel.leave();
                    message.client.queue.delete(message.guild.id);
                    return;
                }

                let stream = ytdl(song.url, {
                    filter: 'audioonly',
                    quality: 'highestaudio',
                });

                const dispatcher = queue.connection.play(stream)
                    .on('finish', () => {
                        if (queue.repeatMode === 0) {
                            queue.songs.shift();
                        } else if (queue.repeatMode === 2) {
                            queue.songs.push(queue.songs.shift());
                        } else {
                            null;
                        }

                        play(queue.songs[0]);
                    })
                    .on('error', error => {
                        console.error(error);
                    });

                dispatcher.setVolumeLogarithmic(queue.volume / 100);
                if (!ifPlaylist) {
                    queue.textChannel.send(announce(song, true, false));
                };
            }

            try {
                const connection = await channel.join();
                queueConstruct.connection = connection;
                play(queueConstruct.songs[0]);
            } catch (error) {
                console.error(`I couldn't join VC.\nError: ${error}`);
                message.client.queue.delete(message.guild.id);
                await channel.leave();
                return message.channel.send(`I couldn't join VC.\nError: ${error}`);
            }
        }
    }
}