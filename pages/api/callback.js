import {select, insert_raw} from "../../utils/db";
import FormData from "form-data";

let cache = {};

const genToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default async function handle(req, res) {
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
    let token;
    // noinspection JSUnresolvedVariable
    try {
        if(!await select("SELECT key FROM tokens WHERE value=?;", [data.access_token])) {
            token = genToken();
            cache[token] = data.access_token
            try {await insert_raw("INSERT INTO tokens (key, value) VALUES (?, ?);", [token, data.access_token]);}
            catch {}
        }
        else {
            try {token = (await select("SELECT key FROM tokens WHERE value=?", [data.access_token])).key}
            catch {token = genToken()}
            cache[token] = data.access_token
        }
    }
    catch {
        cache[genToken()] = data.access_token
    }

    res.status(307).setHeader(
        "Set-Cookie",
        `session=${token}; Expires=${new Date(Date.now() + 806400*1000)}; Path=/`
    ).setHeader(
        "Location",
        "/"
    ).send()
}