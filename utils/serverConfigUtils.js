const { servers } = require('../serverConfigs');

const getServerForId = (id) => {
  const maybeServer = servers.find(server => server.id === id);
  if (!maybeServer) {
    throw new Error('Server not found');
  }
  return maybeServer;
};

const getStartChannelId = (id) => {
  const server = getServerForId(id);
  return server.startChannelId;
};

const getIntroChannelId = (id) => {
  const server = getServerForId(id);
  return server.introChannelId;
};

const getLogChannelId = (id) => {
  const server = getServerForId(id);
  return server.logChannelId;
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

const getServers = () => {
  return servers;
};

module.exports = {
  getStartChannelId,
  getIntroChannelId,
  getLogChannelId,
  getModRoleId,
  getApprovedRoleId,
  getRejectRoleId,
  getVerifiedRoleId,
  getServerName,
  getServers,
  getServerRejectTime,
  getServerHideIntroApproveFlow,
  getStickies,
};