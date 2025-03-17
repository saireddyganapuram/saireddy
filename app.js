const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const path = require("path")
const db = require("./config/mongoose-connection")
const ownersRouter = require("./routes/ownersRouter")
const productsRouter = require("./routes/productsRouter")
const usersRouter = require("./routes/usersRouter")
const indexRouter = require("./routes/index")
const expressSession = require("express-session")
const flash = require("connect-flash")
require("dotenv").config()


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET || 'saireddy',
    })
)
app.use(flash())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.set("view engine","ejs")

app.use('/',indexRouter)
app.use("/owners", ownersRouter)
app.use("/products", productsRouter)
app.use("/users", usersRouter)

app.listen(3000,(req,res) => {
    console.log("server is running");
})
