'use strict';

let element = require('yargs').scriptName('shengapi');


// shengapi init
element = element
    .usage('Usage: shengapi init -n project Name [-i] [-d] [-a] [-v]')
    .command('init', 'init api project')
    .alias('n', 'name')
    .nargs('n', 1)
    .string('name')
    .describe('n', 'project name')
    .alias('i', 'install')
    .array("install")
    .describe('i', 'npm package to install')
    .alias('d', 'installDev')
    .array("installDev")
    .describe('d', 'npm dev package to install')
    .alias('a', 'auto')
    .nargs('a', 1)
    .string('auto')
    .describe('a', 'create basic structure for api (-a mongoose || -a sequelize)')
    .alias('v', 'verbose')
    .count('verbose')
    .nargs('v', 0)
    .describe('v', 'verbose level')
    .demandOption(['n'])
    .help('h')
    .alias('h', 'help');

//shengapi generate
element = element
    .usage('Usage: shengapi generate -n project Name [-v]')
    .command('generate', 'generate new element')
    .alias('n', 'name')
    .string('name')
    .describe('n', 'element name')
    .alias('v', 'verbose')
    .count('verbose')
    .nargs('v', 0)
    .describe('v', 'verbose level')
    .demandOption(['n'])
    .help('h')
    .alias('h', 'help');


element = element.demandCommand();
module.exports = element.argv;
