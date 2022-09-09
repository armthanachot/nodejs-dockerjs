require('dotenv').config(); //initialize dotenv

const { Client, GatewayIntentBits, } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus, createAudioResource } = require('@discordjs/voice');
const { Player } = require('discord-player')


const client = new Client({ intents: [GatewayIntentBits.Guilds, "GuildMessages", "DirectMessages", "MessageContent"] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (msg) => {
  try {
    if (!msg.isChatInputCommand()) return;

    const voiceChannel = msg.member.voice.channel

    const mapCommandFn = {
      ping: async () => { return await msg.reply('Pong') },
      myprofile: async () => { return await msg.reply(JSON.stringify(msg.user, null, 2)) },
      quotation: async () => { return await msg.reply({ files: ['./formQuotation.pdf'] }) },
      music: async () => {
        if (!voiceChannel) return await msg.reply('NOBODY IN VOICE ROOM')

        const systemChannelId = voiceChannel.guild.systemChannelId
        const guildId = '1017268488521400361'


        const player = createAudioPlayer()

        player.on(AudioPlayerStatus.Playing, () => {
          console.log('The audio player has started playing!');
        })

        player.on('error', error => {
          console.error(`Error: ${error.message} with resource`);
        });

        const resource = createAudioResource(`./โกหก.mp3`)
        player.play(resource)

        console.log({
          channelId: systemChannelId,
          guildId: guildId,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        const connection = joinVoiceChannel({
          channelId: systemChannelId,
          guildId: guildId,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        await msg.reply("created voice connection")

        // Subscribe the connection to the audio player (will play audio on the voice connection)
        const subscription = connection.subscribe(player);

        // subscription could be undefined if the connection is destroyed!
        if (subscription) {
          // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
          setTimeout(() => subscription.unsubscribe(), 30_000);
        }

        return await msg.reply('NOBODY IN VOICE ROOM')
      }
    }
    await mapCommandFn[msg.commandName]()
  } catch (error) {
    console.log(error);
    return
  }
})

const msgSet = {
  hi: 'สวัสดี',
  'รัตนา': 'ว่ายังไง!'
}

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return
  if (msg.content === 'รัตนา') {
    msg.channel.send({
      files: ['./download.jpeg']
    })
    return msg.channel.send(msgSet[msg.content])
  }

  return msgSet[msg.content] ? msg.channel.send(msgSet[msg.content]) : msg.channel.send('bot ไม่แน่ใจข้อความของคุณ')
})

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token