var express = require("express");
var router = express.Router();

const PORT = process.env.DBPROVIDER_PORT;
const db = require("../dbclient");

router.post("/", async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).send("invalid body")
        }

        const data = await db.addUser(req.body);
        res.status(201).send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error when adding user");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id ? req.params.id : null;
        const user = await db.getUserById(id);
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error when getting users.");
    }
});

router.get("/", async (req, res) => {
    try {
        const users = await db.getUsers();
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error when getting users.");
    }
});

module.exports = router;
