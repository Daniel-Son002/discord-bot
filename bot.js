import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from 'dotenv';
import { OpenAI } from 'openai';
import * as comms from './commands/commands.js';


config();

console.log(process.env.SERVERID);

const client = new Client({
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent', GatewayIntentBits.Guilds],
});

function readyDiscord() {
    console.log('test' + client.user.tag);
}

client.once(Events.ClientReady, readyDiscord);

client.login(process.env.TOKEN)

const IGNORE_PREFIX = '!';
const CHANNELS = ['677374526069407752']

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY 
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(IGNORE_PREFIX)) return;
    if (!CHANNELS.includes(message.channelId) || !message.mentions.users.has(client.user.id)) return;

    await message.channel.sendTyping();

    const sendTypingInterval = setInterval(() => {
        message.channel.sendTyping();
    }, 5000);

    const response = await openai.chat.completions
        .create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    // name: 
                    role: 'system',
                    content: 'something'
                },
                {
                    // name:
                    role: 'user',
                    content: message.content,
                }
            ]
        })
        .catch((error) => console.error('OpenAI Error: \n', error));

    clearInterval(sendTypingInterval);

    message.reply(response.choices[0].message.content)
})

// client.on(Events.InteractionCreate, handleInteraction);

async function handleInteraction(interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === 'daniel') {
        await comms.execute(interaction);
    }
}