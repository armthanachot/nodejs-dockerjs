const dotenv = require("dotenv")
const { REST, Routes, Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require("fs")
const { Player } = require("discord-player")




dotenv.config()

const TOKEN = process.env.CLIENT_TOKEN

const LOAD_SLASH = process.argv[2] == "load" // node index.js load (load is index 2)


const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = process.env.SERVER_ID // GUILD_IS is SERVER_ID 

const client = new Client({ intents: [GatewayIntentBits.Guilds, "GuildMessages", "DirectMessages", "MessageContent", "Guilds", "GuildVoiceStates"] });

client.slashCommands = new Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
})

let commands = []

const infoCmd = require('./slash/info.js')
const pauseCmd = require('./slash/pause.js')
const playCmd = require('./slash/play.js')
const queueCmd = require('./slash/queue.js')
const quitCmd = require('./slash/quit.js')
const shuffleCmd = require('./slash/shuffle.js')
const skipCmd = require('./slash/skip.js')
const skiptoCmd = require('./slash/skipto.js')

client.slashcommands.set(infoCmd.data.name, infoCmd)
client.slashcommands.set(pauseCmd.data.name, pauseCmd)
client.slashcommands.set(playCmd.data.name, playCmd)
client.slashcommands.set(queueCmd.data.name, queueCmd)
client.slashcommands.set(quitCmd.data.name, quitCmd)
client.slashcommands.set(shuffleCmd.data.name, shuffleCmd)
client.slashcommands.set(skipCmd.data.name, skipCmd)
client.slashcommands.set(skiptoCmd.data.name, skiptoCmd)

console.log(123);

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles) {
    const slashcmd = require(`./slash/${file}`)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH) {
    const rest = new REST({ version: "9" }).setToken(TOKEN)
    console.log("Deploying slash commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
        .then(() => {
            console.log("Successfully loaded")
            process.exit(0)
        })
        .catch((err) => {
            if (err) {
                console.log(err)
                process.exit(1)
            }
        })
}
else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("Not a valid slash command")

            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    })
    client.login(TOKEN)
}