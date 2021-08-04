let serverRolesCache = {};


export default async function Handler(req, res) {
    if(Object.keys(serverRolesCache).includes(req.query.id)) {
        res.status(304).json(serverRolesCache[req.query.id])
    }
    let url = "https://discord.com/api/v9/guilds/" + req.query.id + "/roles";
    const response = await fetch(
        url,
        {
            headers: {
                "Authorization": "Bot " + process.env.BOT_TOKEN
            }
        }
    );
    const data = await response.json()
    serverRolesCache[req.query.id] = data
    res.status(response.status).json(data)
}