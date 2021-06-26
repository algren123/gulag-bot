module.exports = {
    name: "addrole",
    description: "Add a role to a member of the server",
    execute(message, args) {
        const role = message.guild.roles.cache.find(role => role.name === `${args[0]}`);
        const member = message.mentions.members.first();

        if (!role) {
            return message.reply("Role not found");
        };

        if (!member) {
            return message.reply("You need to tag the person");
        };

        if (member.roles.cache.some(role => role.name === `${args[0]}`)) {
            return message.reply(`${member} already has the ${role} role`)
        }

        member.roles.add(role);
        return message.reply(`${member} is now ${role}`);
    }
}