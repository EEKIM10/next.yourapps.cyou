import {db} from '../../utils/db.js';

export default async function handle(req, res) {
    if(!req.cookies.session) {
        res.status(401).json(
            {
                "detail": "No session cookie."
            }
        );
        return
    }
    const cookieData = await db.get(req.cookies.session);
    console.log("token:", cookieData)

    if(!cookieData) {
        res.status(401).json(
            {
                "detail": "expired cookie."
            }
        )
    }
    else {
        console.log("Fetching /@me")
        const response = await fetch(
            "https://discord.com/api/v9/users/@me",
            {
                headers: {
                    authorization: "Bearer " + cookieData
                }
            }
        )
        console.log("Done.")
        if(!response.ok) {
            console.error(`Failed to fetch me: got ${response.statusText}.`);
            res.status(response.status).json(await response.text());
            return;
        }
        const _data = await response.json();
        res.status(200)
            .setHeader(
                "Cache-Control",
                "public, min-fresh=300, max-age=86400, stale-while-revalidate=600"
            )
            .json(_data);
    }
}
