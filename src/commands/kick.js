module.exports = {
    name: 'kick',
    description: 'Kick a user from the server',
    execute(message, args) {
        const member = message.mentions.members.first();

        if (member) {
            member.kick();
            return message.reply(`you kicked ${member}`)
        } else {
            return message.reply("You need to mention a user in order to kick them");
        };
    }
}