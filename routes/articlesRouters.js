'use strict';
const { log } = require('console');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const ArticleController = require('../controllers/articlesController');
const articleCtrl = new ArticleController();
const UsersController = require('../controllers/usersController');
const GamesController = require('../controllers/gamesController');
const gameCtrl = new GamesController();
const router = express();

// router.delete('/:email',(req,res)=>{
//     if (req.params.email) {
//         usersCtrl.getUserByEmail(req.params.email,(u)=>{
//             if (u) {
//                 usersCtrl.deleteUser(u,(deleted)=>{
//                     res.status(200).send({"deleted":deleted});
//                 })
//             } else {
//                 res.status(404).send('user does not exist');
//             }
//         });
//     } else {
//         res.status(400).send('missing arguments');
//     }
// });

async function authentication(req, res, next) {
    let xauth = req.get('x-auth-user');
    if (xauth) {
        // let id = xauth.split("-").pop();
        let token = jwt.verify(xauth, SECRET_JWT);
        let id = token.uid;

        let userctrl = new UsersController();
        console.log(`${token} ${id}`)
        try {
            let user = await userctrl.getUser(id);
            if (user && user.token === xauth) {
                next();
            } else {
                console.log(` ${user}`);
                res.status(401).send('Not authorized');
            }
        } catch (error) {
            console.log(error);
        }
  
    } else {
        res.status(401).send('Not authorized');
    }
  
  }


router.post('/new', (req, res) => {
    let b = req.body;
    if (b.title && b.game && b.tags && b.text) {
        articleCtrl.getUniqueArticle(b.title, b.game, b.tags, (a)=>{
            console.log(a);
            if (a) {
                res.status(400).send('article already exists');
            } else {
                articleCtrl.insertArticle(b,(article)=>{
                    console.log("Article Published");
                    res.status(201).send(article);
                });
            }
        });
    } else {
        res.status(400).send('missing arguments');
        console.log("Missing arguments");
        console.log(b);

    }
});

router.get('/:id', (req, res) => {
    let b = req.body;
    if (b.title && b.game && b.tags && b.text) {
        articleCtrl.getUniqueArticle(b.title, b.game, b.tags, (a)=>{
            console.log(a);
            if (a) {
                res.status(400).send('article already exists');
            } else {
                articleCtrl.insertArticle(b,(article)=>{
                    console.log("Article Published");
                    res.status(201).send(article);
                });
            }
        });
    } else {
        res.status(400).send('missing arguments');
        console.log("Missing arguments");
        console.log(b);

    }
});

router.get('/edit/:id', (req, res) => {
    let b = req.body;
    if (b.title && b.game && b.tags && b.text) {
        articleCtrl.getUniqueArticle(b.title, b.game, b.tags, (a)=>{
            console.log(a);
            if (a) {
                res.status(400).send('article already exists');
            } else {
                articleCtrl.insertArticle(b,(article)=>{
                    console.log("Article Published");
                    res.status(201).send(article);
                });
            }
        });
    } else {
        res.status(400).send('missing arguments');
        console.log("Missing arguments");
        console.log(b);

    }
});

router.get('/', async (req, res) => {
    let articleCtrl = new ArticleController();
    let articles = await articleCtrl.getList();
        if (req.query.title || req.query.game) {
            let title = (req.query.title) ? req.query.title : '';
            let game = (req.query.game) ? req.query.game : '';
            articles = articles.filter((ele, index, arr) => {
                let isMatch = true;
                if (title) {
                    isMatch &= ele.title.toUpperCase().includes(title.toUpperCase())
                }
                if (game) {
                    isMatch &= ele.game.toUpperCase().includes(game.toUpperCase())
                }
                return isMatch;
            });
        }
        if (req.query.page) {
            let limit = (req.query.limit) ? parseInt(req.query.limit) : 5;
            let page = parseInt(req.query.page) * limit - limit;
            articles = articles.slice(page, page + limit);
        } else {
            articles = articles.slice(0, 0 + 5);
        }
    
        articles = articles.map((val, index, arra) => {
            return {
                "title": val.title,
                "game": val.game,
                "text": val.text,
                "tags": val.tags,
                "published": val.published,
                "id": val._id,
                "rev":val._rev
            }
        });
        res.send(articles);  

});



module.exports = router;
