const logger = require("../winstonLogger");
const db = require("../dbclient");

const send = async (req, res) => {
    try {
        const routeName = "/api/message";
        const { user } = req.session;
        const { message, toId } = req.body;

        if (!message || !toId) {
            logger.log(
                "error",
                routeName,
                "POST",
                400,
                `Invalid request. request=${JSON.stringify(req.body)}`,
                null
            );
            return res.status(400).send({
                error: "Invalid request",
                data: null,
            });
        }
        const r = await db.sendMessage(user.id, toId, message);
        logger.log(
            "info",
            routeName,
            "POST",
            201,
            `Message created. request=${JSON.stringify(req.body)}`,
            null
        );
        return res.status(201).send({
            error: null,
            data: r,
        });
    } catch (error) {
        console.log(error);
        logger.log(
            "error",
            routeName,
            "POST",
            500,
            `Error when creating message. request=${JSON.stringify(req.body)}`,
            error
        );
        return res.status(500).send({
            error: "Error when creating message",
            data: null,
        });
    }
};

module.exports = {
    send,
};
