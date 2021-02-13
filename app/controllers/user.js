const logger = require("../winstonLogger");
const db = require("../dbclient");
const validators = require("../validators");

const doLogin = async (req, res) => {
    try {
        const routeName = "/auth/login";
        const { username, password } = req.body;

        if (!username || !password) {
            logger.log(
                "error",
                routeName,
                "POST",
                400,
                `Invalid request. request=${JSON.stringify(req.body)}`,
                null
            );
            return res.status(400).send({
                data: null,
                error: "Invalid request",
            });
        }
        const user = await db.getUserByUsername(username);

        if (!user) {
            logger.log(
                "error",
                routeName,
                "POST",
                401,
                `No such user. request=${JSON.stringify(req.body)}`,
                null
            );
            return res.status(401).send({
                data: null,
                error: "No such user",
            });
        }
        if (user.password !== password) {
            logger.log(
                "error",
                routeName,
                "POST",
                401,
                `Password didn't match. request=${JSON.stringify(req.body)}`,
                null
            );
            return res.status(401).send({
                error: "Password didn't match",
                data: null,
            });
        }
        req.session.user = { id: user._id, username };
        logger.log(
            "info",
            routeName,
            "POST",
            200,
            `User logged in. request=${JSON.stringify(req.body)}`,
            null
        );
        return res.status(200).send({
            error: null,
            data: user,
        });
    } catch (error) {
        logger.log(
            "error",
            routeName,
            "POST",
            500,
            `Error when getting user. request=${JSON.stringify(req.body)}`,
            null
        );
        res.status(500).send({
            error: "Error when getting user.",
            data: null,
        });
    }
};

const create = async (req, res) => {
    try {
        const routeName = "/auth/login";
        const { username, password } = req.body;

        if (!username || !password) {
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

        // validate before registering
        try {
            validators.checkUser(username, password);
        } catch (error) {
            console.log(error);
            logger.log(
                "error",
                routeName,
                "POST",
                400,
                `Bad request. request=${JSON.stringify(req.body)}`,
                null
            );
            return res.status(400).send({
                error: error.message,
                data: null,
            });
        }

        //check if user exists
        const user = await db.getUserByUsername(username);
        if (user) {
            logger.log(
                "error",
                routeName,
                "POST",
                409,
                `Username already exists. request=${JSON.stringify(req.body)}`,
                null
            );
            return res.status(409).send({
                error: "Username already exist",
                data: null,
            });
        }

        //register user
        const r = await db.createUser({ username, password });
        logger.log(
            "info",
            routeName,
            "POST",
            201,
            `User registered. request=${JSON.stringify(req.body)}`,
            null
        );
        return res.status(201).send({
            error: null,
            data: r,
        });
    } catch (error) {
        logger.log(
            "info",
            routeName,
            "POST",
            500,
            `Error when user register. request=${JSON.stringify(req.body)}`,
            error
        );
        return res.status(500).send({
            error: "Error when user register",
            data: null,
        });
    }
};

const block = async (req, res) => {
    try {
        res.send("ok");
    } catch (error) {
        res.send(error);
    }
};
const get = async (req, res) => {
    try {
        res.send("ok");
    } catch (error) {
        res.send(error);
    }
};

module.exports = {
    doLogin,
    create,
    block,
    get,
};
