const axios = require("axios");
const { DBPROVIDER_SERVICE_NAME, DBPROVIDER_PORT } = process.env;

const ax = axios.create({
    baseURL: `http://${DBPROVIDER_SERVICE_NAME}:${DBPROVIDER_PORT}`,
    timeout: 1000,
    headers: {},
});

module.exports = {
    getUserByUsername: async function (username) {
        try {
            const r = await ax.get("/user", {
                params: {
                    username,
                },
            });
            return r.data;
        } catch (error) {
            throw error;
        }
    },
    createUser: async function (user) {
        try {
            const r = await ax.post("/user", user);
            return r.data;
        } catch (error) {
            throw error;
        }
    },
    sendMessage: async function (fromId, toId, text) {
        try {
            const r = await ax.post("/message", {
                fromId,
                toId,
                text,
            });
            return r.data;
        } catch (error) {
            throw error;
        }
    },
    getMessagesSentToUser: async function (userId) {
        try {
            const r = await ax.get("/message", {
                params: {
                    userId,
                },
            });
            return r.data;
        } catch (error) {
            throw error;
        }
    },
};
