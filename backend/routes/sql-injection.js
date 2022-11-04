const express = require("express");
const router = express.Router();
const { getClient } = require("../db/connect.js");

router.get("/wrong/:type", async (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT);
    const client = await getClient();
    const query = `SELECT * FROM realestate WHERE user_id = 1 and estate_type = '${req.params.type}'`;

    try {
        const result = await client.query(query);
        res.status(200).send(result.rows);
        return;
    } catch (e) {
        console.log(e);
    }

    res.status(500).send("Server error");
});

router.get("/correct/:type", async (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT);
    const client = await getClient();

    //User is always user 1
    let id = 1;

    let type = req.params.type;
    type = type.replace(/"/g, "");
    type = type.replace(/'/g, "''");

    const query =
        "SELECT * FROM realestate WHERE user_id = $1 and estate_type = $2";

    try {
        const result = await client.query(query, [id, type]);
        res.status(200).send(result.rows);
        return;
    } catch (e) {
        console.log(e);
    }

    res.status(500).send("Server error");
});

module.exports = router;
