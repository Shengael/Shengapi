'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const TTTTuserController = require("../controllers").TTTTuserController;

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
    res.send('Shengapi: Route GET /$name$').end();
    /*const TTTTuser = await TTTTuserController.getAll();
    res.json(TTTTuser);*/
});

module.exports = router;
