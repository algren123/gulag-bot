module.exports = {
    name: 'ping',
    description: 'ping pong',
    execute(message, args) {
        return message.channel.send("pong");
    }
}