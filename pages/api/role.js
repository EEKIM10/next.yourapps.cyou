const default_role = {
    id: "0",
    name: "unknown role",
    color: 0x0,
    hoist: false,
    position: 0,
    permissions: 0,
    managed: true,
    tags: {
        bot_id: "619328560141697036",
        integration_id: "619328560141697036",
        premium_subscriber: false
    }
}


export default async function Handler(req, res) {
    let url = "https://discord.com/api/v9/guilds/" + req.query.id + "/roles";
    const response = await fetch(
        url,
        {
            headers: {
                "Authorization": "Bot " + process.env.BOT_TOKEN
            }
        }
    );
    if(response.status!==200) {
        return res.status(response.status).send()
    };
    const data = await response.json()
    let resolved = {};
    for(let id of req.query.role_ids.split(",")) {
        for(let role_obj of data) {
            if(role_obj.id === id) {
                resolved[id] = role_obj
            }
        }
    }
    for(let id of req.query.role_ids.split(",")) {
        if(!resolved[id]) {
            resolved[id] = default_role
        }
    }
    return res.status(200).json(resolved);
}