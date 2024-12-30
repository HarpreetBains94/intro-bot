const { getModRoleId, getServerLogChannelId } = require("./serverConfigUtils");

const wrapAsyncCallbackInRetry = async (asyncCallback, maxRetries) => {
  let hasSucceeded = false;
  let retries = 0;
  while (!hasSucceeded && retries <= maxRetries) {
    try {
      await asyncCallback();
      hasSucceeded = true;
    } catch (err) {
      retries = retries + 1;
      if (retries >= maxRetries) {
        console.log(err);
      }
    }
  }
  return hasSucceeded;
};

const interactingUserHasModRole = (interaction) => {
  return interaction.member.roles.cache.has(getModRoleId(interaction.guildId));
};

const handleAttachmentDelete = async (interaction, client) => {
  if (!interactingUserHasModRole(interaction)) {
    await interaction.reply({
      content: `You do not have the required role for this command.`,
      ephemeral: true
    });
    return;
  }

  const mod = interaction.member.user;
  const messageId = interaction.options.getString('message-id');
  const serverLogChannelId = getServerLogChannelId(interaction.guildId);
  const serverLogChannel = client.channels.cache.get(serverLogChannelId);

  if (!messageId || !serverLogChannel) {
    await interaction.reply({
      content: `Error: Please ensure you entered a valid message id`,
      ephemeral: true
    });
    return;
  }

  await interaction.reply({
    content: 'Fetching message',
    ephemeral: true
  });

  let message;
  await interaction.channel.messages.fetch(messageId).then(m => {
    message = m;
  }).catch(console.log);
  
  if (!message) {
    await interaction.followUp({
      content: `Error: There was an issue fetching the message.`,
      ephemeral: true
    });
    return;
  }

  const attachments = [];
  let attachmentSize = 0;
  message.attachments.each((v, k, m) => {
    attachmentSize += v.size;
    attachments.push(v.attachment);
  });

  if (attachmentSize > 50000000) {
    await interaction.followUp({
      content: 'Total attachment(s) size is too large',
      ephemeral: true
    });
    return;
  }

  await interaction.followUp({
    content: `Sending log in <#${serverLogChannelId}>`,
    ephemeral: true
  });

  await wrapAsyncCallbackInRetry(async () => {
    await serverLogChannel.send({
      content: `${mod} deleted a message containing attachments from ${message.author}`,
      files: attachments
    });
  }, 1);

  await interaction.followUp({
    content: 'Deleting message',
    ephemeral: true
  });

  let messageDeleted = false;
  await message.delete().then(m => {
    message = m;
    messageDeleted = true;
  }).catch(console.log);
  if (!messageDeleted) {
    await interaction.followUp({
      content: `Error: There was an issue deleting the message.`,
      ephemeral: true
    });
    return;
  }

  await interaction.followUp({
    content: 'Deletion successful',
    ephemeral: true
  });
}

module.exports = {
  wrapAsyncCallbackInRetry,
  interactingUserHasModRole,
  handleAttachmentDelete
};