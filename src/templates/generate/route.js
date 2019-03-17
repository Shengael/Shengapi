'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const $controller$ = require("../controllers").$controller$;

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
    res.send('Shengapi: Route GET /$name$').end();
    /*const $model$ = await $controller$.getAll();
    res.json($model$);*/
});

module.exports = router;
