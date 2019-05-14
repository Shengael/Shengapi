'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const TTuserController = require("../controllers").TTuserController;

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
    res.send('Shengapi: Route GET /$name$').end();
    /*const TTuser = await TTuserController.getAll();
    res.json(TTuser);*/
});

module.exports = router;
