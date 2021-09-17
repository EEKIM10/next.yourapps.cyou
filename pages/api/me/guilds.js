import {db} from "../../../utils/db";


export default async function handle(req, res) {
    if(!req.cookies.session) {
        res.status(401).json(
            {
                "detail": "No session cookie."
            }
        );
        return
    }
    const cookieData = await db.get(req.cookies.session)

    if(!cookieData) {
        res.status(401).json(
            {
                "detail": "expired cookie."
            }
        )
    }
    else {
        const response = await fetch(
            "https://discord.com/api/v9/users/@me/guilds",
            {
                headers: {
                    authorization: "Bearer " + cookieData
                }
            }
        )
        if(!response.ok) {
            console.error(`Failed to fetch guilds: got ${response.statusText}.`);
            res.status(response.status).json((await response.text()).toString());
            return;
        }
        const _data = await response.json();
        res.status(200).json(_data);
    }
}
