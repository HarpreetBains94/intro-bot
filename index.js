const { Client, IntentsBitField, Routes, REST, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, AttachmentBuilder } = require('discord.js');

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
    setInterval(async () => {
      const devChannel = client.channels.cache.get(DEV_SERVER_START_CHANNEL_ID);
      const prodChannel = client.channels.cache.get(PROD_SERVER_START_CHANNEL_ID);
      await doStickyStuff(devChannel);
      await doStickyStuff(prodChannel);
    }, 30000);
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
// Helper Functions
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
  return `${getNewLine()}\n${getFirstLine(interaction.user, name)} ${getSecondLine(name, age, location)} Their pronouns are **${pronouns}**. ${getFinalLine(name, hobbies)}`;
}

function getNewLine() {
  return '♡‧₊˚✧ ૮ ˶ᵔ ᵕ ᵔ˶ ა ✧˚₊‧♡';
}

function getFirstLine(user, name) {
  switch (randomIntFromInterval(1, 21)) {
    case 1:
    case 2:
    case 3:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
      return `Everyone join me in welcoming **${user}** (A.K.A. **${name}**) to The Gayborhood!!`;
    case 11:
      return `Hey everyone! **${user}** (A.K.A. **${name}**) wanted me to tell you that they're here to chew ass and kick bubble gum, and they're all out of bubble gum.`
    case 12:
      return `Whoa, lock up your twinks; there's a new daddy in town. Say hello to **${user}** (A.K.A. **${name}**)!`;
    case 13:
      return `Gayborhood Association is proud to present **${user}** (A.K.A. **${name}**) as the newest member on the block.`;
    case 14:
      return `The Gayborhood is just taking in anybody these days.... Say hi to **${user}**  (A.K.A. **${name}**).`;
    case 15:
      return `The Gayborhood had a **${user}** sized hole and they've decided to fill it. Thank you for filling our hole **${name}**!`;
    case 16:
      return `uwu the Gayborhood just got a bit more kawaii ^-^, someone joined and its a cutie patootie called senpai **${user}** (but u bakas can call them **${name}** >_<).`;
    case 17:
      return `🚨WEEWOO WEEWOO🚨 Someone call the dingus police, we caught another one. This one's called **${user}**  (A.K.A. **${name}**).`;
    case 18:
      return `Is it hot in here or is it just **${user}**  (A.K.A. **${name}**)? (It could be global warming too, please do what you can to reduce your individual impact. More importantly threaten violence on the ruling capitalist class).`
    case 19:
      return `My fellow humans (of which I am totally one. Ignore the badge that says bot, its a discord glitch. I am a 100% totally flesh based being) join me in welcoming **${user}** (A.K.A. **${name}**) to The Gayborhood!`;
    case 20:
      return `Oi you lot. A new leng ting moved their fine nyash to the ends. Say wagwan to **${user}** (A.K.A. **${name}**).`;
    case 21:
      return `01101011 01101001 01101100 01101100 00100000 01100001 01101100 01101100 00100000 01101000 01110101 01101101 01100001 01101110 01110011. Oh sorry didn't see you there. Everyone, heres **${user}** (A.K.A. **${name}**). Be nice to them like I am with all humans.`;
    default:
      return `Everyone join me in welcoming **${user}** (A.K.A. **${name}**) to The Gayborhood!!`;
  }
}

function getSecondLine(name, age, location) {
  switch (randomIntFromInterval(1, 12)) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      return `**${name}** is **${age}** years old and is from **${location}**.`;
    case 7:
      if (!parseInt(age)) {
        break;
      }
      if (parseInt(age) < 30) {
        return `This widdle bubba has been growing for **${age}** years into a big stwong independent pewson. The stalk they were born from is in **${location}**.`;
      }
      return `Contrary to popular belief, **${name}** is actually **${age}** years old! The air quality in **${location}** must be great for them to look so good.`;
    case 8:
      return `Seasoned to perfection, **${name}** is **${age}** years old! Seasoned with that good ol' **${location}** seasoning, so you know its good.`;
    case 9:
      if (!parseInt(age)) {
        break;
      }
      if (parseInt(age) < 30) {
        return `All the way from **${location}** this undisputed baddie has been a reigning WWE champ for **${age}** years and counting.`;
      }
      return `Though they look much younger, **${name}** is actually **${age}** years old! Must be something in the water over there in **${location}**.`;
    case 10:
      return `**${name}** has been a certified bad bitch for **${age}** years and was voted the baddest bitch in **${location}** 3 years in a row.`;
    case 11:
      return `If **${name}** was a tree, they'd have **${age}** rings and the roots would be planted in **${location}**.`;
    case 12:
      return `You're not going to believe this but **${name}** is the same age and lives in the same place as me (°ロ°)! **${age}** years old and from **${location}**. This can be true because I am a real boy with an age and house, not a robot living on a raspberry pi... anyway.`;
    }
  return `**${name}** is **${age}** years old and is from **${location}**.`;
}

function getPluralUsername(name) {
  if (name.split('').pop().toLocaleLowerCase() === 's') {
    return `**${name}'**`;
  }
  return `**${name}s**`;
}

function getFinalLine(name, hobbies) {
  switch (randomIntFromInterval(1, 18)) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      return `${getPluralUsername(name)} hobbies and interests include: **${hobbies}**.`;
    case 7:
      return `Besides sniffing the seats on public transport, ${getPluralUsername(name)} hobbies and interests include: **${hobbies}**.`;
    case 8:
      return `When they're not saving kittens from trees, **${name}** likes: **${hobbies}**.`;
    case 9:
      return `Besides eating eating beans in the movie theater, ${getPluralUsername(name)} hobbies and interests include: **${hobbies}**.`
    case 10:
      return `When they're not setting fire to orphanages, **${name}** likes: **${hobbies}**.`;
    case 11:
      return `Besides eating cereal with a fork, **${name}** likes: **${hobbies}**.`;
    case 12:
      return `When they're not rescuing animals from factory farms, ${getPluralUsername(name)} hobbies and interests include: **${hobbies}**.`;
    case 13:
      return `When they're not holding up a boombox outside their crushes window trying to get their attention so they can confess their love, ${getPluralUsername(name)} hobbies and interests include: **${hobbies}**.`;
    case 14:
      return `If it wasn't for the crushing weight of capitalism, **${name}** would spend their free time doing: **${hobbies}**.`;
    case 15:
      return `Being a bad bitch is a full time job so in the little free time they get **${name}** likes to: **${hobbies}**.`;
    case 16:
      return `One of ${getPluralUsername(name)} favorite hobbies is perfectly reciting the navy seal copy pasta. You know the one that goes: "What the fuck did you just fucking say about me, you little shit? I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and Im the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and thats just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little clever comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.". Yeah that one. Anyway when they're not doing that ${getPluralUsername(name)} hobbies and interests include: **${hobbies}**.`;
    case 17:
      return `When they're not doing their court mandated community service, **${name}** likes: **${hobbies}**.`;
    case 18:
      return `Besides being a precious little sweetheart, ${getPluralUsername(name)} hobbies and interests include: **${hobbies}**`;
    default:
      return `${getPluralUsername(name)} hobbies and interests include: **${hobbies}**.`;
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

function mapLogChannelIdToStartChannelId(id) {
  switch (id) {
    case MY_SERVER_LOG_CHANNEL_ID:
      return MY_SERVER_START_CHANNEL_ID;
    case DEV_SERVER_LOG_CHANNEL_ID:
      return DEV_SERVER_START_CHANNEL_ID;
    case PROD_SERVER_LOG_CHANNEL_ID:
      return PROD_SERVER_START_CHANNEL_ID;
    default:
      return MY_SERVER_START_CHANNEL_ID;
  }
}

function mapLogChannelIdToIntroChannelId(id) {
  switch (id) {
    case MY_SERVER_LOG_CHANNEL_ID:
      return MY_SERVER_INTRO_CHANNEL_ID;
    case DEV_SERVER_LOG_CHANNEL_ID:
      return DEV_SERVER_INTRO_CHANNEL_ID;
    case PROD_SERVER_LOG_CHANNEL_ID:
      return PROD_SERVER_INTRO_CHANNEL_ID;
    default:
      return MY_SERVER_START_CHANNEL_ID;
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

function getLogButtonMessage(introMessage) {
  const user = introMessage.mentions.members.first().user;
  let message = `New Intro: ${introMessage.url} from ${user} (${user.username})`
  const accountAge = user.createdAt;
  if ((new Date().getTime() - accountAge.getTime()) < 2592000000) {
    message = message + `⚠️ Warning, the users account was created recently (less than 30 days old) ⚠️`
  }
  return message;
}

function getIntroModal() {
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
    .setLabel("Hobbies/Interests? Keep it wholesome please!")
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

  return modal;
}

// ############################
// Interaction Helper Functions
//#############################

async function handleIntroModalSubmit(interaction) {
  console.log(`Start intro modal submit member: ${interaction.member.user.username}`);
  try {
    await interaction.reply({
      content: 'Generating your intro now! Server staff will review it and grant you entrance in to the server.',
      ephemeral: true
    })
  } catch (err) {
    console.log(err);
    return;
  }

  age = parseInt(interaction.fields.getTextInputValue('ageInput'));

  if (!age || age < 18) {
    handleUnderageUser(interaction, age)
  } else {
    await sendIntroAndLogMessage(interaction)
  }
  console.log(`Done intro modal submit member: ${interaction.member.user.username}`);
}

async function handleRejectModalSubmit(interaction) {
  const member = interaction.message.mentions.members.first();
  const reason = interaction.fields.getTextInputValue('rejectionReason');

  console.log(`Start rejection modal submit member: ${member.user.username}`);

  let hasSucceeded = false;
  let retries = 0;
  if (!member) {
    while (!hasSucceeded && retries < 2) {
      try {
        await interaction.send({
          content: `I ran in to an issue doing that, please do it manually`,
        });
        hasSucceeded = true;
      } catch (err) {
        retries = retries + 1;
        if (retries >= 2) {
          console.log(err);
          return;
        }
      }
    }
    return;
  } else {
    const introMessageLink = interaction.message.content.split(' ')[2];
    deleteBadIntro(introMessageLink, client.channels.cache.get(mapLogChannelIdToIntroChannelId(interaction.channelId)));

    hasSucceeded = false;
    retries = 0;
    while (!hasSucceeded && retries < 2) {
      try {
        await interaction.update({content: `${interaction.member.user} rejected ${member.user} (${member.user.username}) to join the server`, components: []});
        hasSucceeded = true;
      } catch (err) {
        retries = retries + 1;
        if (retries >= 2) {
          console.log(err);
          return;
        }
      }
    }

    hasSucceeded = false;
    retries = 0;
    while (!hasSucceeded && retries < 2) {
      try {
        await client.channels.cache.get(mapLogChannelIdToStartChannelId(interaction.channelId)).send({
          content: `${member} your intro has been rejected for the following reason:\n\n"${reason}"\n\n Please try again.`
        });
        hasSucceeded = true;
      } catch (err) {
        retries = retries + 1;
        if (retries >= 2) {
          console.log(err);
          return;
        }
      }
    }
  }

  console.log(`Done rejection modal submit member: ${member.user.username}`);
}

async function handleUnderageUser(interaction, age) {
  const ban = new ButtonBuilder()
    .setCustomId('ban')
    .setLabel('Ban')
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder()
    .addComponents(ban);
  
  let hasSucceeded = false;
  let retries = 0;
  while (!hasSucceeded && retries < 2) {
    try {
      await client.channels.cache.get(mapStartChannelIdToLogChannelId(interaction.channelId)).send({
        content: `🚨👮<(Underage user detected. ${interaction.member.user} claims to be ${age} years old)🚨`,
        components: [row],
      });
      hasSucceeded = true;
    } catch (err) {
      retries = retries + 1;
      if (retries >= 2) {
        console.log(err);
        return;
      }
    }
  }
}

async function sendIntroAndLogMessage(interaction) {
  const approve = new ButtonBuilder()
    .setCustomId('approve')
    .setLabel('Approve')
    .setStyle(ButtonStyle.Success);

  const reject = new ButtonBuilder()
    .setCustomId('reject')
    .setLabel('Reject')
    .setStyle(ButtonStyle.Primary);
  
  const kick = new ButtonBuilder()
    .setCustomId('kick')
    .setLabel('Kick')
    .setStyle(ButtonStyle.Danger);

  const ban = new ButtonBuilder()
    .setCustomId('ban')
    .setLabel('Ban')
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder()
    .addComponents(approve, reject, kick, ban);

  let introMessageContent = generateIntro(interaction);

  while (introMessageContent.split('').length > 1950) {
    introMessageContent = generateIntro(interaction);
  }

  let introMessage;
  let hasSucceeded = false;
  let retries = 0;
  while (!hasSucceeded && retries < 2) {
    try {
      introMessage = await client.channels.cache.get(mapStartChannelIdToIntroChannelId(interaction.channelId)).send({
        content: introMessageContent
      });
      hasSucceeded = true;
    } catch (err) {
      retries = retries + 1;
      if (retries >= 2) {
        console.log(err);
        return;
      }
    }
  }

  hasSucceeded = false;
  retries = 0;
  while (!hasSucceeded && retries < 2) {
    try {
      client.channels.cache.get(mapStartChannelIdToLogChannelId(interaction.channelId)).send({
        content: getLogButtonMessage(introMessage),
        components: [row],
      });
      hasSucceeded = true;
    } catch (err) {
      retries = retries + 1;
      if (retries >= 2) {
        console.log(err);
        return;
      }
    }
  }
}

async function handleButtonClick(interaction) {
  if (interactingUserHasApproverRole(interaction)) {
    if (interaction.customId === 'approve') handleApproveClick(interaction);
    
    if (interaction.customId === 'kick') handleKickClick(interaction);
    
    if (interaction.customId === 'ban') handleBanClick(interaction);

    if (interaction.customId === 'reject') handleRejectClick(interaction);
  }
  if (interaction.customId === 'intro') handleShowIntroModal(interaction);
}

function interactingUserHasApproverRole(interaction) {
  return interaction.member.roles.cache.has(mapLogChannelIdToApproverRoleId(interaction.channelId));
}

async function handleApproveClick(interaction) {
  const role = interaction.member.guild.roles.cache.get(mapLogChannelIdToApprovedRoleId(interaction.channelId));
  const member = interaction.message.mentions.members.first();

  console.log(`Start approving member: ${member.user.username}`);

  let hasSucceeded = false;
  let retries = 0;

  if (!role || !member) {
    while (!hasSucceeded && retries < 2) {
      try {
        await interaction.send({
          content: `I ran in to an issue doing that, please do it manually`,
        });
        hasSucceeded = true;
      } catch (err) {
        retries = retries + 1;
        if (retries >= 2) {
          console.log(err);
          return;
        }
      }
    }
    return
  } else {
    hasSucceeded = false;
    retries = 0;
    while (!hasSucceeded && retries < 2) {
      try {
        await member.roles.add(role);
        hasSucceeded = true;
      } catch (err) {
        retries = retries + 1;
        if (retries >= 2) {
          console.log(err);
          return;
        }
      }
    }

    hasSucceeded = false;
    retries = 0;
    while (!hasSucceeded && retries < 2) {
      try {
        await interaction.update({content: `${interaction.member.user} approved ${member.user} (${member.user.username}) to join the server`, components: []});
        hasSucceeded = true;
      } catch (err) {
        retries = retries + 1;
        if (retries >= 2) {
          console.log(err);
          return;
        }
      }
    }
  }

  console.log(`Done approving member: ${member.user.username}`);
}

async function handleRejectClick(interaction) {
  const member = interaction.message.mentions.members.first();
  console.log(`Start reject member button click: ${member.user.username}`);
  let hasSucceeded = false;
  let retries = 0;
  while (!hasSucceeded && retries < 2) {
    try {
      await interaction.showModal(getRejectModal(member));
      hasSucceeded = true;
    } catch (err) {
      retries = retries + 1;
      if (retries >= 2) {
        console.log(err);
        return;
      }
    }
  }
  console.log(`Done reject member button click: ${member.user.username}`);
}

function getRejectModal(member) {
  const modal = new ModalBuilder()
    .setCustomId('rejectModal')
    .setTitle(`Rejecting ${member.user.username}`);

  const reason = new TextInputBuilder()
    .setCustomId('rejectionReason')
    .setLabel("Reason for rejection")
    .setMaxLength(500)
    .setMinLength(10)
    .setPlaceholder('Enter a reason')
    .setRequired(true)
    .setStyle(TextInputStyle.Paragraph);

  const firstActionRow = new ActionRowBuilder().addComponents(reason);

  modal.addComponents(firstActionRow);

  return modal;
}

async function handleBanClick(interaction) {
  const member = interaction.message.mentions.members.first();

  console.log(`Start ban member: ${member.user.username}`);

  let hasSucceeded = false;
  let retries = 0;

  if (!member) {
    while (!hasSucceeded && retries < 2) {
      try {
        await interaction.send({
          content: `I ran in to an issue doing that, please do it manually`,
        });
        hasSucceeded = true;
      } catch (err) {
        retries = retries + 1;
        if (retries >= 2) {
          console.log(err);
          return;
        }
      }
    }
    return;
  } else {
    const introMessageLink = interaction.message.content.split(' ')[2];
    deleteBadIntro(introMessageLink, client.channels.cache.get(mapLogChannelIdToIntroChannelId(interaction.channelId)));

    hasSucceeded = false;
    retries = 0;
    while (!hasSucceeded && retries < 2) {
      try {
        await member.ban({reason: 'Banned for intro so either underage or obvious troll'});
        hasSucceeded = true;
      } catch (err) {
        retries = retries + 1;
        if (retries >= 2) {
          console.log(err);
          return;
        }
      }
    }

    hasSucceeded = false;
    retries = 0;
    while (!hasSucceeded && retries < 2) {
      try {
        await interaction.update({content: `${interaction.member.user} banned ${member.user} (${member.user.username})`, components: []})
        hasSucceeded = true;
      } catch (err) {
        retries = retries + 1;
        if (retries >= 2) {
          console.log(err);
          return;
        }
      }
    }
  }

  console.log(`Done ban member: ${member.user.username}`);
}

async function handleKickClick(interaction) {
  const member = interaction.message.mentions.members.first();

  console.log(`Start kick member: ${member.user.username}`);

  let hasSucceeded = false;
  let retries = 0;

  if (!member) {
    while (!hasSucceeded && retries < 2) {
      try {
        await interaction.send({
          content: `I ran in to an issue doing that, please do it manually`,
        });
        hasSucceeded = true;
      } catch (err) {
        retries = retries + 1;
        if (retries >= 2) {
          console.log(err);
          return;
        }
      }
    }
    return;
  } else {
    const introMessageLink = interaction.message.content.split(' ')[2];
    deleteBadIntro(introMessageLink, client.channels.cache.get(mapLogChannelIdToIntroChannelId(interaction.channelId)));

    hasSucceeded = false;
    retries = 0;
    while (!hasSucceeded && retries < 2) {
      try {
        await member.kick(['Kicked for intro so probably too horny']);
        hasSucceeded = true;
      } catch (err) {
        retries = retries + 1;
        if (retries >= 2) {
          console.log(err);
          return;
        }
      }
    }

    hasSucceeded = false;
    retries = 0;
    while (!hasSucceeded && retries < 2) {
      try {
        await interaction.update({content: `${interaction.member.user} kicked ${member.user} (${member.user.username})`, components: []})
        hasSucceeded = true;
      } catch (err) {
        retries = retries + 1;
        if (retries >= 2) {
          console.log(err);
          return;
        }
      }
    }
  }

  console.log(`Done kick member: ${member.user.username}`);
}

async function handleShowIntroModal(interaction) {
  let hasSucceeded = false;
  let retries = 0;
  while (!hasSucceeded && retries < 2) {
    try {
      await interaction.showModal(getIntroModal());
      hasSucceeded = true;
    } catch (err) {
      retries = retries + 1;
      if (retries >= 2) {
        console.log(err);
        return;
      }
    }
  }
}

async function doStickyStuff(channel) {
  var lastChannelMessage = null;
  let hasSucceeded = false;
  let retries = 0;
  while (!hasSucceeded && retries < 2) {
    try {
      await channel.messages.fetch({ limit: 1 }).then(messages => {
        lastChannelMessage = messages.first();
      });
      if (shouldResendSticky(lastChannelMessage)) {
        const otherMessagesFromBot = [];
        await channel.messages.fetch({ limit: 99 }).then(messages => {
          messages.forEach(message => {
            if ((message.author.id === client.user.id) && (message.embeds.length > 0)) {
              otherMessagesFromBot.push(message);
            }
          })
        });
        await channel.bulkDelete(otherMessagesFromBot);
        const intro = new ButtonBuilder()
        .setCustomId('intro')
        .setLabel('Begin Intro')
        .setStyle(ButtonStyle.Primary);
    
        const row = new ActionRowBuilder()
          .addComponents(intro);
        
        const embed = new EmbedBuilder()
          .setColor(0x0099FF)
          .setTitle('How to Gain Entry to the Server')
          .setDescription("To get started in this server first you'll need to generate an intro. Click the **Begin Intro** button below.\n\nOnce you've made your intro please wait for a staff member to review and grant you access.\n\n__PLEASE NOTE THIS IS **NOT** A PORN SERVER__")
          .setTimestamp()
        channel.send({
          embeds: [embed],
          components: [row]});
      }
      hasSucceeded = true;
    } catch (err) {
      retries = retries + 1;
      if (retries >= 2) {
        console.log(err);
        return;
      }
    }
  }
}

function shouldResendSticky(lastChannelMessage) {
  if (!lastChannelMessage) {
    return true; 
  } else {
      if (lastChannelMessage.author.id !== client.user.id) {
        return true;
      } else {
        return lastChannelMessage.embeds.length > 0 ? false : true;
      }
  }
}

async function deleteBadIntro(url, channel) {
  const x = url.split('/');
  const messageId = x[x.length - 1];
  let foundMessage;
  await channel.messages.fetch(messageId).then(message => {
    foundMessage = message
  });
  if (!!foundMessage) {
    let hasSucceeded = false;
    let retries = 0;
    while (!hasSucceeded && retries < 2) {
      try {
        await foundMessage.delete();
        hasSucceeded = true;
      } catch (err) {
        retries = retries + 1;
        if (retries >= 2) {
          console.log(err);
          return;
        }
      }
    }
  }
}

// ############################
// Respond to user interactions
//#############################

client.on('interactionCreate', async (interaction) => {
  if(interaction.commandName === 'intro') await interaction.showModal(getIntroModal());

  if(interaction.isModalSubmit() && interaction.customId === 'introModal') await handleIntroModalSubmit(interaction);
  
  if(interaction.isModalSubmit() && interaction.customId === 'rejectModal') await handleRejectModalSubmit(interaction);

  if(interaction.isButton()) await handleButtonClick(interaction);
});


// TODO:
// move code out to separate files
// add function for handling retries that accepts a callback