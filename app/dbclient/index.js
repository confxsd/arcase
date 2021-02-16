/* istanbul ignore file */
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
            return r.data.data;
        } catch (error) {
            throw error;
        }
    },
    getUserById: async function (id) {
        try {
            const r = await ax.get(`/user/${id}`);
            return r.data.data;
        } catch (error) {
            throw error;
        }
    },
    createUser: async function (user) {
        try {
            const r = await ax.post("/user", user);
            return r.data.data;
        } catch (error) {
            throw error;
        }
    },
    sendMessage: async function (fromId, toUsername, text) {
        try {
            const r = await ax.post(`/user/${fromId}/message`, {
                toUsername,
                text,
            });
            return r.data.data;
        } catch (error) {
            throw error;
        }
    },
    getIncomingMessages: async function (toId) {
        try {
            const r = await ax.get(`/message`, {
                params: {
                    toId,
                },
            });
            
            return r.data.data;
        } catch (error) {
            throw error;
        }
    },
    block: async function (userId, blockedUser) {
        try {
            const r = await ax.put(`/user/${userId}/block`, {
                blockedUser,
            });
            return r.data;
        } catch (error) {
            throw error;
        }
    },
};
