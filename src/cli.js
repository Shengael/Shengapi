#!/usr/bin/env node

//required packages

const argv = require('./utils').initYarg;
const Init = require('./commands').Init;
const Generate = require('./commands').Generate;
const logger = require('./utils').Logger;

const WORKING_DIR = process.cwd();
const SCRIPT_DIR = __dirname;
logger.setVerboseLevel(argv.verbose);


if(argv._[0] === 'init') {
    const init = new Init(argv, WORKING_DIR, SCRIPT_DIR);
    init.execute();
}
if(argv._[0] === 'generate') {
    const generate = new Generate(argv, WORKING_DIR, SCRIPT_DIR);
    generate.generate();
}
