'use strict';
const fs = require('fs');
const express = require('express')
const router = express();
const GamesController = require('../controllers/gamesController');
const gameCtrl = new GamesController();
const cors = require('cors');
const jwt = require('jsonwebtoken');


// {
//     _id: game.id,
//     _rev: game.rev,
//     game: game.game,
//     genre: game.genre,
//     image_url: game.image_url,
//     article_no: game.article_no,
//     developers: game.developers,
//     online: game.online,
//     platform: game.platform
// }

router.get("/", async (req, res) => {
    let games = await gameCtrl.getList();
    games = games.map((val, index, arra) => {
        return {
            "game": val.game,
            "genre": val.genre,
            "image_url": val.image_url,
            "article_no": val.article_no,
            "developers": val.developers,
            "online": val.online,
            "platform": val.platform,
            "id": val._id,
            "rev":val._rev
        }
    });
    res.send(games);
});

module.exports = router;

