var express = require("express");
var router = express.Router();

const PORT = process.env.DBPROVIDER_PORT;
const db = require("../dbclient");

const logger = require("../winstonLogger");
const routeName = "/user";
const util = require("../util");

router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            logger.log(
                "error",
                routeName,
                "POST",
                400,
                `Invalid body: request=${JSON.stringify(req.body)}`,
                null
            );
            return res.status(400).send({
                error: "invalid body",
                data: null,
            });
        }

        const r = await db.addUser(req.body);
        logger.log(
            "info",
            routeName,
            "POST",
            201,
            `User created: ${username}`,
            null
        );
        return res.status(201).send({
            error: null,
            data: r,
        });
    } catch (error) {
        logger.log(
            "error",
            routeName,
            "POST",
            500,
            `Error when adding user: request=${JSON.stringify(req.body)}`,
            error
        );
        res.status(500).send({
            error: "Error when adding user",
            data: null,
        });
    }
});

router.get("/all", async (req, res) => {
    try {
        const users = await db.getUsers();
        return res.status(200).send({
            error: null,
            data: users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error when getting users.");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            logger.log(
                "error",
                `${routeName}/${id}`,
                "GET",
                400,
                `Bad request. request=${JSON.stringify(req.body)}.`,
                null
            );
            return res.status(400).send({
                error: "Bad request",
                data: null,
            });
        }
        const user = await db.getUserById(id);
        console.log("DEBUG", user);
        if (!user) {
            logger.log(
                "error",
                `${routeName}/${id}`,
                "GET",
                404,
                `No user found. userId=${id}.`,
                null
            );
            return res.status(404).send({
                error: "No user found",
                data: null,
            });
        }

        return res.status(200).send({
            error: null,
            data: user,
        });
    } catch (error) {
        logger.log(
            "error",
            `${routeName}/${id}`,
            "GET",
            500,
            `Error when getting user. userId=${userId}.`,
            error
        );
        return res.status(500).send({
            error: "Error when getting user",
            data: null,
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            logger.log(
                "error",
                routeName,
                "GET",
                400,
                `Bad request. request=${JSON.stringify(req.body)}`,
                ""
            );
            return res.status(400).send({
                error: "Invalid credentials",
                data: null,
            });
        }
        const user = await db.getUserByUsername(username);
        return res.status(200).send({
            error: null,
            data: user,
        });
    } catch (error) {
        logger.log(
            "error",
            `${routeName}/${id}`,
            "GET",
            500,
            `Error when getting user. userId=${userId}.`,
            error
        );
        return res.status(500).send({
            error: "Error when getting user",
            data: null,
        });
    }
});

router.put("/:id/block", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            logger.log(
                "error",
                `${routeName}/:id/block`,
                "PUT",
                400,
                `Bad request. request=${JSON.stringify(req.body)}.`,
                null
            );
            return res.status(400).send({
                error: "Bad request",
                data: null,
            });
        }

        const blockedUsername = req.body.blockedUser;
        const blockedUser = await db.getUserByUsername(blockedUsername);

        if (!blockedUser) {
            logger.log(
                "error",
                `${routeName}/:id/block`,
                "PUT",
                404,
                `No such user to block. username=${blockedUsername}.`,
                null
            );
            return res.status(404).send({
                error: "No such user to block.",
                data: null,
            });
        }

        try {
            const r = await db.blockUser(id, blockedUser._id);
            logger.log(
                "info",
                `${routeName}/:id/block`,
                "PUT",
                200,
                `User blocked. blockerId:${id} blockedId=${blockedUser._id}.`,
                null
            );
            return res.status(200).send({
                error: null,
                data: r,
            });
        } catch (error) {
            let status = 500;
            if (error.code == 0) {
                status = 400;
            } else if (error.code == 1) {
                status = 409;
            } else if (error.code == 2) {
                status = 404;
            }
            return res.status(status).send({
                error: error.message,
                data: null,
            });
        }
    } catch (error) {
        console.log(error);
        logger.log(
            "info",
            `${routeName}/:id/block`,
            "PUT",
            500,
            `User block failed. request=${req.body}`,
            error
        );
        return res.status(500).send({
            error: "User block failed.",
            data: null,
        });
    }
});

router.post("/:id/message", async (req, res) => {
    try {
        const fromId = req.params.id;
        const { toUsername, text } = req.body;
        const reciever = await db.getUserByUsername(toUsername);

        if (!reciever) {
            logger.log(
                "error",
                `${routeName}/:id/message`,
                "POST",
                404,
                `User to message not found. request=${JSON.stringify(
                    req.body
                )}`,
                null
            );
            return res.status(404).send({
                error: "User to message not found",
                data: null,
            });
        }

        if (!fromId || !toUsername || !text || fromId === reciever._id) {
            logger.log(
                "error",
                `${routeName}/:id/message`,
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

        if (!util.canSendMessage(fromId, reciever)) {
            return res.status(403).send({
                error: "Cannot send message. Blocked",
                data: null,
            });
        }
        const timestamp = new Date().toISOString();

        const r = await db.createMessage(fromId, toUsername, text, timestamp);
        logger.log(
            "info",
            `${routeName}/:id/message`,
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
            `${routeName}/:id/block`,
            "POST",
            500,
            `Error when adding message. request=${JSON.stringify(req.body)}`,
            error
        );
        res.status(500).send({
            error: "Error when adding message.",
            data: null,
        });
    }
});

module.exports = router;
