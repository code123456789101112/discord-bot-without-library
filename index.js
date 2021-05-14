const fs = require("fs");
const { token, baseURL } = require("./config.json");

const Collection = require("@discordjs/collection");
const commands = new Collection();

const axios = require("axios");
axios.defaults.baseURL = baseURL;

const WebSocket = require("ws");

(async () => {
    const res = await axios.get("/gateway");
    const ws = new WebSocket(res.data.url);

    let op10 = true;
    ws.on("message", async o => {
        const op = JSON.parse(o);

        const data = JSON.stringify({ "op": 1, "d": op.s });
        if (op.op === 1) ws.send(data);

        if (op10) {
            const random = Math.random();
            setTimeout(() => ws.send(data), op.d.heartbeat_interval * random);
            setInterval(() => ws.send(data), op.d.heartbeat_interval);

            const op2 = JSON.stringify({
                "op": 2,
                "d": {
                    "token": token,
                    "intents": 513,
                    "properties": {
                        "os": "windows",
                        "$browser": "my_library",
                        "$device": "my_library"
                    }
                }
            });
            ws.send(op2);

            op10 = false;
        }

        const eventFiles = fs.readdirSync("./events/");
        const commandFiles = fs.readdirSync("./commands/");
        
        for (const file of eventFiles) {
            const eventName = file.split(".")[0];
            if (op.t === eventName.toUpperCase()) require(`./events/${file}`)(op);
        }

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            commands.set(command.name, command);
        }

        module.exports = commands;
    });
})();