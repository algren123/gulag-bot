module.exports = {
    name: 'unban',
    description: 'Unban a user from the server',
    execute(message, args) {
        const id = args[0];

        if (id) {
            message.guild.members.unban(id);
            return message.reply(`You have revived member with the ID: ${id}`);
        } else {
            return message.reply("You need to speciy the ID of the person, like this: $unban #0000");
        };
    }
}