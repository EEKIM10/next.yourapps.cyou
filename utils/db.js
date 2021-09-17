const KeyV = require("keyv");
let db;

if(process.env.VERCEL==="1") {
    db = new KeyV();
}
else {
    db = new KeyV("sqlite://keyv.db")
}

export {db};
