(async () => {
    const fs = require("fs");
    const { token } = require("./config.json");

    const axios = require("axios");
    axios.defaults.baseURL = "https://discord.com/api/v9";

    const WebSocket = require("ws");

    const res = await axios.get("/gateway");
    const socket = new WebSocket(res.data.url);

    let y = 0;
    socket.on("message", async o => {
        y++;

        const op = JSON.parse(o);

        const data = JSON.stringify({ "op": 1, "d": op.s });
        if (op.op === 1) socket.send(data);

        if (y == 1) {
            const random = Math.random();
            setTimeout(() => socket.send(data), op.d.heartbeat_interval * random);
            setInterval(() => socket.send(data), op.d.heartbeat_interval);

            const op2 = JSON.stringify({
                "op": 2,
                "d": {
                    "token": token,
                    "intents": 513,
                    "properties": {
                        "os": "windows",
                        "$browser": "library",
                        "$device": "library"
                    }
                }
            });
            socket.send(op2);
        }

        const eventFiles = fs.readdirSync("./events/");
        for (const file of eventFiles) {
            const eventName = file.split(".")[0];
            if (op.t === eventName.toUpperCase()) require(`./events/${file}`)(op);
        }
    });
})();