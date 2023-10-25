const { Client, IntentsBitField, Routes, REST, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

// ############################
// Initial Setup
//#############################

const DISCORD_DEV_TOKEN = process.env.DISCORD_DEV_TOKEN;
const DISCORD_APP_ID = process.env.DISCORD_APP_ID;

const MY_SERVER_START_CHANNEL_ID = process.env.MY_SERVER_START_CHANNEL_ID;
const MY_SERVER_INTRO_CHANNEL_ID = process.env.MY_SERVER_INTRO_CHANNEL_ID;
const DEV_SERVER_START_CHANNEL_ID = process.env.DEV_SERVER_START_CHANNEL_ID;
const DEV_SERVER_INTRO_CHANNEL_ID = process.env.DEV_SERVER_INTRO_CHANNEL_ID;
const PROD_SERVER_START_CHANNEL_ID = process.env.PROD_SERVER_START_CHANNEL_ID;
const PROD_SERVER_INTRO_CHANNEL_ID = process.env.PROD_SERVER_INTRO_CHANNEL_ID;
const MY_SERVER_LOG_CHANNEL_ID = process.env.MY_SERVER_LOG_CHANNEL_ID;
const DEV_SERVER_LOG_CHANNEL_ID = process.env.DEV_SERVER_LOG_CHANNEL_ID;
const PROD_SERVER_LOG_CHANNEL_ID = process.env.PROD_SERVER_LOG_CHANNEL_ID;

const MY_SERVER_APPROVER_ROLE_ID = process.env.MY_SERVER_APPROVER_ROLE_ID;
const MY_SERVER_APPROVED_ROLE_ID = process.env.MY_SERVER_APPROVED_ROLE_ID;
const DEV_SERVER_APPROVER_ROLE_ID = process.env.DEV_SERVER_APPROVER_ROLE_ID;
const DEV_SERVER_APPROVED_ROLE_ID = process.env.DEV_SERVER_APPROVED_ROLE_ID;
const PROD_SERVER_APPROVER_ROLE_ID = process.env.PROD_SERVER_APPROVER_ROLE_ID;
const PROD_SERVER_APPROVED_ROLE_ID = process.env.PROD_SERVER_APPROVED_ROLE_ID;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
});

const rest = new REST({version: '10'}).setToken(DISCORD_DEV_TOKEN);

client.once('ready', (c) => {
    console.log('${c.user.tag} Loaded!');
});

async function setupCommands() {
  const commands = [
  {
    name: 'intro',
    description: 'Begin making your intro',
  }
];

  await rest.put(Routes.applicationCommands(DISCORD_APP_ID), {
    body: commands,
  })
}

setupCommands();

client.login(DISCORD_DEV_TOKEN);

// ############################
// Functionality
//#############################

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateIntro(interaction) {
  const age = interaction.fields.getTextInputValue('ageInput');
  const name = interaction.fields.getTextInputValue('nameInput');
  const pronouns = interaction.fields.getTextInputValue('pronounInput');
  const location = interaction.fields.getTextInputValue('locationInput');
  const hobbies = interaction.fields.getTextInputValue('hobbiesInput');
  return `${getFirstLine(interaction.user, name)} ${getSecondLine(name, age, location)} Their pronouns are ${pronouns}. ${getFinalLine(name, hobbies)}`;
}

function getFirstLine(user, name) {
  switch (randomIntFromInterval(1, 10)) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      return `Everyone join me in welcoming ${user} (A.K.A ${name}) to The Gayborhood!!`;
    case 9:
      return `The Gayborhood had a ${user} sized hole and they've decided to fill it. Thank you for filling our hole ${name}!`;
    case 10:
      return `UWU the Gayborhood just got more kawaii ^-^, someone just joined and its a cutie patootie called senpai ${user} (but u bakas can call them ${name}).`;
    default:
      return `Everyone join me in welcoming ${user} (A.K.A ${name}) to The Gayborhood!!`;
  }
}

function getSecondLine(name, age, location) {
  switch (randomIntFromInterval(1, 10)) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      return `${name} is ${age} years old and is from ${location}.`;
    case 8:
    case 9:
      if (parseInt(age) && parseInt(age) < 30) {
        break;
      }
      return `Though they look much younger, ${name} is actually ${age} years old! Must be something in the water over there in ${location}.`;
    case 10:
      return `${name} has been a certified bad bitch for ${age} years and was voted the baddest bitch in ${location} 3 years in a row.`;
    }
  return `${name} is ${age} years old and is from ${location}.`;
}

function getFinalLine(name, hobbies) {
  switch (randomIntFromInterval(1, 10)) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      return `${name}s hobbies and interests include: ${hobbies}`;
    case 9:
    case 10:
      return `When they're not setting fire to orphanages, ${name} likes: ${hobbies}`;
    default:
      return `${name}s hobbies and interests include: ${hobbies}`;
  }
}

function mapStartChannelIdToIntroChannelId(id) {
  switch (id) {
    case MY_SERVER_START_CHANNEL_ID:
      return MY_SERVER_INTRO_CHANNEL_ID;
    case DEV_SERVER_START_CHANNEL_ID:
      return DEV_SERVER_INTRO_CHANNEL_ID;
    case PROD_SERVER_START_CHANNEL_ID:
      return PROD_SERVER_INTRO_CHANNEL_ID;
    default:
      return MY_SERVER_INTRO_CHANNEL_ID;
  }
}

function mapLogChannelIdToApproverRoleId(id) {
  switch (id) {
    case MY_SERVER_LOG_CHANNEL_ID:
      return MY_SERVER_APPROVER_ROLE_ID;
    case DEV_SERVER_LOG_CHANNEL_ID:
      return DEV_SERVER_APPROVER_ROLE_ID;
    case PROD_SERVER_LOG_CHANNEL_ID:
      return PROD_SERVER_APPROVER_ROLE_ID;
    default:
      return MY_SERVER_APPROVER_ROLE_ID;
  }
}

function mapLogChannelIdToApprovedRoleId(id) {
  switch (id) {
    case MY_SERVER_LOG_CHANNEL_ID:
      return MY_SERVER_APPROVED_ROLE_ID;
    case DEV_SERVER_LOG_CHANNEL_ID:
      return DEV_SERVER_APPROVED_ROLE_ID;
    case PROD_SERVER_LOG_CHANNEL_ID:
      return PROD_SERVER_APPROVED_ROLE_ID;
    default:
      return MY_SERVER_APPROVED_ROLE_ID;
  }
}

function mapStartChannelIdToLogChannelId(id) {
  switch (id) {
    case MY_SERVER_START_CHANNEL_ID:
      return MY_SERVER_LOG_CHANNEL_ID;
    case DEV_SERVER_START_CHANNEL_ID:
      return DEV_SERVER_LOG_CHANNEL_ID;
    case PROD_SERVER_START_CHANNEL_ID:
      return PROD_SERVER_LOG_CHANNEL_ID;
    default:
      return MY_SERVER_LOG_CHANNEL_ID;
  }
}

function getLogButtonMessage(interaction, introMessage) {
  const user = introMessage.mentions.members.first().user;
  const message = `New Intro: ${introMessage.url} from ${user} (${user.username})`
  const accountAge = user.createdAt;
  if ((new Date().getTime() - accountAge.getTime()) < 604800000) {
    message + ` Warning, the users account was created recently (${accountAge.toLocaleDateString} - ${accountAge.toLocaleTimeString()})`
  }
  return message;
}

client.on('interactionCreate', async (interaction) => {
  if(interaction.commandName === 'intro') {
    const modal = new ModalBuilder()
			.setCustomId('introModal')
			.setTitle('Tell Us About Yourself');

      const ageInput = new TextInputBuilder()
      .setCustomId('ageInput')
			.setLabel("How old are you?")
      .setMaxLength(2)
      .setMinLength(1)
      .setPlaceholder('Enter a number!')
      .setRequired(true)
			.setStyle(TextInputStyle.Short);

      const nameInput = new TextInputBuilder()
      .setCustomId('nameInput')
			.setLabel("What would you prefer we call you?")
      .setMaxLength(25)
      .setMinLength(1)
      .setPlaceholder('Enter some text!')
      .setRequired(true)
			.setStyle(TextInputStyle.Short);

      const pronounInput = new TextInputBuilder()
      .setCustomId('pronounInput')
			.setLabel("What are your preferred pronouns?")
      .setMaxLength(25)
      .setMinLength(1)
      .setPlaceholder('Enter some text!')
      .setRequired(true)
			.setStyle(TextInputStyle.Short);

      const locationInput = new TextInputBuilder()
      .setCustomId('locationInput')
			.setLabel("Where are you from?")
      .setMaxLength(25)
      .setMinLength(1)
      .setPlaceholder('Enter some text!')
      .setRequired(true)
			.setStyle(TextInputStyle.Short);

      const hobbiesInput = new TextInputBuilder()
      .setCustomId('hobbiesInput')
			.setLabel("What's some of your hobbies/interests?")
      .setMaxLength(200)
      .setMinLength(20)
      .setPlaceholder('Enter some text!')
      .setRequired(true)
			.setStyle(TextInputStyle.Paragraph);

      const firstActionRow = new ActionRowBuilder().addComponents(ageInput);
      const secondActionRow = new ActionRowBuilder().addComponents(nameInput);
      const thirdActionRow = new ActionRowBuilder().addComponents(pronounInput);
      const fourthActionRow = new ActionRowBuilder().addComponents(locationInput);
      const fifthActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

      modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

      await interaction.showModal(modal);
  }

  if(interaction.isModalSubmit()) {
    // do this after so we can catch error and ask the user to try again
    interaction.reply({
      content: 'Generating your intro now! Server staff will review it and grant you entrance in to the server.',
      ephemeral: true
    })

    age = parseInt(interaction.fields.getTextInputValue('ageInput'));

    if (!age || age < 18) {
      const ban = new ButtonBuilder()
        .setCustomId('ban')
        .setLabel('Ban')
        .setStyle(ButtonStyle.Danger);
  
      const row = new ActionRowBuilder()
        .addComponents(ban);
      
      client.channels.cache.get(mapStartChannelIdToLogChannelId(interaction.channelId)).send({
        content: `🚨👮<(Underage user detected. ${interaction.member.user} claims to be ${age} years old)🚨`,
        components: [row],
      });
    } else {
      const approve = new ButtonBuilder()
        .setCustomId('approve')
        .setLabel('Approve')
        .setStyle(ButtonStyle.Primary);

        const ban = new ButtonBuilder()
        .setCustomId('ban')
        .setLabel('Ban')
        .setStyle(ButtonStyle.Danger);
  
      const row = new ActionRowBuilder()
        .addComponents(approve, ban);
  
      const introMessage = await client.channels.cache.get(mapStartChannelIdToIntroChannelId(interaction.channelId)).send({
        content: generateIntro(interaction)
      });
  
      client.channels.cache.get(mapStartChannelIdToLogChannelId(interaction.channelId)).send({
        content: getLogButtonMessage(interaction, introMessage),
        components: [row],
      });
    }
  }

  if(interaction.isButton()) {
    if (interaction.member.roles.cache.has(mapLogChannelIdToApproverRoleId(interaction.channelId))) {
      if (interaction.customId === 'approve') {
        const role = interaction.member.guild.roles.cache.get(mapLogChannelIdToApprovedRoleId(interaction.channelId));
        const member = interaction.message.mentions.members.first();

        if (!role || !member) {
          interaction.send({
            content: `I ran in to an issue doing that, please do it manually`,
          });
          return
        } else {
          member.roles.add(role)

          interaction.update({content: `${interaction.member.user} approved ${member.user} (${member.user.username}) to join the server`, components: []});
        }
      }
      if (interaction.customId === 'ban') {
        const member = interaction.message.mentions.members.first();

        if (!member) {
          interaction.send({
            content: `I ran in to an issue doing that, please do it manually`,
          });
          return;
        } else {
          member.ban({reason: 'Banned for intro so either underage or obvious troll'});

          interaction.update({content: `${interaction.member.user} banned ${member.user} (${member.user.username})`, components: []})
        }
      }
    }
  }
})