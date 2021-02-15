module.exports = {
    canSendMessage: (senderId, reciever) => {
        if (!reciever.blocked) {
            return true;
        }
        if (reciever.blocked.indexOf(senderId)) {
            return false;
        }
        return true;
    },
};
