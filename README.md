# intro-bot

### Prerequisites

You will require git and node.js (v20+)

You will also require [pm2 to be globally installed](https://pm2.keymetrics.io/docs/usage/quick-start/)

### Initial Setup

Clone the project using:

`git clone https://github.com/HarpreetBains94/intro-bot.git`

Move in to the repo and install the dependencies:

`cd ./intro-bot`

`npm install`

Next create a .env file in the project root and add your DISCORD_DEV_TOKEN and DISCORD_APP_ID to it.

Finally add your server(s) details to serverConfigs.example.js and remove the '.example' from the filename.

### Post Setup

After the install is complete run the bot using:

`npm run start`