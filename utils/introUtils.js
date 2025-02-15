const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { wrapAsyncCallbackInRetry, interactingUserHasModRole } = require('./utils');
const { getMinimumAge, getNewIntroSeparator, getIntroSentencesGroups, getIntroQuestions, getIntroModalTitle, getIntroLogChannelId, getIntroChannelId, getApprovedRoleId, getModRoleId, getServerName, getRejectRoleId, getServerHideIntroApproveFlow, getVerifiedRoleId } = require('./serverConfigUtils');

const getIntroModal = (serverId) => {
  const modal = new ModalBuilder()
    .setCustomId('introModal')
    .setTitle(getIntroModalTitle(serverId));

  questionRows = [];

  getIntroQuestions(serverId).forEach((questionConfig) => {
    questionRows.push(new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId(questionConfig.id)
        .setLabel(questionConfig.label)
        .setMinLength(questionConfig.minLength)
        .setMaxLength(questionConfig.maxLength)
        .setPlaceholder(questionConfig.placeHolder)
        .setRequired(true)
        .setStyle(questionConfig.isLongInput ? TextInputStyle.Paragraph : TextInputStyle.Short)
      ));
  });

  modal.addComponents(...questionRows);

  return modal;
};

const randomIntFromInterval = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
};

const generateIntro = (interaction) => {
  const serverName = getServerName(interaction.guildId);
  const user = interaction.user;
  const answerIds = getIntroQuestions(interaction.guildId).map((questionConfig) => questionConfig.id);
  const sentenceGroups = getIntroSentencesGroups(interaction.guildId);
  let intro = '';

  sentenceGroups.forEach((sentenceGroup, index) => {
    chanceWeightedSentenceArray = [];
    sentenceGroup.forEach((sentence, index) => {
      chanceWeightedSentenceArray.push(...Array(sentence.chance).fill(index));
    });
    if (index === 0) {
      intro += `${getNewIntroSeparator(interaction.guildId)}\n`;
    } else {
      intro += ' ';
    }
    intro += sentenceGroup[chanceWeightedSentenceArray[randomIntFromInterval(0, chanceWeightedSentenceArray.length - 1)]].value;
  });

  intro = intro.replaceAll('_USER', user);
  intro = intro.replaceAll('_SERVER_NAME', serverName);
  answerIds.forEach((answerId) => {
    intro = intro.replaceAll(answerId, interaction.fields.getTextInputValue(answerId));
  });

  return intro;
};

const getPluralUsername = (name) => {
  if (name.split('').pop().toLocaleLowerCase() === 's') {
    return `**${name}'**`;
  }
  return `**${name}s**`;
};

const handleIntroModalSubmit = async (interaction, client) => {
  console.log(`Start intro modal submit member: ${interaction.member.user.username}`);
  
  const hasSuccessfullySentEphemeralStatusMessage = await wrapAsyncCallbackInRetry(async () => {
    await interaction.reply({
      content: 'Generating your intro now! Server staff will review it and grant you entrance in to the server.',
      ephemeral: true
    })
  }, 2);
  
  if (!hasSuccessfullySentEphemeralStatusMessage) {
    return;
  }

  let ageAnswerKey = null;

  getIntroQuestions(interaction.guildId).forEach((questionConfig) => {
    // Only take first age related question if there are multiple
    if (questionConfig.isAgeInput && !ageAnswerKey) {
      ageAnswerKey = questionConfig.id;
    }
  });

  if (ageAnswerKey) {
    age = parseInt(interaction.fields.getTextInputValue(ageAnswerKey));
  
    if (!age || age < getMinimumAge(interaction.guildId)) {
      await handleUnderageUser(interaction, age, client)
    } else {
      await sendIntroAndLogMessage(interaction, client)
    }
  } else {
    await sendIntroAndLogMessage(interaction, client)
  }

  console.log(`End intro modal submit member: ${interaction.member.user.username}`);
};

const handleRejectModalSubmit = async (interaction, client) => {
  const member = interaction.message.mentions.members.first();
  if (!member) {
    await handleNoMember(interaction);
    return;
  }
  const reason = interaction.fields.getTextInputValue('rejectionReason');

  console.log(`Start rejection modal submit member: ${member.user.username}`);

  if (!member) {
    await wrapAsyncCallbackInRetry(async () => {
      await interaction.send({
        content: `I ran in to an issue doing that, please do it manually`,
      });
    }, 2);
    return;
  } else {
    const introMessageLink = interaction.message.content.split(' ')[2];
    await deleteBadIntro(introMessageLink, client.channels.cache.get(getIntroChannelId(interaction.guildId)));

    const hasSuccessfullySentRejectionLogMessage = await wrapAsyncCallbackInRetry(async () => {
      await interaction.update(
        {
          content: `${interaction.member.user} rejected ${member.user} (${member.user.username}) to join the server`,
          components: []
        }
      );
    }, 2);
    
    if (!hasSuccessfullySentRejectionLogMessage) {
      return;
    }
    const serverName = getServerName(interaction.guildId);
    const hasSuccessfullySentRejectionMessage = await wrapAsyncCallbackInRetry(async () => {
      await member.user.send(`Hey! FYI Your intro for "${serverName}" has been rejected for the following reason:\n\n"${reason}"\n\n Please try again or reach out to server staff.`);
    }, 2);

    if (!hasSuccessfullySentRejectionMessage) {
      return;
    }

    const hasSuccessfullySentRejectionReasonLogMessage = await wrapAsyncCallbackInRetry(async () => {
      await client.channels.cache.get(getIntroLogChannelId(interaction.guildId)).send({
        content: `${member.user} was rejected for the following reason: "${reason}"`,
      });
    }, 2);

    if (!hasSuccessfullySentRejectionReasonLogMessage) {
      return;
    }
  }
  console.log(`End rejection modal submit member: ${member.user.username}`);
};

const handleUnderageUser = async (interaction, age, client) => {
  console.log(`Start underage log message member: ${interaction.member.user.username}`);
  const ban = new ButtonBuilder()
    .setCustomId('banAge')
    .setLabel('Ban')
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder()
    .addComponents(ban);

  const hasSuccessfullySentUnderageLogMessage = await wrapAsyncCallbackInRetry(async () => {
    await client.channels.cache.get(getIntroLogChannelId(interaction.guildId)).send({
      content: `🚨👮<(Underage user detected. ${interaction.member.user} claims to be ${age} years old)🚨`,
      components: [row],
    });
  }, 2);

  if (!hasSuccessfullySentUnderageLogMessage) {
    return;
  }

  console.log(`End underage log message member: ${interaction.member.user.username}`);
};

const sendIntroAndLogMessage = async (interaction, client) => {
  console.log(`Start send intro and log message member: ${interaction.member.user.username}`);
  const hideIntroApproveFlow = getServerHideIntroApproveFlow(interaction.guildId); 
  const row = new ActionRowBuilder();
  if (!hideIntroApproveFlow) {
    const approve = new ButtonBuilder()
      .setCustomId('approve')
      .setLabel('Approve')
      .setStyle(ButtonStyle.Success);
  
    const reject = new ButtonBuilder()
      .setCustomId('reject')
      .setLabel('Reject')
      .setStyle(ButtonStyle.Primary);

    row.addComponents(approve, reject);
  } else {
    const acknowledge = new ButtonBuilder()
      .setCustomId('acknowledge')
      .setLabel('acknowledge')
      .setStyle(ButtonStyle.Primary);

    row.addComponents(acknowledge);
  }
  
  const kick = new ButtonBuilder()
    .setCustomId('kick')
    .setLabel('Kick')
    .setStyle(ButtonStyle.Danger);

  const ban = new ButtonBuilder()
    .setCustomId('ban')
    .setLabel('Ban')
    .setStyle(ButtonStyle.Danger);

  row.addComponents(kick, ban);

  let introMessageContent = generateIntro(interaction);

  while (introMessageContent.split('').length > 1950) {
    introMessageContent = generateIntro(interaction);
  }

  let introMessage;
  let hasSucceeded = false;
  let retries = 0;
  while (!hasSucceeded && retries < 2) {
    try {
      introMessage = await client.channels.cache.get(getIntroChannelId(interaction.guildId)).send({
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

  const hasSuccessfullySentUnderageLogMessage = await wrapAsyncCallbackInRetry(async () => {
    client.channels.cache.get(getIntroLogChannelId(interaction.guildId)).send({
      content: getLogButtonMessage(introMessage),
      components: [row],
    });
  }, 2);

  if (!hasSuccessfullySentUnderageLogMessage) {
    return;
  }

  console.log(`End send intro and log message member: ${interaction.member.user.username}`);
};

const getLogButtonMessage = (introMessage) => {
  const user = introMessage.mentions.members.first().user;
  let message = `New Intro: ${introMessage.url} from ${user} (${user.username})`
  const accountAge = user.createdAt;
  if ((new Date().getTime() - accountAge.getTime()) < 2592000000) {
    message = message + `⚠️ Warning, the users account was created recently (less than 30 days old) ⚠️`
  }
  return message;
};

const handleButtonClick = async (interaction, client) => {
  if (interactingUserHasModRole(interaction)) {
    if (interaction.customId === 'approve') handleApproveClick(interaction);

    if (interaction.customId === 'acknowledge') handleAcknowledgeClick(interaction);
    
    if (interaction.customId === 'kick') handleKickClick(interaction, client);
    
    if (interaction.customId === 'ban') handleBanClickAndDeleteBadIntro(interaction, client);

    if (interaction.customId === 'banAge') handleBanClick(interaction);

    if (interaction.customId === 'reject') handleRejectClick(interaction);
  }
  if (interaction.customId === 'intro') handleShowIntroModal(interaction);
};

const handleApproveClick = async (interaction) => {
  const role = interaction.member.guild.roles.cache.get(getApprovedRoleId(interaction.guildId));
  const member = interaction.message.mentions.members.first();
  if (!member) {
    await handleNoMember(interaction);
    return;
  }

  console.log(`Start approving member: ${member.user.username}`);

  if (!role || !member) {

    await wrapAsyncCallbackInRetry(async () => {
      await interaction.send({
        content: `I ran in to an issue doing that, please do it manually`,
      });
    }, 2);
    return
  } else {
    const hasSuccessfullyAddedRole = await wrapAsyncCallbackInRetry(async () => {
      await member.roles.add(role);
    }, 2);
  
    if (!hasSuccessfullyAddedRole) {
      return;
    }

    const serverName = getServerName(interaction.guildId);
    await wrapAsyncCallbackInRetry(async () => {
      await member.user.send(`Congrats! You have been approved as a member of "${serverName}"`);
    }, 2);

    const hasSuccessfullySentApprovedLogMessage = await wrapAsyncCallbackInRetry(async () => {
      await interaction.update(
        {
          content: `${interaction.member.user} approved ${member.user} (${member.user.username}) to join the server`,
          components: []
        }
      );
    }, 2);
  
    if (!hasSuccessfullySentApprovedLogMessage) {
      return;
    }
  }

  console.log(`End approving member: ${member.user.username}`);
};

const handleAcknowledgeClick = async (interaction) => {
  const member = interaction.message.mentions.members.first();
  if (!member) {
    await handleNoMember(interaction);
    return;
  }

  await wrapAsyncCallbackInRetry(async () => {
    await interaction.update(
      {
        content: `${interaction.member.user} acknowledged ${member.user} (${member.user.username}) to join the server`,
        components: []
      }
    );
  }, 2);
};

const handleRejectClick = async (interaction) => {
  const member = interaction.message.mentions.members.first();
  if (!member) {
    await handleNoMember(interaction);
    return;
  }
  console.log(`Start reject member button click: ${member.user.username}`);
  await wrapAsyncCallbackInRetry(async () => {
    await interaction.showModal(getRejectModal(member));
  }, 2);
  console.log(`End reject member button click: ${member.user.username}`);
};

const getRejectModal = (member) => {
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
};

const handleBanClickAndDeleteBadIntro = async (interaction, client) => {
  const introMessageLink = interaction.message.content.split(' ')[2];
  await deleteBadIntro(introMessageLink, client.channels.cache.get(getIntroChannelId(interaction.guildId)));
  await handleBanClick(interaction);
}

const handleBanClick = async (interaction) => {
  const member = interaction.message.mentions.members.first();
  if (!member) {
    await handleNoMember(interaction);
    return;
  }

  console.log(`Start ban member: ${member.user.username}`);

  if (!member) {
    await wrapAsyncCallbackInRetry(async () => {
      await interaction.send({
        content: `I ran in to an issue doing that, please do it manually`,
      });
    }, 2);
    return;
  } else {
    if (!member.bannable) {
      const hasSuccessfullySentMemberNotBannableMessage = await wrapAsyncCallbackInRetry(async () => {
        await interaction.update(
          {
            content: `INFO: ${member.user} (${member.user.username}) could not be banned. This is either due to them already having left the server, the user is an admin, or there is a bot error. Please ban them manually.`,
            components: []
          }
        );
      }, 2);
    
      if (!hasSuccessfullySentMemberNotBannableMessage) {
        return;
      }
    }

    const hasSuccessfullyBannedMember = await wrapAsyncCallbackInRetry(async () => {
      member.ban({reason: 'Banned for intro so either underage or obvious troll'}).catch(console.error);
    }, 2);
  
    if (!hasSuccessfullyBannedMember) {
      return;
    }

    const hasSuccessfullySentBannedLogMessage = await wrapAsyncCallbackInRetry(async () => {
      await interaction.update(
        {
          content: `${interaction.member.user} banned ${member.user} (${member.user.username})`,
          components: []
        }
      );
    }, 2);
  
    if (!hasSuccessfullySentBannedLogMessage) {
      return;
    }
  }

  console.log(`End ban member: ${member.user.username}`);
};

const handleKickClick = async (interaction, client) => {
  const introMessageLink = interaction.message.content.split(' ')[2];
  await deleteBadIntro(introMessageLink, client.channels.cache.get(getIntroChannelId(interaction.guildId)));

  const member = interaction.message.mentions.members.first();
  if (!member) {
    await handleNoMember(interaction);
    return;
  }

  console.log(`Start kick member: ${member.user.username}`);

  if (!member) {
    await wrapAsyncCallbackInRetry(async () => {
      await interaction.send({
        content: `I ran in to an issue doing that, please do it manually`,
      });
    }, 2);
    return;
  } else {
    const hasSuccessfullyKickedMember = await wrapAsyncCallbackInRetry(async () => {
      await member.kick(['Kicked for intro so probably too horny']);
    }, 2);
  
    if (!hasSuccessfullyKickedMember) {
      return;
    }

    const hasSuccessfullySentKickMemberLogMessage = await wrapAsyncCallbackInRetry(async () => {
      await interaction.update(
        {
          content: `${interaction.member.user} kicked ${member.user} (${member.user.username})`,
          components: []
        }
      );
    }, 2);
  
    if (!hasSuccessfullySentKickMemberLogMessage) {
      return;
    }
  }

  console.log(`End kick member: ${member.user.username}`);
};

const handleShowIntroModal = async (interaction) => {
  await wrapAsyncCallbackInRetry(async () => {
    await interaction.showModal(getIntroModal(interaction.guildId));
  }, 2);
};

const deleteBadIntro = async (url, channel) => {
  console.log('Deleting bad intro');
  const x = url.split('/');
  const messageId = x[x.length - 1];
  let foundMessage;
  await channel.messages.fetch(messageId)
    .then(message => {
      foundMessage = message
    })
    .catch((err) => {
      console.log('#### Failed deleting intro, message not found ####');
      console.log(err);
      console.log('##################################################');
    });
  if (!!foundMessage) {
    await wrapAsyncCallbackInRetry(async () => {
      await foundMessage.delete();
    }, 2);
  }
  console.log('Done deleting bad intro');
};

const handleNoMember = async (interaction) => {
  await wrapAsyncCallbackInRetry(async () => {
    await interaction.update({
      content: 'Interaction Failed, probably due to member already leaving the server. Please manually confirm the member is no longer in the server and that their intro has been deleted.',
      components: []
    });
  }, 2);
};

const doApprove = async (interaction, client) => {
  await wrapAsyncCallbackInRetry(async () => {
    if (!interactingUserHasModRole(interaction)) {
      await wrapAsyncCallbackInRetry(async () => {
        await interaction.reply({
          content: 'You do not have permissions to use this command.',
          ephemeral: true,
        });
        return;
      }, 2);
      return;
    }
    const mod = interaction.member;
    const approvedRole = interaction.member.guild.roles.cache.get(getApprovedRoleId(interaction.guildId));
    const rejectRole = interaction.member.guild.roles.cache.get(getRejectRoleId(interaction.guildId));
    const serverName = getServerName(interaction.guildId);
    const user = interaction.options.getUser('user');
    const member = interaction.member.guild.members.cache.get(user.id);
    if (!member) {
      await wrapAsyncCallbackInRetry(async () => {
        await interaction.reply({
          content: 'Interaction failed, please manually add the approved role and remove the reject role from the user.'
        });
      }, 2);
      return;
    }
    const hasSuccessfullyAddedRole = await wrapAsyncCallbackInRetry(async () => {
      await member.roles.add(approvedRole);
    }, 2);

    const hasSuccessfullyRemovedRole = await wrapAsyncCallbackInRetry(async () => {
      await member.roles.remove(rejectRole);
    }, 2);

    let updates = `${mod.user} approved ${member.user} (${member.user.username}): `;
    updates += hasSuccessfullyAddedRole ? 'Successfully added approved role. ' : 'Failed to add approved role, please do it manually. ';
    updates += hasSuccessfullyRemovedRole ? 'Successfully removed reject role. ' : 'Failed to remove reject role, please do it manually. ';
    await wrapAsyncCallbackInRetry(async () => {
      await client.channels.cache.get(getIntroLogChannelId(interaction.guildId)).send({
        content: updates,
      });
    }, 2);

    await wrapAsyncCallbackInRetry(async () => {
      await interaction.reply({
        content: 'Interaction complete, check the log channel for the status',
        ephemeral: true,
      });
    }, 2);

    await wrapAsyncCallbackInRetry(async () => {
      await user.send(`Congrats! You have been approved as a member of "${serverName}"`);
    }, 2);
  }, 0);
};

const doVerify = async (interaction, client) => {
  await wrapAsyncCallbackInRetry(async () => {
    if (!interactingUserHasModRole(interaction)) {
      await wrapAsyncCallbackInRetry(async () => {
        await interaction.reply({
          content: 'You do not have permissions to use this command.',
          ephemeral: true,
        });
        return;
      }, 2);
      return;
    }
    const mod = interaction.member;
    const verifiedRole = interaction.member.guild.roles.cache.get(getVerifiedRoleId(interaction.guildId));
    const user = interaction.options.getUser('user');
    const verificationType = interaction.options.getString('type');
    const verificationServer = interaction.options.getString('server-name');
    const member = interaction.member.guild.members.cache.get(user.id);
    if (!member) {
      await wrapAsyncCallbackInRetry(async () => {
        await interaction.reply({
          content: 'Interaction failed, please manually add the verified role.'
        });
      }, 2);
      return;
    }
    const hasSuccessfullyAddedRole = await wrapAsyncCallbackInRetry(async () => {
      await member.roles.add(verifiedRole);
    }, 2);

    let updates = `${mod.user} verified ${member.user}: (${member.user.username}). Verification method: ${verificationType}.`;
    if (verificationServer) {
      updates += ` Verification server: ${verificationServer}`;
    }

    await wrapAsyncCallbackInRetry(async () => {
      await client.channels.cache.get(getIntroLogChannelId(interaction.guildId)).send({
        content: updates,
      });
    }, 2);

    await wrapAsyncCallbackInRetry(async () => {
      await interaction.reply({
        content: 'Interaction complete, check the log channel for the status',
        ephemeral: true,
      });
    }, 2);
  }, 0);
};

module.exports = {
  handleIntroModalSubmit,
  handleRejectModalSubmit,
  handleButtonClick,
  doApprove,
  doVerify,
};