const { MessageEmbed, guild } = require('discord.js');

module.exports = {
    name: "queue",
    description: "Show the current queue",
    execute(message, args) {
        
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!serverQueue) {
            return message.reply("There currently is no queue");
        }

        const queue = serverQueue.songs;

        const embed = new MessageEmbed()
            .setTitle('Queue')
            .setTimestamp()
            .setColor("RANDOM")
            .setFooter('Song Queue')
            for (let key in queue) {
                embed.addFields({ 
                    name: '\u200b' + `${parseInt(key) + 1}` + ') ' + queue[key].title,
                    value: '<a:Next:803138566091309057>',
                })
            }

        message.channel.send(embed);
    }
}