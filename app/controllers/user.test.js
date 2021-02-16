const { mockRequest, mockResponse } = require("../util/interceptor");
const userController = require("./user");
const db = require("../dbclient");
const logger = require("../winstonLogger");
jest.mock("../dbclient");
jest.mock("../winstonLogger");

describe("User controller", () => {
    describe("Login", () => {
        test("Error: No username or password", async () => {
            const req = mockRequest();
            const res = mockResponse();

            await userController.doLogin(req, res);

            expect(res.body).not.toBeNull();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send.mock.calls[0][0].error).toEqual("Invalid request");
        });

        test("Error: Wrong password", async () => {
            const user = {
                _id: "84298338rhy2834",
                username: "username",
                password: "passwords",
            };
            db.getUserByUsername.mockResolvedValue(user);

            const req = mockRequest();
            req.body.username = "username";
            req.body.password = "password";
            const res = mockResponse();

            await userController.doLogin(req, res);

            expect(res.body).not.toBeNull();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send.mock.calls[0][0].error).toEqual(
                "Password didn't match"
            );
        });
        test("Success", async () => {
            const user = {
                _id: "84298338rhy2834",
                username: "username",
                password: "password",
            };
            db.getUserByUsername.mockResolvedValue(user);

            const req = mockRequest();
            req.body.username = "username";
            req.body.password = "password";
            const res = mockResponse();

            await userController.doLogin(req, res);

            expect(res.body).not.toBeNull();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send.mock.calls[0][0].data).toEqual(user._id);
        });
    });

    describe("Block user", () => {
        test("Error: User to block not found", async () => {
            const user = {
                _id: "234252524234",
                username: "blocker",
            };
            const blockedUsername = "userToBlock";
            db.getUserByUsername.mockResolvedValue(null);

            const req = mockRequest();
            req.body.blockedUser = blockedUsername;
            req.session.user = user;
            const res = mockResponse();

            await userController.block(req, res);
            expect(res.body).not.toBeNull();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send.mock.calls[0][0].error).toEqual(
                "User to block not found."
            );
        });
        test("Success", async () => {
            const user = {
                _id: "234252524234",
                username: "blocker",
            };
            const blockedUsername = "userToBlock";
            const blockedUser = {
                _id: "84298338rhy2834",
                username: "userToBlock",
            };
            db.getUserByUsername.mockResolvedValue(blockedUser);
            db.block.mockResolvedValue(blockedUser._id);

            const req = mockRequest();
            req.body.blockedUser = blockedUsername;
            req.session.user = user;
            const res = mockResponse();

            await userController.block(req, res);
            expect(res.body).not.toBeNull();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send.mock.calls[0][0].data).toEqual(blockedUser._id);
        });
    });

    describe("Send message", () => {
        test("Error: Invalid request", async () => {
            const req = mockRequest();
            req.body.toUsername = "reciever";
            const res = mockResponse();

            db.sendMessage.mockResolvedValue(1);

            await userController.sendMessage(req, res);

            expect(res.body).not.toBeNull();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send.mock.calls[0][0].error).toEqual("Invalid request");
        });

        test("Success", async () => {
            const user = {
                _id: "84298338rhy2834",
                username: "username",
                password: "password",
            };

            const req = mockRequest();
            req.session.user = user;
            req.body.text = "text";
            req.body.toUsername = "reciever";
            const res = mockResponse();

            db.sendMessage.mockResolvedValue(user._id);

            await userController.sendMessage(req, res);

            expect(res.body).not.toBeNull();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send.mock.calls[0][0].data).toEqual(user._id);
        });
    });
});
