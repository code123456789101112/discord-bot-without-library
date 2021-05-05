const { auth, baseURL } = require("../config.json");

const axios = require("axios");
axios.defaults.headers.common["Authorization"] = auth;
axios.defaults.baseURL = baseURL;

module.exports = {
    name: "purge",
    aliases: ["clear"],
    async execute(message, args) {
        const { data: msgs } = await axios.get(`/channels/${message.channel_id}/messages?limit=${parseInt(args[0])}`).catch(err => console.log(err.response.data));
        const messages = msgs.map(m => m.id);

        await axios.post(`/channels/${message.channel_id}/messages/bulk-delete`, { "messages": messages })
            .catch(err => console.log(err.response.data));

        let { data: msg } = await axios.post(`/channels/${message.channel_id}/messages`, {
            "content": `Deleted ${messages.length} messages.`,
            "tts": false
        }).catch(err => console.log(err.response.data));

        setTimeout(async () => {
            await axios.delete(`/channels/${msg.channel_id}/messages/${msg.id}`).catch(err => console.log(err.response.data));
        }, 2000);
    }
}