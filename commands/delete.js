const { auth, baseURL } = require("../config.json");

const axios = require("axios");
axios.defaults.headers.common["Authorization"] = auth;
axios.defaults.baseURL = baseURL;

module.exports = {
    name: "delete",
    aliases: ["deletethis"],
    async execute(message, args) {
        await axios.delete(`/channels/${message.channel_id}/messages/${message.id}`).catch(err => console.log(err.response.data));

        let { data: msg } = await axios.post(`/channels/${message.channel_id}/messages`, {
            "content": "Deleted your message.",
            "tts": false
        }).catch(err => console.log(err.response.data));

        setTimeout(async () => {
            await axios.delete(`/channels/${msg.channel_id}/messages/${msg.id}`).catch(err => console.log(err.response.data));
        }, 2000);
    }
}