'use strict';

const _ = require('lodash');
const fs = require('fs');
const acorn = require('acorn');
const beautify = require('js-beautify').js;

class ImportManager {

    constructor(root) {
        this.root = root;
    }

    addFilesToImport(editJSON) {

        _.forEach(editJSON, edit => {
            if(edit.import === true) {
                if(edit.router === true) this.editRouteBuilder(`${this.root}\\${edit.path}`, edit.key);
                else ImportManager.editImport(`${this.root}\\${edit.path}`, edit.key);
            }

        });
    }

    static editImport(file, newKey) {
        let jsFile = fs.readFileSync(file).toString();
        let bodyJs = acorn.parse(jsFile).body;
        bodyJs = bodyJs.filter(statement => statement.expression.type === 'AssignmentExpression')
            .filter(aExp => aExp.expression.left.object.name === 'module')
            .filter(aExp => aExp.expression.left.property.name === 'exports')
            .find(aExp => aExp.expression.right.type === 'ObjectExpression');

        if(bodyJs) {
            const properties = bodyJs.expression.right.properties;
            let position = 0;
            let comma = '';
            if(properties.length) {
                position = properties[properties.length - 1].end;
                comma = ',';
            } else {
                position = bodyJs.expression.right.start + 1;
            }

            let lasString = ImportManager.editString(jsFile, `${comma}${newKey}`, position);
            lasString = beautify(lasString, { indent_size: 4, space_in_empty_paren: true});
            fs.writeFileSync(file, lasString);

        }

    }

    editRouteBuilder(filePath, key) {
        let jsFile = fs.readFileSync(filePath).toString();
        let bodyJs = acorn.parse(jsFile).body;

        bodyJs = bodyJs.filter(statement => statement.type === 'ClassDeclaration')
            .find(statement => statement.id.name === 'RouterBuilder');

        bodyJs = bodyJs.body.body;
        bodyJs = bodyJs.filter(ele => ele.type === 'MethodDefinition')
            .find(ele => ele.key.name === 'build');

        if(bodyJs) {
            let position = 0;
            bodyJs = bodyJs.value.body;

            if(bodyJs.body.length) {
                position = bodyJs.body[bodyJs.body.length - 1].end;
            } else {
                position = bodyJs.start + 1;
            }

            let lasString = ImportManager.editString(jsFile, key, position);
            lasString = beautify(lasString, { indent_size: 4, space_in_empty_paren: true });
            fs.writeFileSync(filePath, lasString);
        }

    }

    static editString(principal, stringToInsert, position) {
        return [principal.slice(0, position), stringToInsert, principal.slice(position)].join('');

    }
}

module.exports = ImportManager;
