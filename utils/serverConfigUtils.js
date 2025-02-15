const { z } = require("zod");
const { servers } = require('../serverConfigs');

const getServerForId = (id) => {
  const maybeServer = servers.find(server => server.id === id);
  if (!maybeServer) {
    throw new Error('Server not found');
  }
  return maybeServer;
};

const getIntroChannelId = (id) => {
  const server = getServerForId(id);
  return server.introChannelId;
};

const getIntroLogChannelId = (id) => {
  const server = getServerForId(id);
  return server.introLogChannelId;
};

const getServerLogChannelId = (id) => {
  const server = getServerForId(id);
  return server.serverLogChannelId;
};

const getModRoleId = (id) => {
  const server = getServerForId(id);
  return server.modRoleId;
};

const getApprovedRoleId = (id) => {
  const server = getServerForId(id);
  return server.approvedRoleId;
};

const getRejectRoleId = (id) => {
  const server = getServerForId(id);
  return server.rejectRoleId;
};

const getVerifiedRoleId = (id) => {
  const server = getServerForId(id);
  return server.verifiedRoleId;
};

const getServerName = (id) => {
  const server = getServerForId(id);
  return server.name;
};

const getServerRejectTime = (id) => {
  const server = getServerForId(id);
  return server.rejectTime;
};

const getServerHideIntroApproveFlow = (id) => {
  const server = getServerForId(id);
  return server.hideIntroApproveFlow;
};

const getStickies = (id) => {
  const server = getServerForId(id);
  return server.stickies;
};

const getIntroQuestions = (id) => {
  const server = getServerForId(id);
  return server.introQuestions;
};

const getIntroSentencesGroups = (id) => {
  const server = getServerForId(id);
  return server.introSentenceGroups;
};

const getMinimumAge = (id) => {
  const server = getServerForId(id);
  return server.minimumAge;
};

const getIntroModalTitle = (id) => {
  const server = getServerForId(id);
  return server.introModalTitle;
};

const getNewIntroSeparator = (id) => {
  const server = getServerForId(id);
  return server.newIntroSeparator;
};

const validateServerConfigs = () => {
  const zodConfig = getZodServerSchema();
  servers.forEach((server) => {
    zodConfig.parse(server);
  });
};

const getZodServerSchema = () => {
  return z.object({
    id: z.string(),
    name: z.string(),
    introChannelId: z.string(),
    introLogChannelId: z.string(),
    serverLogChannelId: z.string(),
    modRoleId: z.string(),
    approvedRoleId: z.string(),
    rejectRoleId: z.string(),
    rejectTime: z.number().int(),
    hideIntroApproveFlow: z.boolean(),
    verifiedRoleId: z.string(),
    minimumAge: z.number().int(),
    introModalTitle: z.string(),
    newIntroSeparator: z.string(),
    introQuestions: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        minLength: z.number().int(),
        maxLength: z.number().int(),
        placeHolder: z.string(),
        isAgeInput: z.boolean(),
        isLongInput: z.boolean(),
      })
    ),
    introSentenceGroups: z.array(z.array(z.object({
      value: z.string(),
      chance: z.number().int()
    }))),
    stickies: z.array(z.object({
      channelId: z.string(),
      stickyTitle: z.string(),
      stickyMessage: z.string(),
      isBeginIntroSticky: z.boolean(),
    }))
  });
};

const getServers = () => {
  return servers;
};

module.exports = {
  getIntroChannelId,
  getIntroLogChannelId,
  getServerLogChannelId,
  getModRoleId,
  getApprovedRoleId,
  getRejectRoleId,
  getVerifiedRoleId,
  getServerName,
  getServers,
  getServerRejectTime,
  getServerHideIntroApproveFlow,
  getStickies,
  getIntroQuestions,
  getIntroSentencesGroups,
  getMinimumAge,
  getIntroModalTitle,
  getNewIntroSeparator,
  validateServerConfigs
};