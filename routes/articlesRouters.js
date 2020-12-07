'use strict';
const { log } = require('console');
const express = require('express');
const ArticleController = require('../controllers/articlesController');
const router = express();


router.get('/', (req, res) => {
    res.status(200).send("I'm here");
})

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
                "article": val.article,
                "tag": val.tags,
                "id": val._id,
                "rev":val._rev
            }
        });
        res.send(articles);  

});



module.exports = router;