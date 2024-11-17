const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { wrapAsyncCallbackInRetry } = require('./utils');

const shouldResendSticky = (lastChannelMessage, client) => {
  if (!lastChannelMessage) {
    return true; 
  } else {
      if (lastChannelMessage.author.id !== client.user.id) {
        return true;
      } else {
        return lastChannelMessage.embeds.length > 0 ? false : true;
      }
  }
};

const doStickyStuff = async (channel, introTitle, introMessage, isBeginIntroSticky, client) => {
  var lastChannelMessage = null;
  await wrapAsyncCallbackInRetry(async () => {
    await channel.messages.fetch({ limit: 1 }).then(messages => {
      lastChannelMessage = messages.first();
    });
    if (shouldResendSticky(lastChannelMessage, client)) {
      const otherMessagesFromBot = [];
      await channel.messages.fetch({ limit: 99 }).then(messages => {
        messages.forEach(message => {
          if ((message.author.id === client.user.id) && (message.embeds.length > 0)) {
            otherMessagesFromBot.push(message);
          }
        })
      });
      await channel.bulkDelete(otherMessagesFromBot);

      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(introTitle)
        .setDescription(introMessage)
        .setTimestamp();

      if (isBeginIntroSticky) {
        const intro = new ButtonBuilder()
        .setCustomId('intro')
        .setLabel('Begin Intro')
        .setStyle(ButtonStyle.Primary);
    
        const row = new ActionRowBuilder()
          .addComponents(intro);

        channel.send({
          embeds: [embed],
          components: [row]});
      } else {
        channel.send({ embeds: [embed] });
      }
    }
  }, 2);
};

module.exports = {
  doStickyStuff
};