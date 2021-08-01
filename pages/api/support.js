export default async function handle(req, res) {
    const response = await fetch(
        "https://discord.com/api/guilds/706271127542038608/widget.json"
    );
    const data = await response.json()
    data.instant_invite = data.instant_invite || "https://yourapps.cyou/support";
    res.status(307).setHeader("Location", data.instant_invite).json(data.instant_invite);
}