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
    res.status(response.status).json(await response.json())
}