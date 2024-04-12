const app = require("./app.js").app
const connectDB  = require("./DataBase/database.js");
const cors = require("cors");

const port = process.env.PORT

app.use(cors({
    origin: "*" ,
}));


connectDB()

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})