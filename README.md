# Discord Voice Stay
A Node.js script to keep a Discord account connected to a specific voice channel 24/7 automatically. It features silent connection, smart configuration validation, and quick reconnection logic.
## Prerequisites
 * Node.js version 16.14.0 or higher.
 * Discord account token.
 * Server ID (Guild ID) and Voice Channel ID.
## Installation
 1. Install the required dependencies using the following command:
```bash
npm install

```
 2. Open afk.js and replace the placeholder values with your own data:
 * TOKEN
 * GUILD_ID
 * CHANNEL_ID
## Running the Script
To start the script, run:
```bash
npm start

```
## Features
 * **Smart Validation:** Pre-checks the account token and verifies if the Voice Channel ID belongs to the specified Guild ID before establishing a gateway connection.
 * **Full Anti-Crash Protection:** Robust error handling for continuous, uninterrupted runtime.
 * **Automated Connection Maintenance:** Refreshes the voice connection footprint every 60 seconds to completely bypass idle/timeout kicks.
 * **Automatic Reconnection:** Automatically attempts to reconnect within 5 seconds if disconnected or dropped by the gateway.
 * **Clean Console Logs:** Informative and minimal console output keeping track of the gateway heartbeats and voice state.
## Disclaimer
This project is created for educational and personal testing purposes only. Using self-bots or automated scripts on user accounts violates Discord's Terms of Service (ToS) and can lead to account suspension or termination.
The developer, **Youcef** (xgg.2), holds absolute no responsibility for any consequences, account bans, or damages that may arise from using this script. Run it entirely at your own risk.
![random pic cuz why not](https://i.ibb.co/mVrKBh0T/IMG-20260708-162509.png)
