console.log("loading .env")
require("dotenv").config()
console.log("loaded .env")
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["api.yourapps.cyou", "cdn.discordapp.com", "discord.com"]
  }
}
