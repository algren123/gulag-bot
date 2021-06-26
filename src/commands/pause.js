const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'pause',
    description: 'Pauses the current song playing',
    execute(message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);

        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();

            const embed = new MessageEmbed()
                .setTitle('Song Paused')
                .setDescription('Song has been paused')
                .addField('Paused by', message.author)
                .setColor('RANDOM')
                .setTimestamp()
                .setFooter('Song Paused')
            
            return message.channel.send(embed);
        }

        return message.reply('No song is being played');
    }
}