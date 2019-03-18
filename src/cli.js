#!/usr/bin/env node

//required packages

const argv = require('./utils').initYarg;
const Project = require('./models').Project;
const Generate = require('./models').Generate;
const logger = require('./utils').Logger;

const WORKING_DIR = process.cwd();
const SCRIPT_DIR = __dirname;
logger.setVerboseLevel(argv.verbose);


if(argv._[0] === 'init') {
    const proj = new Project(argv, WORKING_DIR, SCRIPT_DIR);
    proj.init();
}
if(argv._[0] === 'generate') {
    const gen = new Generate(argv, WORKING_DIR, SCRIPT_DIR);
    // gen.generate();
    gen.insertAttributes();
}







// console.log(acorn.parse(fs.readFileSync(`C:\\Users\\Luis\\Documents\\Projets\\esgi-api-npm-package\\src\\cli.js`)).body);

/*curl.get("https://gitignore.io/api/node,jetbrains,visualstudiocode", '', function(err, response, body) {
    console.log(body);
});*/
