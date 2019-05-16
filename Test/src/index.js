'use strict';

require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

const RouterBuilder = require('./routes');
const app = express();

app.use(morgan('dev'));

app.get('/', (req, res, next) => {
    res.send('Shengapi start !').end();
});
RouterBuilder.build(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port} ....`));
