const express = require("express");
const PORT = process.env.DBPROVIDER_PORT;
const DbClient = require("./dbclient");
const routes = require("./routes");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Dbprovider is alive");
});

app.use("/user", routes.user);
app.use("/message", routes.message);

app.use("*", function (req, res) {
    res.status(404).send({
        error: "Not found",
        data: null,
    });
});

app.listen(PORT, () => {
    console.log(`DBPROVIDER is listening on PORT: ${PORT}`);
});
