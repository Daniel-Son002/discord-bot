import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from 'dotenv';
import * as comms from './commands/commands.js';


config();

console.log(process.env.SERVERID);

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

function readyDiscord() {
    console.log('test' + client.user.tag);
}

client.once(Events.ClientReady, readyDiscord);

client.login(process.env.TOKEN)

client.on(Events.InteractionCreate, handleInteraction);

async function handleInteraction(interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === 'daniel') {
        await comms.execute(interaction);
    }
}