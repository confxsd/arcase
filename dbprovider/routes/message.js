var express = require("express");
var router = express.Router();

const PORT = process.env.DBPROVIDER_PORT;
const db = require("../dbclient");

router.post("/", async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send("Invalid body");
        }
        const { fromId, toId, text } = req.body;
        if (fromId === toId) {
            return res.status(400).send("Invalid request");
        }
        const timestamp = new Date().toISOString();
        const r = await db.createMessage(fromId, toId, text, timestamp);

        res.status(201).send(r);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error when adding message");
    }
});

router.get("/", async (req, res) => {
    try {
        const toId = req.query.toId;
        if (!toId) {
            return res.status(400).send("toId should be provided");
        }
        const messages = await db.getMessagesSentToUser(toId);
        res.status(200).send(messages);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error when getting messages.");
    }
});

router.get("/all", async (req, res) => {
    try {
        const messages = await db.getAllMessages();
        res.status(200).send(messages);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error when getting messages.");
    }
});

module.exports = router;
