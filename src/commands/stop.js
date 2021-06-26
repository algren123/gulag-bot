const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "stop",
    description: "Stop the music",
    execute(message, args) {
        const channel = message.member.voice;
        const myChannel = message.guild.me.voice.channel;

        if (!channel) {
            return message.reply("You need to be in a voice channel to stop the music");
        };

        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue && !myChannel) {
            return message.reply("There is no music playing");
        };

        message.client.queue.delete(message.guild.id);

        myChannel.leave();

        const embed = new MessageEmbed()
            .setTitle('Music stopped')
            .setDescription('Music has been stopped. Leaving voice channel')
            .addField('Stopped By - ', message.author)
            .setTimestamp()
            .setColor("RANDOM")
            .setFooter('Song Stopped')

        message.channel.send(embed);
    }
}