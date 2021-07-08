const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "poll",
    description: "User can create a poll",
    execute: async(message, args) => {
        let pollChannel = message.mentions.channels.first();
        let question = args.splice(1).join(' ');

        if (!pollChannel) {
            return message.reply("You must tag a channel. The command goes '$poll <#channel> <question>'");
        };

        if (!question) {
            return message.reply("You must provide a question after the tagged channel. i.e. '$poll <#channel> <question>'");
        };

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(question)
            .setDescription(`Poll started by ${message.author}`)
            .setTimestamp()
            
        let messageEmbed = await pollChannel.send(embed);
        await messageEmbed.react('👍');
        await messageEmbed.react('👎');
        message.delete()
        }
}