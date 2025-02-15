# intro-bot

### Prerequisites

You will require git* and node.js (v20+)

*(you can skip requiring git if you directly download the zip of the repo from github and skip the first step in the initial setup. Would not recommend this though as it will be harder to receive updates.)

You will also require [pm2 to be globally installed](https://pm2.keymetrics.io/docs/usage/quick-start/)

Make sure to have a discord developer account and a new bot (or app) registered
(https://discord.com/developers/docs/quick-start/getting-started). These are the Ids you will need to use for one of the steps below.

### Initial Setup

Clone the project using:

`git clone https://github.com/HarpreetBains94/intro-bot.git`

Move in to the repo and install the dependencies:

`cd ./intro-bot`

`npm install`

Next create a .env file in the project root and add your DISCORD_DEV_TOKEN and DISCORD_APP_ID to it. See the .env.example file if you run in to any syntax issues.

Finally add your server(s) details to serverConfigs.example.js and remove the '.example' from the filename. Be sure to remove the example server from the config as the data in that config will cause the bot to error out.

### Post Setup

After the install and initial setup is complete run the bot using:

`npm run start`

For any questions relating to stopping/starting/seeing logs for any bots running in pm2 refer to the [pm2 docs](https://pm2.keymetrics.io/docs/usage/process-management/)