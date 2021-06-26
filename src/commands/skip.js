const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'skip',
    description: 'Skip the currently playing song',
    execute: async (message, args) => {
        const channel = message.member.voice;
        const queue = message.client.queue.get(message.guild.id);

        if (!channel) {
            message.reply("You need to be in a voice channel to skip the song");
        }

        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue) {
            return message.reply("There is no songs playing; can't skip");
        };

        if (queue.repeatMode === 1) {
            queue.repeatMode === 0;
        };

        serverQueue.connection.dispatcher.end('Song Skipped');

        const embed = new MessageEmbed()
            .setTitle('Music Skipped')
            .setDescription('Music has been skipped')
            .addField('Skipped by-', message.author)
            .setTimestamp()
            .setColor('RANDOM')
            .setFooter('Song Skipped')

        message.channel.send(embed);
    }
}