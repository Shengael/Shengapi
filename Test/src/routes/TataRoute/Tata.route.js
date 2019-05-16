'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const TataController = require("../controllers").TataController;

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
    res.send('Shengapi: Route GET /$name$').end();
    /*const Tata = await TataController.getAll();
    res.json(Tata);*/
});

module.exports = router;
