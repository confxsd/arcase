const logger = require("../winstonLogger");
const db = require("../dbclient");
const validators = require("../validators");
const { safeResponseStr } = require("../util");

const doLogin = async (req, res) => {
    const routeName = "/auth/login";
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            logger.log(
                "error",
                routeName,
                "POST",
                400,
                `Invalid Login: Bad request. request=${safeResponseStr(
                    req.body
                )}`,
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
                `Invalid Login: No such user. request=${safeResponseStr(
                    req.body
                )}`,
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
                `Invalid Login: Password didn't match. request=${safeResponseStr(
                    req.body
                )}`,
                null
            );
            return res.status(401).send({
                error: "Password didn't match",
                data: null,
            });
        }

        // set user session
        req.session.user = { id: user._id, username };

        logger.log(
            "info",
            routeName,
            "POST",
            200,
            `Login: Success. request=${safeResponseStr(req.body)}`,
            null
        );
        return res.status(200).send({
            error: null,
            data: user._id,
        });
    } catch (error) {
        logger.log(
            "error",
            routeName,
            "POST",
            500,
            `Login error. request=${safeResponseStr(req.body)}`,
            error
        );
        res.status(500).send({
            error: "Login error.",
            data: null,
        });
    }
};

const create = async (req, res) => {
    const routeName = "/auth/register";
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            logger.log(
                "error",
                routeName,
                "POST",
                400,
                `Bad request. request=${safeResponseStr(req.body)}`,
                null
            );
            return res.status(400).send({
                error: "Bad request",
                data: null,
            });
        }

        // validate before registering
        try {
            validators.checkUser(username, password);
        } catch (error) {
            logger.log(
                "error",
                routeName,
                "POST",
                400,
                `Bad request. request=${safeResponseStr(req.body)}`,
                error
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
                `Username already exists. request=${safeResponseStr(req.body)}`,
                null
            );
            return res.status(409).send({
                error: "Username already exists",
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
            `User registered. request=${safeResponseStr(req.body)}`,
            null
        );
        return res.status(201).send({
            error: null,
            data: r,
        });
    } catch (error) {
        try {
            if (error.response) {
                const resStatus = error.response.status;
                const resError = error.response.data.error;
                logger.log(
                    "error",
                    routeName,
                    "POST",
                    resStatus,
                    `${resError}. request=${safeResponseStr(req.body)}`,
                    error
                );
                res.status(resStatus).send({
                    error: resError,
                    data: null,
                });
            } else throw error;
        } catch (error) {
            logger.log(
                "error",
                routeName,
                "POST",
                500,
                `Error while user register. request=${safeResponseStr(
                    req.body
                )}`,
                error
            );
            res.status(500).send({
                error: "Error while user register",
                data: null,
            });
        }
    }
};

const block = async (req, res) => {
    const routeName = "/api/user/:id/block";
    try {
        const blockedUsername = req.body.blockedUser;
        const userId = req.session.user.id;

        //check if user to block exists
        const blockedUser = await db.getUserByUsername(blockedUsername);
        if (!blockedUser) {
            logger.log(
                "error",
                routeName,
                "PUT",
                404,
                `User to block not found. request=${safeResponseStr(req.body)}`,
                null
            );
            return res.status(404).send({
                error: "User to block not found.",
                data: null,
            });
        }

        if (!blockedUsername || blockedUser._id === userId) {
            logger.log(
                "error",
                routeName,
                "PUT",
                400,
                `Invalid request. request=${safeResponseStr(req.body)}`,
                null
            );
            return res.status(400).send({
                error: "Invalid request",
                data: null,
            });
        }

        const r = await db.block(userId, blockedUsername);
        logger.log(
            "error",
            routeName,
            "PUT",
            200,
            `User blocked. userId=${userId}. request=${safeResponseStr(
                req.body
            )}`,
            null
        );
        return res.status(200).send({
            error: null,
            data: r,
        });
    } catch (error) {
        try {
            if (error.response) {
                const resStatus = error.response.status;
                const resError = error.response.data.error;
                logger.log(
                    "error",
                    routeName,
                    "PUT",
                    resStatus,
                    `${resError}. request=${safeResponseStr(req.body)}`,
                    error
                );
                res.status(resStatus).send({
                    error: resError,
                    data: null,
                });
            } else throw error;
        } catch (error) {
            logger.log(
                "error",
                routeName,
                "PUT",
                500,
                `Error when blocking user. request=${safeResponseStr(
                    req.body
                )}`,
                error
            );
            res.status(500).send({
                error: "Error when blocking user",
                data: null,
            });
        }
    }
};

const sendMessage = async (req, res) => {
    const routeName = "/api/user:id/message";
    try {
        const { user } = req.session;
        const { text, toUsername } = req.body;

        if (!text || !toUsername) {
            logger.log(
                "error",
                routeName,
                "POST",
                400,
                `Invalid request. request=${safeResponseStr(req.body)}`,
                null
            );
            return res.status(400).send({
                error: "Invalid request",
                data: null,
            });
        }
        const r = await db.sendMessage(user.id, toUsername, text);

        logger.log(
            "info",
            routeName,
            "POST",
            201,
            `Message created. request=${safeResponseStr(req.body)}`,
            null
        );
        return res.status(201).send({
            error: null,
            data: r,
        });
    } catch (error) {
        try {
            if (error.response) {
                const resStatus = error.response.status;
                const resError = error.response.data.error;
                logger.log(
                    "error",
                    routeName,
                    "POST",
                    resStatus,
                    `${resError}. request=${safeResponseStr(req.body)}`,
                    error
                );
                return res.status(resStatus).send({
                    error: resError,
                    data: null,
                });
            } else throw error;
        } catch (error) {
            logger.log(
                "error",
                routeName,
                "POST",
                500,
                `Error while sending message. request=${safeResponseStr(
                    req.body
                )}`,
                error
            );
            res.status(500).send({
                error: "Error while sending message",
                data: null,
            });
        }
    }
};

const getMessages = async (req, res) => {
    try {
        const routeName = "/api/user/:id/message";
        const { user } = req.session;
        const requestedUserId = req.params.id;
        const messageType = req.query.type;
        if (requestedUserId !== user.id) {
            logger.log(
                "error",
                routeName,
                "GET",
                403,
                `Forbidden request to resource. request=${safeResponseStr(
                    req.body
                )}`,
                null
            );
            return res.status(400).send({
                error: "Not authorized",
                data: null,
            });
        }
        if (!messageType) {
            logger.log(
                "error",
                routeName,
                "GET",
                400,
                `Bad request. request=${safeResponseStr(req.body)}`,
                null
            );
            return res.status(400).send({
                error: "Provide a message type",
                data: null,
            });
        }

        if (messageType === "incoming") {
            const messages = await db.getIncomingMessages(user.id);

            return res.status(200).send({
                error: null,
                data: messages,
            });
        } else {
            return res.status(200).send({
                error: "Only supported type is incoming",
                data: null,
            });
        }
    } catch (error) {
        try {
            if (error.response) {
                const resStatus = error.response.status;
                const resError = error.response.data.error;
                logger.log(
                    "error",
                    routeName,
                    "GET",
                    resStatus,
                    `${resError}. request=${safeResponseStr(req.body)}`,
                    error
                );
                return res.status(resStatus).send({
                    error: resError,
                    data: null,
                });
            } else throw error;
        } catch (error) {
            try {
                if (error.response) {
                    const resStatus = error.response.status;
                    const resError = error.response.data.error;
                    logger.log(
                        "error",
                        routeName,
                        "GET",
                        resStatus,
                        `${resError}. request=${safeResponseStr(req.body)}`,
                        error
                    );
                    res.status(resStatus).send({
                        error: resError,
                        data: null,
                    });
                } else throw error;
            } catch (error) {
                logger.log(
                    "error",
                    routeName,
                    "GET",
                    500,
                    `Error while getting incoming messages. request=${safeResponseStr(
                        req.body
                    )}`,
                    error
                );
                res.status(500).send({
                    error: "Error while getting incoming messages",
                    data: null,
                });
            }
        }
    }
};
module.exports = {
    doLogin,
    create,
    block,
    sendMessage,
    getMessages,
};
