require('dotenv').config(); //initialize dotenv

const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'myprofile',
        description: 'Will Reply Your Profile',
    },
    {
        name: 'quotation',
        description: 'ใบเสนอราคา'
    },
    {
        name: 'music',
        description: 'music'
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();