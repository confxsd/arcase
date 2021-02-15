const util = module.exports = {
    safeResponse: (res) => {
        try {
            const safeRes = Object.assign({}, res);
            delete safeRes.password;
            delete safeRes.text;
            return safeRes;
        } catch (error) {
            throw error;
        }
    },
    safeResponseStr: (res) => {
        try {
            return JSON.stringify(util.safeResponse(res));
        } catch (error) {
            throw error;
        }
    },
};
