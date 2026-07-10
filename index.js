const WebSocket = require('ws');
const { request } = require('undici');

const TOKEN = "ur_token";
const GUILD_ID = "server_id";
const CHANNEL_ID = "room_id";

const STATUS = "online";
const SELF_MUTE = true;
const SELF_DEAF = true;

const API = "https://discord.com/api/v10";

async function checkConfig() {
    try {
       
        const userRes = await request(`${API}/users/@me`, {
            headers: { 'Authorization': TOKEN }
        });

        if (userRes.statusCode !== 200) {
            console.log("Invalid token!");
            process.exit(1);
        }

        const user = await userRes.body.json();
        console.log(`Logged in as {user.username} (${user.id})!`);

        const channelRes = await request(`${API}/channels/${CHANNEL_ID}`, {
            headers: { 'Authorization': TOKEN }
        });

        if (channelRes.statusCode !== 200) {
            console.log("Error: Channel ID is incorrect or inaccessible!");
            process.exit(1);
        }

        const channelData = await channelRes.body.json();
        if (channelData.guild_id !== GUILD_ID) {
            console.log("Error: Channel ID does not match the Guild ID!");
            process.exit(1);
        }

        console.log("Configuration validated successfully. Channel matches Guild!");

    } catch (err) {
        console.error("Validation Error: ", err.message);
        process.exit(1);
    }
}

function startHeartbeat(ws, interval) {
    return setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ op: 1, d: null }));
            console.log("[*] Sent Gateway Heartbeat");
        }
    }, interval);
}

function startKeepVoiceAlive(ws) {
    return setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            const payload = {
                op: 4,
                d: {
                    guild_id: GUILD_ID,
                    channel_id: CHANNEL_ID,
                    self_mute: SELF_MUTE,
                    self_deaf: SELF_DEAF,
                    self_video: false
                }
            };
            ws.send(JSON.stringify(payload));
            console.log("[*] Voice footprint updated successfully, timeout cleared");
        }
    }, 60000);
}

function connect() {
    const uri = "wss://gateway.discord.gg/?v=10&encoding=json";
    const ws = new WebSocket(uri);

    let heartbeatIntervalId = null;
    let voiceAliveIntervalId = null;
    let isReady = false;

    ws.on('open', () => {
        // Connection opened
    });

    ws.on('message', (data) => {
        const message = JSON.parse(data);
        const { op, t, d } = message;

        if (op === 10) {
            const heartbeatInterval = d.heartbeat_interval;
            heartbeatIntervalId = startHeartbeat(ws, heartbeatInterval);

            ws.send(JSON.stringify({
                op: 2,
                d: {
                    token: TOKEN,
                    properties: {
                        $os: "windows",
                        $browser: "chrome",
                        $device: "pc"
                    },
                    presence: {
                        status: STATUS,
                        afk: false
                    }
                }
            }));
        }

        if (t === 'READY') {
            isReady = true;
            ws.send(JSON.stringify({
                op: 4,
                d: {
                    guild_id: GUILD_ID,
                    channel_id: CHANNEL_ID,
                    self_mute: SELF_MUTE,
                    self_deaf: SELF_DEAF,
                    self_video: false
                }
            }));
            console.log("Joined the voice channel successfully!");
            voiceAliveIntervalId = startKeepVoiceAlive(ws);
        }

        if (op === 9) {
            console.log("[-] Discord sent: Invalid Session!");
        }
    });

    ws.on('close', () => {
        console.log("[-] Disconnected, reconnecting...");
        clearInterval(heartbeatIntervalId);
        clearInterval(voiceAliveIntervalId);
        setTimeout(connect, 5000);
    });

    ws.on('error', (err) => {
        console.log("Connection error: ", err.message);
    });
}

async function run() {
    await checkConfig();
    connect();
}

run();
                      
