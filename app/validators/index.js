module.exports = {
    checkUser: (username, password) => {
        try {
            if (!username || !password) {
                throw Error("No username or password");
            }
            if (username.length < 6 || password.length < 6) {
                throw Error("username and password length should be > 6");
            }
            if (username.length > 32 || password.length > 32) {
                throw Error("username and password length should be < 32");
            }
            return true;
        } catch (error) {
            throw error;
        }
    },
};
