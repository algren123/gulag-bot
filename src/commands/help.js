const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List of available commands',
    execute(message, args) {
        const embed = new MessageEmbed()
            .setTitle("$Help")
            .setDescription("Here is a list of commands and how to use them")
            .setColor("RANDOM")
            .addFields(
                { name: "$ping", value: "Returns **Pong**."},
                { name: "$addrole <**role**> <**tagged user**>", value: "Add specified role to the tagged user"},
                { name: "$ban <**tagged user**>", value: "Ban the tagged user"},
                { name: "$credits", value: "Credits the creator of the bot"},
                { name: "$kick <**tagged user**>", value: "Kick the tagged user"},
                { name: "$pause", value: "Pauses the player if music is playing"},
                { name: "$play <**Youtube URL or description**>", value: "Plays the requested song or adds to the queue"},
                { name: "$remove <**song number**>", value: "Removes the specified song from the queue. To get the song's number, use the command $queue"},
                { name: "$queue", value: "Show's the current songs in the queue"},
                { name: "$resume", value: "Resume's the stopped player"},
                { name: "$skip", value: "Skip the current song that is playing"},
                { name: "$stop", value: "Stop the player"},
                { name: "$unban <**User ID [#0000]**>", value: "Unban the user. Use his ID"}
            )
            .setTimestamp()
            .setFooter(message.client.user.tag)
        
        message.channel.send(embed);
    }
}