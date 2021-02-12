const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const {
    MONGO_INITDB_ROOT_USERNAME,
    MONGO_INITDB_ROOT_PASSWORD,
    MONGO_PORT,
    MONGO_DATABASE_NAME,
    MONGO_SERVICE_NAME,
} = process.env;

const docNames = {
    user: "user",
    message: "message",
};

async function connect() {
    const url = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_SERVICE_NAME}:${MONGO_PORT}`;
    try {
        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        return client.db(MONGO_DATABASE_NAME);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    checkConnection: async function () {
        try {
            const db = await connect();
            return "OK";
        } catch (error) {
            throw error;
        }
    },
    addUser: async function (user) {
        try {
            const db = await connect();
            const r = await db.collection(docNames.user).insertOne(user);
            if (r.insertedCount != 1) {
                throw Error("Couldn't add user");
            }
            return r;
        } catch (error) {
            throw error;
        }
    },
    getUserById: async function (id) {
        try {
            const db = await connect();
            if (id) {
                return await db
                    .collection(docNames.user)
                    .findOne({ _id: ObjectID(id) });
            } else {
                return await db.collection(docNames.user).find({}).toArray();
            }
        } catch (error) {
            throw error;
        }
    },
    getUsers: async function (query) {
        try {
            const db = await connect();
            if (query) {
                return await db.collection(docNames.user).find(query);
            } else {
                return await db.collection(docNames.user).find({}).toArray();
            }
        } catch (error) {
            throw error;
        }
    },
    createMessage: async function (fromId, toId, text, timestamp) {
        try {
            const db = await connect();
            const messageToAdd = {
                from: ObjectID(fromId),
                to: ObjectID(toId),
                text,
                timestamp,
            };
            const r = await db
                .collection(docNames.message)
                .insertOne(messageToAdd);
            if (r.insertedCount != 1) {
                throw Error("Couldn't add message");
            }
            return r;
        } catch (error) {
            throw error;
        }
    },
    getAllMessages: async function () {
        try {
            const db = await connect();
            return await db.collection(docNames.message).find({}).toArray();
        } catch (error) {
            throw error;
        }
    },
    getMessagesSentToUser: async function (toId) {
        try {
            const db = await connect();
            return await db
                .collection(docNames.message)
                .find({ to: ObjectID(toId) })
                .toArray();
        } catch (error) {
            throw error;
        }
    },
};
