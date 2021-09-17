// noinspection EqualityComparisonWithCoercionJS

let uri = "https://discord.com/api/oauth2/authorize?client_id=619328560141697036&redirect_uri=https%3A%2F%2Fnext." +
          "yourapps.cyou%2Fapi%2Fcallback&response_type=code&scope=identify%20guilds"
if(process.env.DEV==="1") {
    uri = "https://discord.com/api/oauth2/authorize?client_id=619328560141697036&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fcallback&response_type=code&scope=identify%20guilds"
}

// console.log("Redirect URI: %c"+uri, "color:cyan;font-weight:900")
export default function handle(req, res) {res.status(307).setHeader("Location", uri).send()}