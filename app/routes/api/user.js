const express = require("express");
const router = express.Router();

const userController = require("../../controllers/user");

router.put("/:id/block", userController.block);
router.post("/:id/message", userController.sendMessage);
router.get("/:id/message", userController.getMessages);

module.exports = router;
