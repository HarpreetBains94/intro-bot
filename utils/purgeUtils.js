const { getRejectRoleId, getModRoleId, getServerRejectTime } = require('./serverConfigUtils');
const { wrapAsyncCallbackInRetry } = require('./utils');

const MILLISECONDS_IN_AN_HOUR = 3600000;

const interactingUserHasApproverRole = (interaction) => {
  return interaction.member.roles.cache.has(getModRoleId(interaction.guildId));
};

const getGuild = async (interaction, client) => {
  const maybeGuild = await client.guilds.fetch(interaction.guildId)
  if (!maybeGuild) {
    throw new Error('Guild not found');
  }
  return maybeGuild;
};

const doPrune = async (interaction, client) => {
  const rejectTime = getServerRejectTime(interaction.guildId);
  await wrapAsyncCallbackInRetry(async () => {
    if (!interactingUserHasApproverRole(interaction)) {
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
        member.kick();
      }
    });
    await interaction.reply({
      content: `Purged the following members: ${members}`,
      ephemeral: true,
    })
  }, 2);
};

module.exports = {
  doPrune
};