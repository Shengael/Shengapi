'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const TotoController = require("../controllers").TotoController;

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
    res.send('Shengapi: Route GET /$name$').end();
    /*const Toto = await TotoController.getAll();
    res.json(Toto);*/
});

module.exports = router;
