const { auth, baseURL } = require("../config.json");

const axios = require("axios");
axios.defaults.headers.common["Authorization"] = auth;
axios.defaults.baseURL = baseURL;

module.exports = {
    name: "ping",
    aliases: ["botping"],
    async execute(message, args) {
        let { data: msg } = await axios.post(`/channels/${message.channel_id}/messages`, {
            "content": "Pinging...",
            "tts": false
        }).catch(err => console.log(err.response.data));

        const start = new Date(message.timestamp);
        const end = new Date(msg.timestamp);
        const ping = end - start;

        await axios.patch(`/channels/${message.channel_id}/messages/${msg.id}`, { "content": `Pong! \`${ping}ms\`` })
            .catch(err => console.log(err.response.data));
    }
}