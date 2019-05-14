'use strict';
const fs = require('fs');
const acorn = require('acorn');
const beautify = require('js-beautify').js;
const logger = require('../utils').Logger;
const shell = require('shelljs');
const _ = require('lodash');
const TemplateBuilder = require('../models/TemplateBuilder');
const templateJSON = require('../../Config/template.json');
const generateJSON = require('../../Config/generate.json');

class GenerateProject {

    constructor(argv, WORKING_DIR, SCRIPT_DIR) {
        this.name = argv.name;
        this.attributes = argv.attributes;
        this.script_dir = SCRIPT_DIR;
        this.projectDir = WORKING_DIR;
        this.srcDir = `${this.projectDir}\\src`;
        this.modelsDir = `${this.srcDir}\\models`;
        this.controllersDir = `${this.srcDir}\\controllers`;
        this.routesDir = `${this.srcDir}\\routes`;
        this.template = `${this.script_dir}\\templates\\generate`;
        this.dataSource = false;
        this.templateBuilder = new TemplateBuilder(templateJSON, this.name);
    }

    generate() {
        if (!this.checkName()) return false;

        if(!this.checkProject()) return false;

        if(!this.generateTemplates()) return false;
       /* let controller = fs.readFileSync(`${this.template}\\controller.js`).toString();
        controller = controller.replace(/\$model\$/g, `${this.name}`);
        controller = controller.replace(/\$controllerName\$/g, `${this.name}Controller`);
        const controllerPath = `${this.controllersDir}\\${this.name}.controller.js`;
        fs.writeFileSync(controllerPath, this.templateBuilder.apply(`${this.template}\\controller.js`));




        let model = fs.readFileSync(`${this.template}\\model.js`).toString();


        if(this.dataSource === 'mongoose'){
            model = fs.readFileSync(`${this.template}\\model.mongoose.js`).toString();

            if(this.attributes) {
                model = this.insertAttributes(model);
            }

            model = model.replace(/\$models\$/g, `${this.name.toString().toLowerCase()}s`);
        }*/

        if(this.dataSource !== 'sequelize') {
            /*model = model.replace(/\$modelName\$/g, `${this.name}`);
            const modelPath = `${this.modelsDir}\\${this.name}.js`;
            fs.writeFileSync(modelPath, model);*/
        } else {
            const attrs = this.attributes.join(',');
            shell.cd(this.srcDir);
            if (shell.exec(`sequelize model:create --name ${this.name} --attributes ${attrs}> nul 2>&1`).code !== 0) {
                logger.ERROR(`sequelize model failed`);
                logger.ERROR(`${attrs}`);
                shell.exit(1);
            }
            shell.cd(this.projectDir);
        }

        /*let route = fs.readFileSync(`${this.template}\\route.js`).toString();
        route = route.replace(/\$model\$/g, `${this.name.toString().toLowerCase()}s`);
        route = route.replace(/\$controller\$/g, `${this.name}Controller`);
        route = route.replace(/\$name\$/g, `${this.name.toString().toLowerCase()}`);
        const routePath = `${this.routesDir}\\${this.name}.route.js`;
        fs.writeFileSync(routePath, route);*/

        this.addFilesToImport();
        this.editRouteBuilder();
    }

    checkName() {
        return this.name.length;
    }

    generateTemplates() {
        const base = `${this.projectDir}\\${generateJSON.root}\\`;
        let configJSON;
        if(this.dataSource === 'mongoose') configJSON = generateJSON.mongoose;
        else if(this.dataSource === 'sequelize') configJSON = generateJSON.sequelize;
        else return false;

        _.forEach(configJSON.create, f => {
            const fullPath = `${base}${f.path}`.replace(/\$name\$/g, this.name);
            const templatePath = `${this.template}\\${f.template}`;

            if(fs.existsSync(templatePath)){
                fs.writeFileSync(fullPath, this.templateBuilder.apply(templatePath));
            }
        });

        return true;

    }

    addFilesToImport() {
        if(this.dataSource !== 'sequelize'){
            GenerateProject.editImport(`${this.modelsDir}\\index.js`, `${this.name}: require('./${this.name}')`);
        }
        GenerateProject.editImport(`${this.controllersDir}\\index.js`, `${this.name}Controller: require('./${this.name}.controller')`);
    }

    static editImport(file, newKey) {
        console.log(file, newKey);
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

            let lasString = GenerateProject.editString(jsFile, `${comma}${newKey}`, position);
            lasString = beautify(lasString, { indent_size: 4, space_in_empty_paren: true});
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

            let lasString = GenerateProject.editString(jsFile, `app.use('/${this.name.toString().toLowerCase()}', require('./${this.name}.route'));`, position);
            lasString = beautify(lasString, { indent_size: 4, space_in_empty_paren: true });
            fs.writeFileSync(`${this.routesDir}\\index.js`, lasString);
        }

    }

    insertAttributes(JSString) {
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

    }


    checkProject() {
        if(!fs.existsSync(this.controllersDir)) {
            logger.ERROR(`${this.controllersDir} doesn't exist`);
            return false;
        }

        if(!fs.existsSync(this.modelsDir)) {
            logger.ERROR(`${this.modelsDir} doesn't exist`);
            return false;
        }

        if(!fs.existsSync(this.routesDir)) {
            logger.ERROR(`${this.routesDir} doesn't exist`);
            return false;
        }

        if(!fs.existsSync(`${this.routesDir}\\index.js`)) {
            logger.ERROR(`${this.routesDir}\\index.js doesn't exist`);
            return false;
        }

        if(!fs.existsSync(`${this.modelsDir}\\index.js`)) {
            logger.ERROR(`${this.modelsDir}\\index.js doesn't exist`);
            return false;
        }

        if(!fs.existsSync(`${this.controllersDir}\\index.js`)) {
            logger.ERROR(`${this.controllersDir}\\index.js doesn't exist`);
            return false;
        }

        const packageJson = fs.readFileSync(`${this.projectDir}\\package.json`);
        const configs = JSON.parse(packageJson.toString());

        if(configs.dependencies && configs.dependencies.mongoose) {
            this.dataSource = 'mongoose';
            logger.INFO('DataSource Mongoose detected');
        }

        if(configs.dependencies && configs.dependencies.sequelize) {
            if(this.dataSource === 'mongoose') {
                logger.WARN('DataSource Mongoose detected first, so Sequelize ignored');
            } else {
                this.dataSource = 'sequelize';
            }
        }

        return true;
    }

    static editString(principal, stringToInsert, position) {
        return [principal.slice(0, position), stringToInsert, principal.slice(position)].join('');

    }
}


module.exports = GenerateProject;
