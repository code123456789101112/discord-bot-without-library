const { auth, baseURL } = require("../config.json");

const axios = require("axios");
axios.defaults.headers.common["Authorization"] = auth;
axios.defaults.baseURL = baseURL;

module.exports = {
    name: "lock",
    aliases: ["lockthischannel"],
    async execute(message, args) {
        await axios.put(`/channels/${message.channel_id}/permissions/${message.guild_id}`, { "deny": 0x800 })
            .catch(err => console.log(err.response.data));

        await axios.post(`/channels/${message.channel_id}/messages`, {
            "content": `Locked <#${message.channel_id}>.`,
            "tts": false
        }).catch(err => console.log(err.response.data));
    }
}