const { Client, IntentsBitField, Routes, REST } = require('discord.js');
const { handleIntroModalSubmit, handleRejectModalSubmit, handleButtonClick, doApprove, doVerify } = require('./utils/introUtils');
const { getServers, getStickies } = require('./utils/serverConfigUtils');
const { doStickyStuff } = require('./utils/stickyUtils');
const { inviteUserToChannel } = require('./utils/channelUtils');
const { doPrune } = require('./utils/purgeUtils');
const { handleShowGenerateEmbedModal, handleEmbedModalSubmit } = require('./utils/embedUtil');

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
      const stickies = [];
      getServers().forEach((server) => {
        stickies.push(...getStickies(server.id));
      })
      stickies.forEach(async (sticky) => {
        const channel = client.channels.cache.get(sticky.channelId);
        if (!!channel) {
          await doStickyStuff(channel, sticky.stickyTitle, sticky.stickyMessage, sticky.isBeginIntroSticky, client);
        }
      })
    }, 60000);
});

async function setupCommands() {
  const commands = [
  {
    name: 'purge-rejects',
    description: 'Purge users with the reject role',
  }, {
    name: 'test-purge-rejects',
    description: 'Show who would be purged if the purge command was run',
  }, {
    name: 'ping',
    description: 'Check if the bot is up',
  }, {
    name: 'approve-user',
    description: 'Manually approve a user',
    options: [{
      name: 'user',
      description: 'User to approve',
      type: 6,
      required: true,
    }],
  }, {
    name: 'invite-user-to-channel',
    description: 'Gives a user view the current channel',
    options: [{
      name: 'user',
      description: 'User to invite',
      type: 6,
      required: true,
    }],
  }, {
    name: 'generate-embed',
    description: 'Generate a simple embed'
  }, {
    name: 'generate-embed-help',
    description: 'For help with the embed syntax'
  }, {
    name: 'verify-user',
    description: 'Manually verify a user',
    options: [{
      name: 'user',
      description: 'User to verify',
      type: 6,
      required: true,
    }, {
      name: 'type',
      description: 'Verification type',
      type: 3,
      required: true,
      choices: [{
        name: 'photo id',
        value: 'photo id',
      }, {
        name: 'server',
        value: 'server',
      }],
    }, {
      name: 'server-name',
      description: '(OPTIONAL) If verification type is server which server was it?',
      type: 3,
      required: false,
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
  if(interaction.commandName === 'purge-rejects') await doPrune(interaction, client, false);

  if(interaction.commandName === 'test-purge-rejects') await doPrune(interaction, client, true);

  if(interaction.commandName === 'approve-user') await doApprove(interaction, client);

  if(interaction.commandName === 'invite-user-to-channel') await inviteUserToChannel(interaction, client);

  if(interaction.commandName === 'verify-user') await doVerify(interaction, client);
  
  if(interaction.isModalSubmit() && interaction.customId === 'introModal') await handleIntroModalSubmit(interaction, client);
  
  if(interaction.isModalSubmit() && interaction.customId === 'rejectModal') await handleRejectModalSubmit(interaction, client);
  
  if(interaction.isButton()) await handleButtonClick(interaction, client);

  if (interaction.commandName === 'ping') {
    await interaction.reply({
      content: 'pong',
    });
  }

  if (interaction.commandName === 'generate-embed-help') {
    await interaction.reply({
      content: 'See https://discordjs.guide/popular-topics/embeds.html#embed-preview for a breakdown on what the different inputs mean.' +
      '\n\nFor adding fields input a list of titles and content separated by double semi-colons (;;). There can be a max of 25 fields and field titles are limited to 256 characters and the content is limited to 1024 characters.\ne.g. Title 1;;Content 1;;Title 2;;Content 2' +
      '\n\nFor the channel id, set your account in developer mode by going to advanced settings. After that you can right click on channels and copy their id.',
      ephemeral: true
    });
  }

  if(interaction.commandName === 'generate-embed') await handleShowGenerateEmbedModal(interaction);

  if(interaction.isModalSubmit() && interaction.customId === 'embedModal') await handleEmbedModalSubmit(interaction, client);
});