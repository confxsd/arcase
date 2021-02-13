const express = require("express");
const router = express.Router();

const messageController = require("../../controllers/message");

console.log("messageController.send", messageController.send)

router.post("/", messageController.send);

module.exports = router;
