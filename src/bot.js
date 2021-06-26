require('dotenv').config();

const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.queue = new Discord.Collection();

const prefix = process.env.prefix;

commandsArray = [];
const commandFiles = fs.readdirSync('./src/commands').filter( file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    commandsArray.push(command);
}

client.once('ready', () => {
    console.log('Bot is logged in');
    client.user.setActivity('$help', { type: "LISTENING" });
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');

    if (!channel) {
        console.log("Can't find the channel");
    } else {
        channel.send(`Yo, ${member}! Welcome to ${member.guild.name}`);
    }
});

client.on('message', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = (
        message.content
            .slice(prefix.length)
            .trim()
            .split(' ')
    );

    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (!client.commands.has(command.name)) return;

    // BOT Asks for Permission to send messages
    if (message.guild && !message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) {
        return message.author.send("This bot needs permissions for SENDING MESSAGES in the channel you've requested a command. Please update bots permissions for the channel to include: \nSEND MESSAGES, ADD REACTION, MANAGE MESSAGES, EMBED LINKS, READ MESSAGE HISTORY\nAdmins may need to adjust the hierarchy of permissions.")
            .catch((err) => {
                console.error("Could not send DM");
            });
    };

    // Admin command and user doesnt have permission
    if (command.admin && !message.member.hasPermission("ADMINISTRATOR")) {
        return message.channel.send("This command requires admin role");
    };

    if (command.args && !args.length) {
		return message.channel.send(`Incorrect command usage, ${message.author}!${command.usage ? `\nThe proper usage would be: \`${currentPrefix}${command.name} ${command.usage}\`` : ''}`);
	};

    // Execution of the commands
    try {
        console.log(commandName + ' ' + new Date());
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        return message.reply('There was an error executing that command. Type $help for a list of commands');
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);