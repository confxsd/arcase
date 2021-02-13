var express = require("express");
var router = express.Router();

const PORT = process.env.DBPROVIDER_PORT;
const db = require("../dbclient");

const logger = require("../winstonLogger");
const routeName = "/message";

router.post("/", async (req, res) => {
    try {
        const { fromId, toId, text } = req.body;
        if (!fromId || !toId || !text || fromId === toId) {
            logger.log(
                "error",
                routeName,
                "POST",
                400,
                `Invalid request. request=${JSON.stringify(req.body)}`,
                null
            );
            return res.status(400).send("Invalid request");
        }
        const timestamp = new Date().toISOString();
        const r = await db.createMessage(fromId, toId, text, timestamp);
        logger.log(
            "info",
            routeName,
            "POST",
            201,
            `Message created. request=${JSON.stringify(req.body)}`,
            null
        );
        res.status(201).send({
            err: null,
            data: r.insertedId
        });
    } catch (error) {
        logger.log(
            "error",
            routeName,
            "POST",
            500,
            `Error when adding message. request=${JSON.stringify(req.body)}`,
            error
        );
    }
});

router.get("/", async (req, res) => {
    try {
        const toId = req.query.toId;
        if (!toId) {
            logger.log(
                "error",
                routeName,
                "POST",
                400,
                `Invalid request. request=${JSON.stringify(req.body)}`,
                error
            );
            return res.status(400).send({
                error: "Invalid request",
                data: null,
            });
        }
        const messages = await db.getMessagesSentToUser(toId);
        res.status(200).send({
            err: null,
            data: messages
        });
    } catch (error) {
        logger.log(
            "error",
            routeName,
            "POST",
            500,
            `Messages couldn't get. request=${JSON.stringify(req.body)}`,
            error
        );
        res.status(500).send({
            error: "Error when getting messages.",
            data: null,
        });
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
