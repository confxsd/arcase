var express = require("express");
var router = express.Router();

const PORT = process.env.DBPROVIDER_PORT;
const db = require("../dbclient");

const logger = require("../winstonLogger");
const routeName = "/message";

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
                null
            );
            return res.status(400).send({
                error: "Invalid request, provide toId query",
                data: null,
            });
        }
        const messages = await db.getMessagesSentToUser(toId);
        res.status(200).send({
            err: null,
            data: messages,
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
        res.status(500).send("Error when getting messages.");
    }
});

module.exports = router;
