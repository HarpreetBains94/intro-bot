const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { wrapAsyncCallbackInRetry, interactingUserHasModRole } = require('./utils');
const { getIntroChannelId, getStartChannelId, getApprovedRoleId, getModRoleId, getServerName, getRejectRoleId, getServerHideIntroApproveFlow, getVerifiedRoleId } = require('./serverConfigUtils');
const { PermissionsBitField } = require('discord.js');

const inviteUserToChannel = async (interaction, client) => {
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
    const user = interaction.options.getUser('user');
    const member = interaction.member.guild.members.cache.get(user.id);
    const channel = interaction.channel;
    const canBotEditChannel = interaction.guild.members.me.permissionsIn(channel).has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageChannels]);
    if (!member || !canBotEditChannel) {
      await wrapAsyncCallbackInRetry(async () => {
        await interaction.reply({
          content: 'Interaction failed, please manually give the user permissions to view this channel.'
        });
      }, 2);
      return;
    }
    await channel.permissionOverwrites.create(member, {
      ViewChannel: true
    }).then(async(channel) => {
      await wrapAsyncCallbackInRetry(async () => {
        await interaction.reply({
          content: `Interaction succeeded. ${member.user.username} should be able to view this channel now.`,
          ephemeral: true
        });
      }, 2);
      return;
    }).catch(async (error) => {
      await wrapAsyncCallbackInRetry(async () => {
        await interaction.reply({
          content: 'Interaction failed. Please manually give the user permissions to view this channel.',
          ephemeral: true
        });
      }, 2);
      return;
    });
  }, 2);
};

module.exports = {
  inviteUserToChannel,
};