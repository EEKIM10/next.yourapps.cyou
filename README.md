# next.yourapps.cyou
Portals:

* [Production site](https://next.yourapps.cyou/) ([mirror](https://next-yourapps-cyou-eeky.vercel.app/))
* [Beta testing](https://next-yourapps-cyou-git-beta-eeky.vercel.app/)

## Installing yourself
This is quite advanced, and isn't actually recommended.
If you just want to make some changes to regular pages, you only really need to clone and edit the .js files.

However, if you want to run your own instance, you'll need to `git clone` the repo, then create a `.env` file.
The .env file is where you can make or break the program, so be careful.

.env:

```shell
CLIENT_ID=integer  # client ID from https://discord.com/developers/applications
CLIENT_SECRET=str  # client secret from https://discord.com/developers/applications
BOT_TOKEN=str  # Bot token from https://discord.com/developers/applications
DEV=integer  # Default 1, controls the dev environment
YOURAPPS_API_TOKEN=str  # Token from https://api.yourapps.cyou/docs (requires consent from me)
```

Once you've done that, run `npm i`.

After installing dependencies, run `npm run dev`. This will start a
server [here](http://localhost:3000). From there, have fun!