'use strict';
const fs = require('fs');
const express = require('express')
const app = express();
const randomize = require('randomatic');
const genreRouter = require('./routes/genreRoute');
const gameListRouter = require('./routes/gameListRoute');
const cors = require('cors');
const port = 3000;

// static files for use in page
app.use(express.static(__dirname +'/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// ROUTES 


app.use('/api/genreList', genreRouter);
app.use('/api/gameList', gameListRouter);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})