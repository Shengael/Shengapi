'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const tataController = require("../controllers").tataController;

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
    res.send('Shengapi: Route GET /$name$').end();
    /*const tata = await tataController.getAll();
    res.json(tata);*/
});

module.exports = router;
