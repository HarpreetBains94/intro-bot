const { getModRoleId } = require("./serverConfigUtils");

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

const interactingUserHasApproverRole = (interaction) => {
  return interaction.member.roles.cache.has(getModRoleId(interaction.guildId));
};

module.exports = {
  wrapAsyncCallbackInRetry,
  interactingUserHasApproverRole
};