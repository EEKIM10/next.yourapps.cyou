export default async function Handler(req, res) {
    let url;
    if(req.query.data==="meta") {
        url = "https://discord.com/api/v9/guilds/" + req.query.id;
        res.setHeader(
            "Cache-Control",
            "public, min-fresh=300, max-age=86400, stale-while-revalidate=600"
        )
    }
    else {
        url = "https://api.yourapps.cyou/api/guilds/" + req.query.id;
        res.setHeader(
            "Cache-Control",
            "public, min-fresh=600, max-age=86400, stale-while-revalidate=3600"
        )
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