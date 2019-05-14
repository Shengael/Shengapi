'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const TuserController = require("../controllers").TuserController;

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
    res.send('Shengapi: Route GET /tuser').end();
    /*const tusers = await TuserController.getAll();
    res.json(tusers);*/
});

module.exports = router;
