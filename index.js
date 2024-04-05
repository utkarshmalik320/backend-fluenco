require('dotenv').config()

const express = require('express');
const app = express();
const port = 4000


app.get('/', (req, res) => {
    res.send("Welcome");
})

app.get('/youtube', (req, res) => {
    res.send("Welcome  to youtube");
})

app.listen(process.env.PORT, () => {
    console.log(`listening on port on port ${port}`)
})