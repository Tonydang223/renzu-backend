const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

app.get('/home', (req, res) => res.send('alo'));
app.use(cors());
app.use(morgan('combined'));
app.listen(process.env.PORT,() => {console.log(`Renzu app listen on port: ${process.env.PORT}`)})

