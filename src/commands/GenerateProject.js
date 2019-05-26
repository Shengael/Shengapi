'use strict';

//PACKAGE NPM
const fs              = require('fs');
const shell           = require('shelljs');
const _               = require('lodash');
const logger          = require('../utils').Logger;
//IMPORT CLASS
const Tree            = require('../models/Tree');
const ImportManager   = require('../models/ImportManager');
const TemplateBuilder = require('../models/TemplateBuilder');
// JSON CONFIGURATION
const generateJSON    = require('../../Config/generate.json');
const templateJSON    = require('../../Config/template.json');

class GenerateProject {

    constructor(argv, WORKING_DIR, SCRIPT_DIR) {
        this.name            = argv.name;
        this.attributes      = argv.attributes;
        this.script_dir      = SCRIPT_DIR;
        this.projectDir      = WORKING_DIR;
        this.srcDir          = `${this.projectDir}\\src`;
        this.modelsDir       = `${this.srcDir}\\models`;
        this.controllersDir  = `${this.srcDir}\\controllers`;
        this.routesDir       = `${this.srcDir}\\routes`;
        this.template        = `${this.script_dir}\\templates\\generate`;
        this.dataSource      = false;
        this.configJSON = JSON.parse(JSON.stringify(generateJSON).replace(/\$name\$/g, this.name));
        console.log(this.attributes);
        this.tree            = new Tree(this.name, `${this.template}\\`, this.projectDir, this.srcDir, this.attributes);
        this.importManager = new ImportManager(this.projectDir);
    }

    generate() {

        if (!this.checkName()) return false;

        if (!this.checkProject()) return false;

        if (!this.generateTemplates()) return false;

        this.editImports();

        if (this.dataSource === 'sequelize') {
            const attrs = this.attributes.join(',');
            shell.cd(this.srcDir);
            if (shell.exec(`sequelize model:create --name ${this.name} --attributes ${attrs}> nul 2>&1`).code !== 0) {
                logger.ERROR(`sequelize model failed`);
                logger.ERROR(`${attrs}`);
                shell.exit(1);
            }
            shell.cd(this.projectDir);
        }
    }

    checkName() {
        return this.name.length;
    }


    generateTemplates() {
        let configJSON = this.configJSON.global.create;
        if (this.dataSource === 'mongoose') configJSON = _.merge(configJSON, this.configJSON.mongoose.create);
        else if (this.dataSource === 'sequelize') configJSON = _.merge(configJSON, this.configJSON.sequelize.create);
        else return false;

        this.tree.createDir(`${this.srcDir}\\`, configJSON);

        return true;

    }


    checkProject() {
        if (!fs.existsSync(this.controllersDir)) {
            logger.ERROR(`${this.controllersDir} doesn't exist`);
            return false;
        }

        if (!fs.existsSync(this.modelsDir)) {
            logger.ERROR(`${this.modelsDir} doesn't exist`);
            return false;
        }

        if (!fs.existsSync(this.routesDir)) {
            logger.ERROR(`${this.routesDir} doesn't exist`);
            return false;
        }

        if (!fs.existsSync(`${this.routesDir}\\index.js`)) {
            logger.ERROR(`${this.routesDir}\\index.js doesn't exist`);
            return false;
        }

        if (!fs.existsSync(`${this.modelsDir}\\index.js`)) {
            logger.ERROR(`${this.modelsDir}\\index.js doesn't exist`);
            return false;
        }

        if (!fs.existsSync(`${this.controllersDir}\\index.js`)) {
            logger.ERROR(`${this.controllersDir}\\index.js doesn't exist`);
            return false;
        }

        const packageJson = fs.readFileSync(`${this.projectDir}\\package.json`);
        const configs     = JSON.parse(packageJson.toString());

        if (configs.dependencies && configs.dependencies.mongoose) {
            this.dataSource = 'mongoose';
            logger.INFO('DataSource Mongoose detected');
        }

        if (configs.dependencies && configs.dependencies.sequelize) {
            if (this.dataSource === 'mongoose') {
                logger.WARN('DataSource Mongoose detected first, so Sequelize ignored');
            } else {
                this.dataSource = 'sequelize';
            }
        }

        return true;
    }

    editImports() {
        let edits;
        if (this.dataSource === 'sequelize') edits = this.configJSON.sequelize.edit;
        else if (this.dataSource === 'mongoose') edits = this.configJSON.mongoose.edit;
        else return false;

        this.importManager.addFilesToImport(edits);
    }
}


module.exports = GenerateProject;
