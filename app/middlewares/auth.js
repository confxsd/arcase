module.exports = (req, res, next) => {
    try {
        if (!req.session.user) {
            throw Error();
        }
        next();
    } catch (error) {
        res.status(401).send("Not authorized");
    }
};
