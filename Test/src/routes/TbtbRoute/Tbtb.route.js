'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const TbtbController = require("../controllers").TbtbController;

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
    res.send('Shengapi: Route GET /$name$').end();
    /*const Tbtb = await TbtbController.getAll();
    res.json(Tbtb);*/
});

module.exports = router;
