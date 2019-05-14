'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const UserController = require("../controllers").UserController;

router.use(bodyParser.json());

router.get('/', async (req, res, next) => {
    res.send('Shengapi: Route GET /user').end();
    /*const users = await UserController.getAll();
    res.json(users);*/
});

module.exports = router;
