// For this to work remove the '.example' from the file name
// and fill in the server details below (multiple servers can be added):

module.exports = {
  servers: [
    // All values shown in this below example are NOT default values. Be sure to define each property.
    {
      /*
      id: string
      description: The id of the server.
      */
      id: '',
      /*
      name: string
      description: The name of the server (this is what will replace _SERVER_NAME in the intro message).
      */
      name: '',
      /*
      introChannelId: string
      description: The id of the channel where the generated intros will be sent (make sure the bot has read/write/edit perms for this channel).
      */
      introChannelId: '',
      /*
      introLogChannelId: string
      description: The id of the channel where the logs for intros will be sent (make sure the bot has read/write/edit perms for this channel).
        The logs contain the user who made the intro, a link to the intro, and buttons for approving/kicking/banning a user or rejecting an intro.
        Once a mod has clicked one of the buttons the log will be updated to include the mod and the action they took.
      */
      introLogChannelId: '',
      /*
      serverLogChannelId: string
      description: The id of the channel where general server logs will be sent (make sure the bot has read/write perms for this channel).
        Currently this is just used for the safe media deletion command (delete-ticket-attachment) which was added since dyno was only logging
        the first image of a deleted message and we were running in to situations where we needed to make sure all images on a deleted message were logged.
      */
      serverLogChannelId: '',
      /*
      modRoleId: string
      description: Id of the role you want to be able to approve/reject intros (usually mods)
      */
      modRoleId: '',
      /*
      approvedRoleId: string
      description: Id of the role you want to give users once their intro is approved.
        The flow this bot was built in mind with was having new users only able to see the basic channels, with all the proper server channels hidden behind
        an 'approved' role. This way when an intro is approved, the new user is automatically given the approved role and is able to access the rest of the server.
      */
      approvedRoleId: '',
      /*
      rejectRoleId: string
      description: Id of the role you want to purge when using the purge command.
        Any users with this role and that have been in the server for longer than the rejectTime (see below) will kicked from the server when running the /purge-rejects command.
      */
      rejectRoleId: '',
      /*
      rejectTime: integer
      description: How long (in hours) has to be in the server before the purge command (/purge-rejects) will effect them.
      */
      rejectTime: 72,
      /*
      hideIntroApproveFlow: boolean
      description: Hide the approve and reject buttons on intro log.
        This is useful for servers that don't want approval tied to intros, but still want to allow their users to generate intros. (e.g. using the manual /approve-user command upon ID verification)
      */
      hideIntroApproveFlow: false,
      /*
      verifiedRoleId: string
      description: Id of an extra verified role separate from approveRoleId.
        Used when calling /verify-user. Useful if your server has a section that requires manual verification (e.g. a nsfw section etc)
      */
      verifiedRoleId: '',
      /*
      minimumAge: integer
      description: Minium age required for server entry.
        If any questions in the intro modal are flagged as age questions, this value will be compared against it to confirm the age input by the user is above this age.
        If the user is found to be underage the intro log will flag this to the mods.
      */
      minimumAge: 18,
      /*
      introModalTitle: string
      description: The title on top of the intro generation modal
      */
      introModalTitle: '',
      /*
      newIntroSeparator: string
      description: This is a separator added between intros since if multiple intros are generated at roughly the same time it can be difficult to differentiate them.
      */
      newIntroSeparator: '',
      /*
      introQuestions: array
      description: An array containing the config for the questions to be asked in the intro generation modal.
        Note that discord modals only allow for 5 questions. If more than 5 question configs are defined below, discord will error out when trying to generate the intro generation modal.
      */
      introQuestions: [
        {
          /*
          id: string
          description: The id used by discord to allow the bot to retrieve answers for given questions.
            This id is also used in the sentences config (see below) to let the bot know where to insert the users answers in the pre-defined sentences.
          */
          id: '',
          /*
          id: string
          description: The question being asked.
            This has a max of 45 characters otherwise discord will return an error when generating the intro generation modal.
          */
          label: '?',
          /*
          id: integer
          description: Minimum length of the users answer.
            Make sure this is smaller than the maxLength (see below) or discord will probably error out making the modal.
          */
          minLength: 1,
          /*
          id: integer
          description: Maximum length of the users answer.
            Make sure this is larger than the minLength (see above) or discord will probably error out making the modal.
          */
          maxLength: 2,
          /*
          id: string
          description: Placeholder text show in the input before the user starts typing in it.
            This has a max of 100 characters otherwise discord will return an error when generating the intro generation modal.
          */
          placeHolder: '',
          /*
          id: boolean
          description: Flag for if this input is for the users age.
            If this flag is true, the value a user inputs for this question will be compared with the minimumAge field defined above.
            If multiple questions have this flag set to true, only the first question will be compared with the minimumAge.
          */
          isAgeInput: true,
          /*
          id: boolean
          description: Flag if this input should be a short 1 line text input or a multi-line paragraph input.
            Questions like names etc.. should set this as false.
            Questions relating to hobbies or something that expects a longer answer should set this as true.
          */
          isLongInput: false,
        }
      ],
      /*
      introSentenceGroups: nested array 1 level deep
      description: An array containing groups of sentences. The internal arrays contain sentences of which one will be selected per array.
        i.e. [[A, B, C, D], [E, F], [G, H, I]] will produce a final intro that looks like A F I or C E H etc..
      */
      introSentenceGroups: [
        [
          {
            /*
            value: string
            description: The sentence you want to potentially include in the intro.
              Adding the id for any of the questionConfigs in the introQuestions above will result in the bot replacing the id with the answer supplied by the user.
              _USER will result in the bot replacing this text with the user (this will @ them).
              _SERVER_NAME will result in the bot replacing this text with the server name as defined above.
              Its probably good practice to indicate in some fashion when the text is generated by the bot and what is an input from the user. This can be achieved
              by bolding/italicizing the users inputs (i.e. wrapping them in **id** or something)
            */
            value: '',
            /*
            chance: integer
            description: This is the change that a given sentence will show up.
              This chance is relative to the chances of the other sentences within its group as its probability of being selected will be
              its chance divided by the sum of all chances within the group.
              e.g. if there are 2 sentences [A B] where A has a chance of 5 while B has a chance of 1, A will have a 5/6 chance of being selected while B has a 1/6 chance.
            */
            chance: 20
          }
        ]
      ],
      /*
      stickies: array
      description: An array containing sticky message configs.
      */
      stickies: [
        {
          /*
          channelId: string
          description: The id of the channel you wish to send the sticky in (make sure the bot has read/write/edit perms for this channel).
          */
          channelId: '',
          /*
          stickyTitle: string
          description: Title of the sticky embed.
          */
          stickyTitle: '',
          /*
          stickyMessage: string
          description: The message displayed inside the sticky embed.
          */
          stickyMessage: '',
          /*
          isBeginIntroSticky: boolean
          description: If this is true it will add the "begin intro" button to the sticky.
          */
          isBeginIntroSticky: true
        }
      ]
    },
    // Below is an example config from an existing server with the ids removed
    {
      id: '',
      name: 'Example Server',
      introChannelId:    '',
      introLogChannelId: '',
      serverLogChannelId: '',
      modRoleId: '',
      approvedRoleId: '',
      rejectRoleId: '',
      rejectTime: 72,
      hideIntroApproveFlow: false,
      verifiedRoleId: '',
      minimumAge: 18,
      introModalTitle: 'Tell Us About Yourself',
      newIntroSeparator: '++++++++++++++++++++++++++',
      introQuestions: [
        {
          id: 'ANS_1',
          label: 'How old are you?',
          minLength: 1,
          maxLength: 2,
          placeHolder: 'Enter a number!',
          isAgeInput: true,
          isLongInput: false,
        },
        {
          id: 'ANS_2',
          label: 'What would you prefer we call you?',
          minLength: 1,
          maxLength: 25,
          placeHolder: 'Enter some text!',
          isAgeInput: false,
          isLongInput: false,
        },
        {
          id: 'ANS_3',
          label: 'What are your preferred pronouns?',
          minLength: 1,
          maxLength: 25,
          placeHolder: 'Enter some text!',
          isAgeInput: false,
          isLongInput: false,
        },
        {
          id: 'ANS_4',
          label: 'Where are you from?',
          minLength: 1,
          maxLength: 25,
          placeHolder: 'Enter some text!',
          isAgeInput: false,
          isLongInput: false,
        },
        {
          id: 'ANS_5',
          label: 'What are your hobbies/interests?',
          minLength: 20,
          maxLength: 200,
          placeHolder: 'Enter some text!',
          isAgeInput: false,
          isLongInput: true,
        },
      ],
      introSentenceGroups: [
        [
          {
            value: 'Everyone join me in welcoming **_USER** (A.K.A. **ANS_2**) to _SERVER_NAME!!',
            chance: 3
          },
          {
            value: 'Hey everyone! **_USER** (A.K.A. **ANS_2**) wanted me to tell you that they\'re here to chew ass and kick bubble gum, and they\'re all out of bubble gum.',
            chance: 1
          },
        ],
        [
          {
            value: '**ANS_2** is **ANS_1** years old and is from **ANS_4**.',
            chance: 5
          },
          {
            value: 'Contrary to popular belief, **ANS_2** is actually **ANS_1** years old! The air quality in **ANS_4** must be great for them to look so good.',
            chance: 1
          },
        ],
        [
          {
            value: 'Their pronouns are **ANS_3**',
            chance: 1
          },
        ],
        [
          {
            value: '**ANS_2**s hobbies and interests include: **ANS_5**.',
            chance: 10
          },
          {
            value: 'When they\'re not rescuing animals from factory farms, **ANS_2**s hobbies and interests include: **ANS_5**.',
            chance: 1
          },
        ]
      ],
      stickies: [
        {
          channelId: '',
          stickyTitle: 'How to Gain Entry to the Server',
          stickyMessage: 'To get started in this server first you\'ll need to generate an intro. Click the **Begin Intro** button below.\n\nOnce you\'ve made your intro please wait for a staff member to review and grant you access.',
          isBeginIntroSticky: true,
        },
        {
          channelId: '',
          stickyTitle: 'Here are the server rules',
          stickyMessage: '1st rule: dont talk about this server\n2nd rule: dont talk about this server\n3rd rule: have fun :3\n4th rule: DONT TALK ABOUT THIS SERVER',
          isBeginIntroSticky: false,
        },
      ],
    },
  ]
}