module.exports = {
    name: 'ban',
    description: 'Ban a user from the server',
    execute(message, args) {
        const member = message.mentions.members.first();

        if (member) {
            message.guild.members.ban(member);
            return message.reply(`has banned ${member}`)
        } else {
            return message.reply("You need to tag the person");
        };
    }
}