'use strict';
const fs = require('fs');
const acorn = require('acorn');
const beautify = require('js-beautify').js;

class GenerateProject {

    constructor(argv, WORKING_DIR, SCRIPT_DIR) {
        this.name = argv.name;
        this.script_dir = SCRIPT_DIR;
        this.projectDir = WORKING_DIR;
        this.srcDir = `${this.projectDir}\\src`;
        this.modelsDir = `${this.srcDir}\\models`;
        this.controllersDir = `${this.srcDir}\\controllers`;
        this.routesDir = `${this.srcDir}\\routes`;
        this.template = `${this.script_dir}\\templates\\generate`
    }

    generate() {
        if (!this.checkName()) return false;

        let controller = fs.readFileSync(`${this.template}\\controller.js`).toString();
        controller = controller.replace(/\$model\$/g, `${this.name}`);
        controller = controller.replace(/\$controllerName\$/g, `${this.name}Controller`);
        const controllerPath = `${this.controllersDir}\\${this.name}.controller.js`;
        fs.writeFileSync(controllerPath, controller);

        let model = fs.readFileSync(`${this.template}\\model.js`).toString();
        model = model.replace(/\$modelName\$/g, `${this.name}`);
        const modelPath = `${this.modelsDir}\\${this.name}.js`;
        fs.writeFileSync(modelPath, model);

        let route = fs.readFileSync(`${this.template}\\route.js`).toString();
        route = route.replace(/\$model\$/g, `${this.name.toString().toLowerCase()}s`);
        route = route.replace(/\$controller\$/g, `${this.name}Controller`);
        route = route.replace(/\$name\$/g, `${this.name.toString().toLowerCase()}`);
        const routePath = `${this.routesDir}\\${this.name}.route.js`;
        fs.writeFileSync(routePath, route);

        this.addFilesToImport();
        this.editRouteBuilder();
    }

    checkName() {
        return this.name.length;
    }

    addFilesToImport() {
        this.editImport(`${this.modelsDir}\\index.js`, `${this.name}: require('./${this.name}')`);
        this.editImport(`${this.controllersDir}\\index.js`, `${this.name}Controller: require('./${this.name}.controller')`);
    }

    editImport(file, newKey) {

        let jsFile = fs.readFileSync(file).toString();
        let bodyJs = acorn.parse(jsFile).body;
        bodyJs = bodyJs.filter(statement => statement.expression.type === 'AssignmentExpression')
            .filter(aexp => aexp.expression.left.object.name === 'module')
            .filter(aexp => aexp.expression.left.property.name === 'exports')
            .find(aexp => aexp.expression.right.type === 'ObjectExpression');

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

            let lasString = this.editString(jsFile, `${comma}${newKey}`, position);
            lasString = beautify(lasString, { indent_size: 4, space_in_empty_paren: true });
            fs.writeFileSync(file, lasString);

        }

    }

    editRouteBuilder() {
        let jsFile = fs.readFileSync(`${this.routesDir}\\index.js`).toString();
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

            let lasString = this.editString(jsFile, `app.use('/${this.name.toString().toLowerCase()}', require('./${this.name}.route'));`, position);
            lasString = beautify(lasString, { indent_size: 4, space_in_empty_paren: true });
            fs.writeFileSync(`${this.routesDir}\\index.js`, lasString);
        }

    }


    editString(principal, stringToInsert, position) {
        return [principal.slice(0, position), stringToInsert, principal.slice(position)].join('');

    }
}


module.exports = GenerateProject;
