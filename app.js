const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./src/routes/index');
const bodyPar = require('body-parser');
const dbConnection = require('./configs/mongoConnect')
require('dotenv').config();

app.get('/', (req, res) => res.send('alo'));
app.use(cors());
app.use(morgan('combined'));
app.use(bodyPar.json());
app.use(
    bodyPar.urlencoded({
      extended: true,
      limit: "50mb",
      parameterLimit: 1000000,
    })
);
routes(app);
dbConnection.connect();
app.listen(process.env.PORT,() => {console.log(`Renzu app back-end listen on port: ${process.env.PORT}`)})

