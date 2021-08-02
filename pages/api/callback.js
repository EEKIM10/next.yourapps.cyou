import {select, insert_raw} from "../../utils/db";
import FormData from "form-data";

export default async (req, res) => {
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
    // formData.append("redirect_uri", "https://next.yourapps.cyou/api/callback");
    formData.append("redirect_uri", "http://localhost:3000/api/callback");

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
    let token;
    // noinspection JSUnresolvedVariable
    if(!await select("SELECT key FROM tokens WHERE value=?;", [data.access_token])) {
        token = Math.random().toString(16).replace(/[^a-z]+/g, '').substr(2,14)
        console.log("Token: %c" + token, "font-weight: 900");
        console.log("Access: %c" + data.access_token, "font-weight: 900")
        await insert_raw("INSERT INTO tokens (key, value) VALUES (:token, :access);", {token: token, access: data.access_token});
    }
    else {
        token = (await select("SELECT key FROM tokens WHERE value=?", [data.access_token]))
    }
    res.status(307).setHeader(
        "Set-Cookie",
        `session=${token}; Expires=${new Date(Date.now() + 806400*1000)}; Path=/`
    ).setHeader(
        "Location",
        "/"
    ).send()
}