// For this to work remove the '.example' from the file name
// and fill in the server details below (multiple servers can be added):

module.exports = {
  servers: [
    {
      id: '', // Server Id
      name: '', // Server Name
      startChannelId: '', // Start channel (this is where the user generates intros)
      introChannelId: '', // Intro channel (this is where the generated intros will go)
      logChannelId: '', // Log channel (this is where mods will be able to approve/reject intros)
      modRoleId: '',  // Id of the role you want to be able to approve/reject intros (usually mods)
      approvedRoleId: '', // Id of the role you want to give users once their intro is approved
      introMessage: '', // Message for the sticky bot to send with the begin intro message
      rejectRoleId: '', // Id of the role you want to purge when using the purge command
      rejectTime: 72, // How long (in hours) a user has to get rid of the reject role before the purge reject script effects them
    }
  ]
}