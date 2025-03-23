const { getRejectRoleId, getModRoleId, getServerRejectTime, getIntroLogChannelId } = require('./serverConfigUtils');
const { wrapAsyncCallbackInRetry, interactingUserHasModRole } = require('./utils');
const { PermissionsBitField } = require('discord.js');

const MILLISECONDS_IN_AN_HOUR = 3600000;

const getGuild = async (interaction, client) => {
  const maybeGuild = await client.guilds.fetch(interaction.guildId)
  if (!maybeGuild) {
    throw new Error('Guild not found');
  }
  return maybeGuild;
};

const doPrune = async (interaction, client, isTest) => {
  const rejectTime = getServerRejectTime(interaction.guildId);
  await wrapAsyncCallbackInRetry(async () => {
    if (!interactingUserHasModRole(interaction)) {
      await interaction.reply({
        content: 'You do not have permissions to use this command.',
        ephemeral: true,
      });
      return;
    }
    const rejectRole = getRejectRoleId(interaction.guildId);
    const guild = await getGuild(interaction, client);
    await guild.members.fetch();
    const rolesManager = guild.roles.cache.get(rejectRole);
    if (!rolesManager) {
      await interaction.reply({
        content: 'Something went wrong',
        ephemeral: true,
      });
      return;
    }
    let members = [];
    rolesManager.members.forEach(member => {
      if (((new Date().getTime() - member.joinedTimestamp) / MILLISECONDS_IN_AN_HOUR) > rejectTime) {
        members.push(member);
      }
    });
    if (!isTest) {
      removeTicketChannels(interaction, client, members);
      members.forEach(member => {
        member.kick();
      })
    }
    if (isTest) {
      await interaction.reply({
        content: `The following members would be purged if the command was run: ${members}`,
        ephemeral: true,
      });
    } else {
      await client.channels.cache.get(getIntroLogChannelId(interaction.guildId)).send({
        content: `${interaction.user} purged the following members: ${members}`,
      });
      await interaction.reply({
        content: `Members purged, check the logs channel to see more information`,
        ephemeral: true,
      });
    }
  }, 2);
};

// This relies on the fact that ticket channels from the ticket tool
// are private and have the member who created the ticket as a manual override
// so they can view it. So passing in a list of all the members that are about
// to be kicked and checking if they can view a ticket channel can be used to
// delete their verification tickets
const removeTicketChannels = async(interaction, client, members) => {
  const channels = [];
  const channelsToDelete = [];
  client.channels.cache.filter(channel => channel.guildId == interaction.guildId && channel.name.startsWith('ticket')).each(channel => channels.push(channel));
  members.forEach(member => {
    channels.forEach(channel => {
      if (member.permissionsIn(channel).has([PermissionsBitField.Flags.ViewChannel])) {
        channelsToDelete.push(channel);
      }
    });
  });
  channelsToDelete.forEach((channel => {
    if (interaction.guild.members.me.permissionsIn(channel).has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageChannels])) {
      channel.delete();
    }
  }));
};

module.exports = {
  doPrune
};