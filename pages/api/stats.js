export default async function handler (req, res) {
    console.log(req.cookies)
    let request = await fetch("https://api.yourapps.cyou/api/bot/stats");
    res.status(request.status).json(await request.json())
}