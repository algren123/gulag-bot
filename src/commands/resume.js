const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'resume',
    description: 'Resumes the current song playing',
    execute(message, args) {
        const serverQueue = message.client.queue.get(message.guild.id);

        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();

            const embed = new MessageEmbed()
                .setTitle('Song Resumed')
                .setDescription('Song has been resumed')
                .addField('Resumed by', message.author)
                .setColor('RANDOM')
                .setTimestamp()
                .setFooter('Song Resumed')
            
            return message.channel.send(embed);
        }

        return message.reply('No song is being played');
    }
}