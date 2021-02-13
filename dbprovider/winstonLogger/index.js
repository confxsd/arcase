const { createLogger, format, transports } = require("winston");
const utils = require("./utils");

const logger = createLogger({
    level: "info",
    format: utils.getCombinedLogFormat(),
    defaultMeta: { service: "DB Provider" },
    transports: [
        new transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
        new transports.File({ filename: "logs/combined.log" }),
    ],
});

module.exports = {
    log: function (level, route, action, status, message, error) {
        const errorStr = "";
        if (error) {
            errorStr = error.stack;
        }
        const concatstr = `${route} | ${action} | ${status} | ${message} | ${errorStr}`;
        logger.log(level, concatstr);
    },
};
