'use strict';
const { log } = require('console');
const express = require('express');
const router = express();

router.post('/', (req, res) => {
    res.send(200);
})

module.exports = router;