const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.post("/login", userController.doLogin);
router.post("/register", userController.create);

module.exports = router;
