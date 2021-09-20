async function request(req, res, target) {
    let url, response;
    if(target==="meta") {
        url = "https://discord.com/api/v9/guilds/" + req.query.id;
        res.setHeader(
            "Cache-Control",
            "public, min-fresh=300, max-age=86400, stale-while-revalidate=600"
        )
        response = await fetch(
            url,
            {
                headers: {
                    "Authorization": "Bot " + process.env.BOT_TOKEN
                }
            }
        );
    }
    else {
        url = "https://api.yourapps.cyou/guilds/" + req.query.id;
        if(["positions", "applications"].includes(target)) {
            url += "/"+target
        }
        res.setHeader(
            "Cache-Control",
            "public, min-fresh=600, max-age=86400, stale-while-revalidate=3600"
        )
        response = await fetch(
            url,
            {
                headers: {
                    "Authorization": "Bearer " + process.env.YOURAPPS_API_TOKEN
                }
            }
        )
    }
    return await response.json()
}


export default async function Handler(req, res) {
    let data = {}
    for(let query_data of req.query.data.split(" ")) {
        try{data[query_data] = await request(req, res, query_data);}
        catch{}
    }

    res.status(200).json(data)
}