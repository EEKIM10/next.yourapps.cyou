import {db} from "../../utils/db";
import FormData from "form-data";

const genToken = () => {
    return (Math.random()*10000).toString(16)
}

export default async function handle(req, res) {
    if(process.env.VERCEL==="1" && ["preview", "development"].includes(process.env.VERCEL_ENV)) {
        res.status(421).send("Preview builds are unable to use oauth.");
        return;
    }
    const code = req.query.code;
    if(!code) {
        res.status(307).setHeader("Location", "/api/login").send();
        return
    }
    // construct body
    let formData = new FormData();
    formData.append("client_id", process.env.CLIENT_ID);
    formData.append("client_secret", process.env.CLIENT_SECRET);
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    if(process.env.DEV === "0") {
        formData.append("redirect_uri", "https://next.yourapps.cyou/api/callback");
    }
    else {
        formData.append("redirect_uri", "http://localhost:3000/api/callback");
    }


    const response = await fetch(
        "https://discord.com/api/oauth2/token",
    {
            method: "POST",
            body: formData,
        }
    );
    if(!response.ok) {
        res.status(response.status).json(await response.json());
        return
    }
    const data = await response.json();
    const token = (Math.random()*100000).toString(16)
    await db.set(token, data.access_token, 86400*1000)

    res.status(307).setHeader(
        "Set-Cookie",
        `session=${token}; Expires=${new Date(Date.now() + 806400*1000)}; Path=/`
    ).setHeader(
        "Location",
        "/"
    ).send()
}