require("dotenv").config();
if(process.env.VERCEL==="1") {
  process.env.DEV = "0";
}
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["api.yourapps.cyou", "cdn.discordapp.com", "discord.com"]
  }
}
