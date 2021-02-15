module.exports = {
    canSendMessage: (senderId, reciever) => {
        if (!reciever.blocked) {
            return true;
        }
        return reciever.blocked.indexOf(senderId) === -1;
    },
};
