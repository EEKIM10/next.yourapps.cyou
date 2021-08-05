export default async function Handler(req, res) {
    let url = "https://discord.com/api/v9/channels/" + req.query.id;
    const response = await fetch(
        url,
        {
            headers: {
                "Authorization": "Bot " + process.env.BOT_TOKEN
            }
        }
    );
    res.status(response.status)
        .setHeader(
            "Cache-Control",
            "public, min-fresh=300, max-age=86400, stale-while-revalidate=600"
        )
        .json(await response.json())
}