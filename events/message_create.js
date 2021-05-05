const { prefix, token } = require("../config.json");

const axios = require("axios");
axios.defaults.headers.common["Authorization"] = `Bot ${token}`;
axios.defaults.baseURL = "https://discord.com/api/v9";

module.exports = async (event) => {
    const message = event.d;

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        let { data: msg } = await axios.post(`/channels/${message.channel_id}/messages`, {
            "content": "Pinging...",
            "tts": false
        }).catch(err => console.log(err.response.data));

        const start = new Date(message.timestamp);
        const end = new Date(msg.timestamp);
        const ping = end - start;

        await axios.patch(`/channels/${message.channel_id}/messages/${msg.id}`, { "content": `Pong! \`${ping}ms\`` })
            .catch(err => console.log(err.response.data));
    } else if (command === "delete") {
        await axios.delete(`/channels/${message.channel_id}/messages/${message.id}`).catch(err => console.log(err.response.data));

        let { data: msg } = await axios.post(`/channels/${message.channel_id}/messages`, {
            "content": "Deleted your message.",
            "tts": false
        }).catch(err => console.log(err.response.data));

        setTimeout(async () => {
            await axios.delete(`/channels/${msg.channel_id}/messages/${msg.id}`).catch(err => console.log(err.response.data));
        }, 2000);
    } else if (command === "purge") {
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