'use strict';

//PACKAGE NPM
const fs              = require('fs');
const acorn           = require('acorn');
const beautify        = require('js-beautify').js;
const shell           = require('shelljs');
const _               = require('lodash');
const logger          = require('../utils').Logger;
//IMPORT CLASS
const TemplateBuilder = require('../models/TemplateBuilder');
const Tree            = require('../models/Tree');
const ImportManager   = require('../models/ImportManager');
// JSON CONFIGURATION
const templateJSON    = require('../../Config/template.json');
const generateJSON    = require('../../Config/generate.json');

class GenerateProject {

    constructor(argv, WORKING_DIR, SCRIPT_DIR) {
        this.name            = argv.name;
        this.attributes      = argv.attributes;
        this.script_dir      = SCRIPT_DIR;
        this.projectDir      = WORKING_DIR;
        this.base            = `${this.projectDir}\\${generateJSON.root}\\`;
        this.srcDir          = `${this.projectDir}\\src`;
        this.modelsDir       = `${this.srcDir}\\models`;
        this.controllersDir  = `${this.srcDir}\\controllers`;
        this.routesDir       = `${this.srcDir}\\routes`;
        this.template        = `${this.script_dir}\\templates\\generate`;
        this.dataSource      = false;
        this.configJSON = JSON.parse(JSON.stringify(generateJSON).replace(/\$name\$/g, this.name));
        this.templateBuilder = new TemplateBuilder(templateJSON, this.name);
        this.tree            = new Tree(this.name, `${this.template}\\`, this.projectDir);
        this.importManager = new ImportManager(this.projectDir);
    }

    generate() {

        this.editImports();

        if (!this.checkName()) return false;

        if (!this.checkProject()) return false;

        if (!this.generateTemplates()) return false;

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

        console.log(configJSON);

        this.tree.createDir(`${this.srcDir}\\`, this.configJSON);

        return true;

    }


    /*insertAttributes(JSString) {
        // const model = fs.readFileSync(`${this.template}\\model.mongoose.js`).toString();
        let bodyJs = acorn.parse(JSString).body;

        const attributesArray = this.attributes.map(ele => {
            return `${ele.split(':')[0].toLowerCase().trim()}: ${ele.split(':')[1].trim().charAt(0).toUpperCase()}${ele.split(':')[1].trim().slice(1).toLowerCase()}`;
        });

        const attributesString = attributesArray.join(',');

        bodyJs = bodyJs.filter(statement => statement.type === 'VariableDeclaration')
            .filter(statement => statement.declarations[0].type === 'VariableDeclarator')
            .filter(statement => statement.declarations[0].id.name === "$modelName$Schema")
            .filter(statement => statement.declarations[0].init.type === 'NewExpression')
            .find(statement =>  statement.declarations[0].init.callee.name === 'Schema');

        const position = bodyJs.declarations[0].init.arguments[0].start + 1;

        let res = GenerateProject.editString(JSString, attributesString, position);
        res = beautify(res, { indent_size: 4, space_in_empty_paren: true });

        return res;

    }*/


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
