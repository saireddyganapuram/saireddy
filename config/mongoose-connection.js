const mongoose = require("mongoose")
const dbgr = require("debug")("development:mongoose")
const config = require("config")
const dotenv = require("dotenv").config()

mongoose.connect(`${config.get("MONGODB_URI")}/scatch`)
.then(() => {
    console.log("MongoDB Connected Successfully");
    dbgr("Connected")
})
.catch((err) => {
    console.log("MongoDB Connection Error:", err);
    dbgr(err)
})

module.exports = mongoose.connection;