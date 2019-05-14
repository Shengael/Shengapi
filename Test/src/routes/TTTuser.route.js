'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const TTTuserController = require("../controllers").TTTuserController;

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
    res.send('Shengapi: Route GET /$name$').end();
    /*const TTTuser = await TTTuserController.getAll();
    res.json(TTTuser);*/
});

module.exports = router;
