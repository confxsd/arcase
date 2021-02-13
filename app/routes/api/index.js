const express = require("express");
const router = express.Router();

const message = require("./message");
const user = require("./user");

router.use("/user", user);
router.use("/message", message);

module.exports = router;
