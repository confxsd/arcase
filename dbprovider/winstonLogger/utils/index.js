const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

module.exports = {
    getCombinedLogFormat: (config) => {
        try {
            return combine(
                timestamp(),
                printf(({ level, message, timestamp }) => {
                    return `${timestamp} | ${message}`;
                })
            );
        } catch (error) {
            return error;
        }
    },
};
