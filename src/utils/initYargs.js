'use strict';

let element = require('yargs').scriptName('shengapi');


element = element.help('h')
    .alias('h', 'help')
    .command('init', 'create new project API', require('./options.init.yargs'))
    .example('$0 init -n Shengapi -a mongoose -vv', 'create basic project with basic installs')
    .command('generate', 'generate new element', require('./options.generate.yargs'))
    .example('$0 generate -n User', 'create model, route and controller for User');

// shengapi init


//shengapi generate



element = element.demandCommand();
module.exports = element.argv;
