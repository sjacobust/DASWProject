'use strict';
const fs = require('fs');
const express = require('express')
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000;
const SECRET_JWT = process.env.SECRET_JWT || 'h@la123Cr@yola';

// Routers

const genreRouter = require('./routes/genreRoutes');
const gameListRouter = require('./routes/gameListRoutes');
const userRouter = require('./routes/usersRoutes');
const articleRouter = require('./routes/articlesRouters')

// Controllers

const UsersController = require('./controllers/usersController');

// static files for use in page
app.use(express.static(__dirname +'/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// Routes 

app.use('/api/users', userRouter);
app.use('api/articles', articleRouter)
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


app.post('/api/login', async (req, res) => {
  if (req.body.email && req.body.password) {
      let uctrl = new UsersController();
      //let pass = bcryp.hashSync(req.body.password,5);
      let user = await uctrl.getUserByCredentials(req.body.email, req.body.password);
      //user.password === pass
      if (user) {
          // let token = randomize('Aa0','10')+"-"+user.uid;
          console.log(user);
          let token = jwt.sign({
              "uid": user.uid
          }, SECRET_JWT);
          user.token = token;
          uctrl.updateUser(user, (user) => {
              res.status(200).send({
                  "token": token
              });
          });

      } else {
          res.status(401).send('Wrong credentials');
      }
  } else {
      res.status(400).send('Missing user/pass');
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})