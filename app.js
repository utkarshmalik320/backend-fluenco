const express = require("express")
const influencerRouter = require("./Routes/influencer.route.js")
const couponRouter = require("./Routes/coupon.route.js")
const cookieParser = require("cookie-parser")
const config = require("dotenv").config
const cors = require("cors");
const app = express()

module.exports = { app };

app.use(cors({ credentials: true, origin: 'http://localhost:5173' })); //Change the origin according to need


config({
    path: ".env",
})

app.use(express.json())
app.use(cookieParser())


app.use("/api/creator", influencerRouter)
app.use("/api/coupon", couponRouter)

app.get("/", (req,res)=>{
    res.send("Server Working Properly")
})