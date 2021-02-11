const express = require("express");
const PORT = process.env.APP_PORT;


const app = express();


app.get("/", (req, res)=>{
    res.send("it works");
});


app.listen(PORT,()=>{
    console.log(`app is listening on PORT: ${PORT}`)
})