const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const routes = require("./routes");
const checkAuth = require("./middlewares/auth");

const PORT = process.env.APP_PORT;
const SECRETKEY = process.env.APP_SECRETKEY;

const app = express();

app.use(session({ secret: SECRETKEY, saveUninitialized: true, resave: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", checkAuth, (req, res) => {
    res.send("it works");
});

app.use("/auth", routes.auth);
app.use("/api", checkAuth, routes.api);

app.use("*", function (req, res) {
    res.status(404).send("Not found");
});

app.listen(PORT, () => {
    console.log(`app is listening on PORT: ${PORT}`);
});
