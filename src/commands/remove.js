const { MessageEmbed } = require('discord.js');
const skip = require('./skip');

module.exports = {
    name: "remove",
    description: "Removes a song from the queue",
    execute(message, args) {

        const serverQueue = message.client.queue.get(message.guild.id);

        if (isNaN(parseInt(args[0])) || !args[0]) {
            return message.reply("Enter a valid number. To find the song numbers, use command $queue")
        }

        if (!serverQueue) {
            return message.reply("No song being played");
        };

        let remove = args[0] - 1;
        let arr = serverQueue.songs;

        if (remove > arr.length || remove < 0) {
            return message.reply("That is not a valid number");
        };

        const embed = new MessageEmbed()
            .setTitle('Song Removed')
            .setColor("RANDOM")
            .addField(`Removed: **${arr[remove].title}**`, '<a:Next:803138566091309057>')
            .addField('Song Removed by-', message.author)
            .setTimestamp()
            .setFooter('Song Removed')

        message.channel.send(embed);

        if (remove === 0) {
            skip.execute(message, args);
        } else {
            arr.splice(remove, 1);
            message.client.queue.set(message.guild.id, serverQueue);
        }
    }
}