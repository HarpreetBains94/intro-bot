const { Client, IntentsBitField, Routes, REST } = require('discord.js');
const { handleIntroModalSubmit, handleRejectModalSubmit, handleButtonClick, doApprove } = require('./utils/introUtils');
const { getServers } = require('./utils/serverConfigUtils');
const { doStickyStuff } = require('./utils/stickyUtils');
const { doPrune } = require('./utils/purgeUtils');

// ############################
// Initial Setup
//#############################

const DISCORD_DEV_TOKEN = process.env.DISCORD_DEV_TOKEN;
const DISCORD_APP_ID = process.env.DISCORD_APP_ID;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
  ]
});

const rest = new REST({version: '10'}).setToken(DISCORD_DEV_TOKEN);

client.once('ready', (c) => {
    console.log(`${c.user.tag} Loaded!`);
    setInterval(async () => {
      getServers().forEach(async (server) => {
        const channel = client.channels.cache.get(server.startChannelId);
        if (!!channel) {
          await doStickyStuff(channel, server.introTitle, server.introMessage, client);
        }
      })
    }, 30000);
});

async function setupCommands() {
  const commands = [
  {
    name: 'purge-rejects',
    description: 'Purge users with the reject role',
  }, {
    name: 'approve-user',
    description: 'Manually approve a user',
    options: [{
      name: 'user',
      description: 'User to approve',
      type: 6,
      required: true,
    }],
  }
];
  await rest.put(Routes.applicationCommands(DISCORD_APP_ID), {
    body: commands,
  })
}

setupCommands();

client.login(DISCORD_DEV_TOKEN);

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.on('interactionCreate', async (interaction) => {
  if(interaction.commandName === 'purge-rejects') await doPrune(interaction, client);

  if(interaction.commandName === 'approve-user') await doApprove(interaction, client);

  if(interaction.isModalSubmit() && interaction.customId === 'introModal') await handleIntroModalSubmit(interaction, client);
  
  if(interaction.isModalSubmit() && interaction.customId === 'rejectModal') await handleRejectModalSubmit(interaction, client);

  if(interaction.isButton()) await handleButtonClick(interaction, client);
});