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
            return r.insertedId;
        } catch (error) {
            throw error;
        }
    },
    getUserById: async function (id) {
        try {
            const db = await connect();
            let r = await db
                .collection(docNames.user)
                .findOne({ _id: ObjectID(id) });
            return r;
        } catch (error) {
            throw error;
        }
    },
    getUserByUsername: async function (username) {
        try {
            const db = await connect();
            const r = await db.collection(docNames.user).findOne({ username });
            return r;
        } catch (error) {
            throw error;
        }
    },
    getUsers: async function (query) {
        try {
            const db = await connect();
            let r = await db.collection(docNames.user).find({}).toArray();
            return r;
        } catch (error) {
            throw error;
        }
    },
    createMessage: async function (fromId, toUsername, text, timestamp) {
        try {
            const db = await connect();
            const toUser = await this.getUserByUsername(toUsername);
            if (!toUser) {
                throw Error("No user found with username");
            }
            const messageToAdd = {
                from: ObjectID(fromId),
                to: ObjectID(toUser._id),
                text,
                timestamp,
            };
            const r = await db
                .collection(docNames.message)
                .insertOne(messageToAdd);
            if (r.insertedCount != 1) {
                throw Error("Couldn't add message");
            }
            return r.insertedId;
        } catch (error) {
            throw error;
        }
    },
    getAllMessages: async function () {
        try {
            const db = await connect();
            const r = await db.collection(docNames.message).find({}).toArray();
            return r;
        } catch (error) {
            throw error;
        }
    },
    getMessagesSentToUser: async function (toId) {
        try {
            const db = await connect();
            const r = await db
                .collection(docNames.message)
                .find({ to: ObjectID(toId) })
                .toArray();
            const messages = Promise.all(
                await r.map(async (m) => {
                    const fromUser = await this.getUserById(m.from);
                    return {
                        from: fromUser.username,
                        text: m.text,
                        timestamp: m.timestamp,
                    };
                })
            );
            return messages;
        } catch (error) {
            throw error;
        }
    },
    blockUser: async function (userId, blockedId) {
        try {
            if (userId == blockedId) {
                let error = Error("Cannot block himself/herself");
                error.code = 0;
                throw error;
            }
            const db = await connect();
            const r = await db.collection(docNames.user).updateOne(
                { _id: ObjectID(userId) },
                {
                    $addToSet: {
                        blocked: ObjectID(blockedId),
                    },
                },
                { upsert: true }
            );
            if (r.modifiedCount === 0 && r.matchedCount === 1) {
                let error = Error("User already blocked");
                error.code = 1;
                throw error;
            }
            if (r.matchedCount !== 1) {
                let error = Error("No user to block");
                error.code = 2;
                throw error;
            }
            return blockedId;
        } catch (error) {
            throw error;
        }
    },
};
