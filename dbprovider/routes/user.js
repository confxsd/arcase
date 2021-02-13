var express = require("express");
var router = express.Router();

const PORT = process.env.DBPROVIDER_PORT;
const db = require("../dbclient");

const logger = require("../winstonLogger");

router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            logger.log(
                "error",
                "/user",
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
            "/user",
            "POST",
            201,
            `User created: ${username}`,
            null
        );
        return res.status(201).send({
            error: null,
            data: r.insertedId,
        });
    } catch (error) {
        logger.log(
            "error",
            "/user",
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
        return res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error when getting users.");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id ? req.params.id : null;
        const user = await db.getUserById(id);
        return res.status(200).send(user);
    } catch (error) {
        logger.log(
            "error",
            `/user:${id}`,
            "GET",
            500,
            `Error when getting user`,
            error
        );
        res.status(500).send("Error when getting user data");
    }
});

router.get("/", async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            console.log("provide username");
            return res.status(400).send("provide username");
        }
        const user = await db.getUserByUsername(username);
        return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error when getting users.");
    }
});


module.exports = router;
