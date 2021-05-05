const { prefix, auth, baseURL } = require("../config.json");
const commands = require("../index.js");

const axios = require("axios");
axios.defaults.headers.common["Authorization"] = auth;
axios.defaults.baseURL = baseURL;

module.exports = async (event) => {
    const message = event.d;

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = commands.get(commandName) || commands.find(cmd => cmd.aliases?.includes(commandName));

    try {
        command.execute(message, args);
    } catch (err) {
        console.error(err);

        await axios.post(`/channels/${message.channel_id}/messages`, {
            "content": "There was an error trying to execute this command!",
            "tts": false
        }).catch(err => console.log(err.response.data));
    }
}