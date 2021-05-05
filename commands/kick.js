const { auth, baseURL } = require("../config.json");

const axios = require("axios");
axios.defaults.headers.common["Authorization"] = auth;
axios.defaults.baseURL = baseURL;

module.exports = {
    name: "kick",
    aliases: ["boot"],
    async execute(message, args) {
        const id = message.mentions[0].id;
        await axios.delete(`/guilds/${message.guild_id}/members/${id}`).catch(err => console.log(err.response.data));

        const { data: channel } = await axios.post("/users/@me/channels", { "recipient_id": id })
            .catch(err => console.log(err.response.data));

        const reason = args.slice(1).join();
        await axios.post(`/channels/${channel.id}/messages`, {
            "content": `You were kicked for: ${reason}`,
            "tts": false
        }).catch(err => console.log(err.response.data));
    }
}