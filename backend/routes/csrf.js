const express = require("express");
const router = express.Router();
const { getClient } = require("../db/connect.js");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const default_user = 1;
const default_attacker = 2;

router.get("/dangerous", async (req, res) => {
    const client = await getClient();

    //Check if session already has token
    let query = "SELECT token FROM session_token WHERE session LIKE $1";
    const session_token = await client.query(query, [req.sessionID]);

    if (session_token.rows.length !== 0) {
        //Token exists
        res.status(401).send("Session protected by token");
    } else {
        query =
            "update realestate set user_id = $1 where user_id = $2 and estate_id = (select estate_id from realestate where user_id = $2 limit 1)";
        await client.query(query, [default_attacker, default_user]);
        res.status(200).send("House transefred");
    }
});

router.get("/dangerous/:token", async (req, res) => {
    const client = await getClient();

    //Check if session already has token
    let query = "SELECT token FROM session_token WHERE session LIKE $1";
    const session_token = await client.query(query, [req.sessionID]);

    if (session_token.rows === 0) {
        res.status(500).send("Server error");
    }

    const token = session_token.rows[0].token;

    if (token === req.params.token) {
        query =
            "update realestate set user_id = $1 where user_id = $2 and estate_id = (select estate_id from realestate where user_id = $2 limit 1)";
        await client.query(query, [default_attacker, default_user]);
        res.status(200).send("House transefred");
    } else {
        res.status(401).send("Bad token");
    }
});

router.get("/reset-db", async (req, res) => {
    const client = await getClient();
    query =
        "update realestate set user_id = $1 where user_id = $2 and estate_id in (select estate_id from realestate where user_id = $2 limit (select count(*) - 1 from realestate where user_id = $2))";
    await client.query(query, [default_user, default_attacker]);
    res.status(200).send("Database updated");
});

router.post("/reset-token", async (req, res) => {
    const client = await getClient();
    console.log(req.sessionID);
    const query = "delete from session_token where session=$1";
    await client.query(query, [req.sessionID]);
    res.status(200).send("Reset token");
});

router.get("/messages", async (req, res) => {
    const attackMsg =
        '<img/ src="http://localhost:3000/csrf/dangerous"> Pokušaj napada izvršen';
    res.status(200).send(attackMsg);
});

router.get("/set-token", async (req, res) => {
    //CORS header
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT);

    const client = await getClient();

    //Check if session already has token
    let query = "SELECT token FROM session_token WHERE session LIKE $1";
    const session_token = await client.query(query, [req.sessionID]);

    if (session_token.rows.length !== 0) {
        //Token exists
        res.status(200).send(session_token.rows[0].token);
    } else {
        //New token
        const token = uuidv4();
        query = "insert into session_token(session, token) values($1, $2)";
        await client.query(query, [req.sessionID, token]);
        res.status(200).send(token);
    }
});

module.exports = router;
