'use strict';
const fs = require('fs');
const express = require('express')
const app = express();
const randomize = require('randomatic');
const genreRouter = require('./routes/genreRoute');
const gameListRouter = require('./routes/gameListRoute');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000;
const SECRET_JWT = process.env.SECRET_JWT || 'h@la123Cr@yola';

// static files for use in page
app.use(express.static(__dirname +'/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// ROUTES 

app.use('/api/genreList', genreRouter);
app.use('/api/gameList', gameListRouter);


async function authentication(req, res, next) {
  let xauth = req.get('x-auth-user');
  if (xauth) {
      // let id = xauth.split("-").pop();
      let token = jwt.verify(xauth, SECRET_JWT);
      let id = token.uid;
      let userctrl = new UsersController();
      try {
          let user = await userctrl.getUser(id);
          if (user && user.token === xauth) {
              next();
          } else {
              res.status(401).send('Not authorized');
          }
      } catch (error) {
          console.log(error);
      }

  } else {
      res.status(401).send('Not authorized');
  }

}


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})