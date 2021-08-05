export default async function Handler(req, res) {
    let url;
    if(req.query.data==="meta") {
        url = "https://discord.com/api/v9/guilds/" + req.query.id;
    }
    else {
        url = "https://api.yourapps.cyou/api/guilds/" + req.query.id
    }
    const response = await fetch(
        url,
        {
            headers: {
                "Authorization": "Bot " + process.env.BOT_TOKEN
            }
        }
    );
    res.status(response.status).json(await response.json())
}