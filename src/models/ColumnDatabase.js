'use strict';

const _        = require('lodash');
const fs       = require('fs');
const acorn    = require('acorn');
const beautify = require('js-beautify').js;
const shell    = require('shelljs');

const ImportManager = require('./ImportManager');

class ColumnDatabase {

    constructor(name, projectDir, srcDir) {
        this.name = name;
        this.projectDir = projectDir;
        this.srcDir = srcDir;
    }

    insertAttributes(mode, attributes, filePath) {

        if(mode === 'sequelize') this.sequelizeInsert(attributes);
        else if(mode === 'mongoose') this.mongooseInsert(attributes, filePath);
        else return false;

        return true;

    }

    mongooseInsert(attributes, filePath) {
        const fileJS = fs.readFileSync(filePath).toString();
        let bodyJs   = acorn.parse(fileJS).body;

        const attributesArray = attributes.map(ele => {
            return `${ele.split(':')[0].toLowerCase().trim()}: ${ele.split(':')[1].trim().charAt(0).toUpperCase()}${ele.split(':')[1].trim().slice(1).toLowerCase()}`;
        });

        const attributesString = attributesArray.join(',');

        bodyJs = bodyJs.filter(statement => statement.type === 'VariableDeclaration')
            .filter(statement => statement.declarations[0].type === 'VariableDeclarator')
            .filter(statement => statement.declarations[0].id.name === "$modelName$Schema")
            .filter(statement => statement.declarations[0].init.type === 'NewExpression')
            .find(statement => statement.declarations[0].init.callee.name === 'Schema');

        const position = bodyJs.declarations[0].init.arguments[0].start + 1;

        let res = ImportManager.editString(fileJS, attributesString, position);
        res     = beautify(res, {indent_size: 4, space_in_empty_paren: true});

        fs.writeFileSync(filePath, res);
        return true;
    }

    sequelizeInsert(attributes) {
        const attrs = attributes.join(',');
        shell.cd(this.srcDir);
        if (shell.exec(`sequelize model:create --name ${this.name} --attributes ${attrs}> nul 2>&1`).code !== 0) {
            logger.ERROR(`sequelize model failed`);
            logger.ERROR(`${attrs}`);
            shell.exit(1);
        }
        shell.cd(this.projectDir);
    }
}

module.exports = ColumnDatabase;
