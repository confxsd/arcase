const validators = require("./index");

describe("Validators", () => {
    describe("Check user", () => {
        test("Error: No username or password", () => {
            const u = null;
            const p = null;
            expect(() => {
                validators.checkUser(u, p);
            }).toThrow("No username or password");
        });
        
        test("Error: username should be > 6", () => {
            const u = "usr";
            const p = "password";
            expect(() => {
                validators.checkUser(u, p);
            }).toThrow("username and password length should be > 6");
        });

        test("Error: password should be > 6", () => {
            const u = "username";
            const p = "pass";
            expect(() => {
                validators.checkUser(u, p);
            }).toThrow("username and password length should be > 6");
        });

        test("Error: username should be < 32", () => {
            const u = "usernameusernameusernameusernameusername";
            const p = "password";
            expect(() => {
                validators.checkUser(u, p);
            }).toThrow("username and password length should be < 32");
        });

        test("Error: password should be < 32", () => {
            const u = "username";
            const p = "passwordpasswordpasswordpasswordpassword";
            expect(() => {
                validators.checkUser(u, p);
            }).toThrow("username and password length should be < 32");
        });
    });
});
