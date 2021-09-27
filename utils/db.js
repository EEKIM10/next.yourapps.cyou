const KeyV = require("keyv");
let db;

if(process.env.VERCEL==="1") {
    console.debug("Running on vercel - using memory cache or database.")
    db = new KeyV();
}
else {
    const uri = process.env.DB_URI || "sqlite://keyv.db";
    console.debug("Running on a local machine - connecting to " + uri)
    db = new KeyV(uri);
};

export {db};
