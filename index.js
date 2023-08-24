const express = require('express');
const cors = require('cors');
const { connection } = require('./config/db');
const { apiRouter } = require('./routers/user.router');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Blog App');
})

app.use('/api',apiRouter);

const port = process.env.port;


app.listen(port, async () => {
    await connection;
    console.log(`server running at http://localhost:${port}`);
})