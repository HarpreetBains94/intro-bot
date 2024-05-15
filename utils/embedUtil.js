const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const { wrapAsyncCallbackInRetry, interactingUserHasApproverRole } = require("./utils");

const handleShowGenerateEmbedModal = async (interaction) => {
  if (!interactingUserHasApproverRole(interaction)) {
    return;
  }
  await wrapAsyncCallbackInRetry(async () => {
    await interaction.showModal(getEmbedModal());
  }, 2);
};

const getEmbedModal = () => {
  const modal = new ModalBuilder()
    .setCustomId('embedModal')
    .setTitle('Generate Your Embed');

  const channelInput = new TextInputBuilder()
    .setCustomId('channelId')
    .setLabel("Channel ID")
    .setMaxLength(256)
    .setMinLength(1)
    .setPlaceholder('Enter Channel ID')
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const titleInput = new TextInputBuilder()
    .setCustomId('titleInput')
    .setLabel("Embed Title")
    .setMaxLength(256)
    .setMinLength(1)
    .setPlaceholder('Enter your title!')
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const descriptionInput = new TextInputBuilder()
    .setCustomId('descriptionInput')
    .setLabel("Embed Description")
    .setMaxLength(2048)
    .setPlaceholder('Enter some text!')
    .setRequired(false)
    .setStyle(TextInputStyle.Paragraph);

  const fieldsInput = new TextInputBuilder()
    .setCustomId('fieldsInput')
    .setLabel("Embed Fields")
    .setMaxLength(4000)
    .setMinLength(0)
    .setPlaceholder('Enter Fields (use the generate-embed-help command to see the format)')
    .setRequired(false)
    .setStyle(TextInputStyle.Paragraph);

  const imageLinkInput = new TextInputBuilder()
    .setCustomId('imageLinkInput')
    .setLabel("Image Link")
    .setPlaceholder('Enter image link')
    .setRequired(false)
    .setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(channelInput);
  const secondActionRow = new ActionRowBuilder().addComponents(titleInput);
  const thirdActionRow = new ActionRowBuilder().addComponents(descriptionInput);
  const fourthActionRow = new ActionRowBuilder().addComponents(fieldsInput);
  const fifthActionRow = new ActionRowBuilder().addComponents(imageLinkInput);

  modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

  return modal;
};

const handleEmbedModalSubmit = async (interaction, client) => {
  const channelId = interaction.fields.getTextInputValue('channelId');
  if (!channelId) {
    await wrapAsyncCallbackInRetry(async () => {
      interaction.reply({
        content: 'Channel ID required. Please use the generate-embed-help command for help',
        ephemeral: true
      });
    }, 2);
    return;
  }
  const channel = client.channels.cache.get(channelId);
  if (!channel) {
    await wrapAsyncCallbackInRetry(async () => {
      interaction.reply({
        content: 'Invalid Channel ID. Please use the generate-embed-help command for help',
        ephemeral: true
      });
    }, 2);
    return;
  }
  const fields = interaction.fields.getTextInputValue('fieldsInput');
  if (areFieldsInvalid(fields)) {
    await wrapAsyncCallbackInRetry(async () => {
      interaction.reply({
        content: 'Invalid fields. Please use the generate-embed-help command for help',
        ephemeral: true
      });
    }, 2);
    return;
  }
  const actualFields = generateFields(fields);
  const title = interaction.fields.getTextInputValue('titleInput');
  const description = interaction.fields.getTextInputValue('descriptionInput');
  const imageLink = interaction.fields.getTextInputValue('imageLinkInput');
  const embedPostSuccess = await wrapAsyncCallbackInRetry(async () => {
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(title)
      .setTimestamp();
    if (description) {
      embed.setDescription(description);
    }
    actualFields.forEach(field => {
      embed.addFields(field);
    });
    if (imageLink) {
      embed.setImage(imageLink);
    }
    channel.send({embeds: [embed]});
  }, 2);
  if (embedPostSuccess) {
    await wrapAsyncCallbackInRetry(async () => {
      await interaction.reply({
        content: 'Embed posted Successfully!',
        ephemeral: true
      });
  }, 2);
  } else {
    await wrapAsyncCallbackInRetry(async () => {
      await interaction.reply({
        content: 'Oops something went wrong',
        ephemeral: true
      });
  }, 2);
  }
};

const areFieldsInvalid = (fields) => {
  if (!fields) {
    return false;
  }
  const fieldsArray = fields.split(';;');
  if (fieldsArray.length % 2 !== 0) {
    return true;
  }
  if (fieldsArray.length > 50) {
    return true;
  }
  return fieldsArray.some((field, index) => {
    if (index % 2 === 0) {
      return field.length > 256;
    }
    return field.length > 1024;
  })
};

const generateFields = (fields) => {
  if (!fields) {
    return [];
  }
  const fieldsToReturn = [];
  const fieldsArray = fields.split(';;');
  for(let i = 0; i <= fieldsArray.length - 2; i += 2) {
    fieldsToReturn.push({
      name: fieldsArray[i],
      value: fieldsArray[i+1]
    });
  }
  return fieldsToReturn;
}

module.exports = {
  handleShowGenerateEmbedModal,
  handleEmbedModalSubmit,
};