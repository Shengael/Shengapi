'use strict';

const fs = require('fs');
const logger = require('../utils').Logger;
const shell = require('shelljs');


class InitProject {

    constructor(argv, WORKING_DIR, SCRIPT_DIR){
        this.name = argv.name;
        this.installs = argv.install;
        this.installDevs = argv.installDev;
        this.script_dir = SCRIPT_DIR;
        this.parentDir = WORKING_DIR;
        this.projectDir = `${this.parentDir}\\${this.name}`;
        this.srcDir = `${this.projectDir}\\src`;
        this.modelsDir = `${this.srcDir}\\models`;
        this.controllersDir = `${this.srcDir}\\controllers`;
        this.routesDir = `${this.srcDir}\\routes`;
        this.auto = argv.auto && argv.auto.length ? argv.auto : false;
    }

    init() {

        if(!this.name.length) {
            logger.ERROR('invalid project name');
            return false;
        }
        if(this.auto !== 'mongoose' && this.auto !== 'sequelize' && this.auto) {
            logger.ERROR("-a mongoose or -a sequelize");
            return false;
        }

        if(!this.createProject()){
            return false;
        }
        if(!this.initProject()){
            return false;
        }
        if(!this.editPackageJson('scripts', 'start', 'node src/index.js')){
            return false;
        }
        if (!this.createStructDev()) {
            return false;
        }

        if(!this.auto) {
            this.doInstalls();
        } else {
            this.doAutomaticInstalls();
            this.generateAutomaticFiles();
            this.env();
        }

        this.gitIgnore();
    }

    createProject() {
        if (!fs.existsSync(this.projectDir)){
            logger.INFO(`creating ${this.name} project`);
            fs.mkdirSync(this.projectDir);
        } else {
            logger.ERROR(`${this.projectDir} already exist`);
            return false;
        }
        return true;
    }

    initProject() {
        shell.cd(this.projectDir);
        logger.INFO(`npm init`);
        if (shell.exec('npm init --force > nul 2>&1').code !== 0) {
            logger.ERROR(`npm init failed`);
            shell.exit(1);
            return false;
        }
        return true;
    }

    createStructDev() {
        logger.INFO(`creating structure project`);
        fs.mkdirSync(this.srcDir);
        fs.mkdirSync(this.modelsDir);
        fs.mkdirSync(this.controllersDir);
        fs.mkdirSync(this.routesDir);

        if(!fs.existsSync(this.srcDir) || !fs.existsSync(this.modelsDir) || !fs.existsSync(this.controllersDir) || !fs.existsSync(this.routesDir)) {
            logger.ERROR(`one of the directories [src, models, controllers, routers] was not created`);
            return false;
        }

        fs.writeFileSync(`${this.modelsDir}\\index.js`, "'use strict';");
        fs.writeFileSync(`${this.controllersDir}\\index.js`, "'use strict';");
        fs.writeFileSync(`${this.routesDir}\\index.js`, "'use strict';");
        fs.writeFileSync(`${this.srcDir}\\index.js`, "'use strict';");
        return true;
    }

    doInstalls() {

        if(this.installs) {
            this.install(this.installs, '');
        }

        if(this.installDevs){
            this.install(this.installDevs, '--save-dev');
            if(this.installDevs.find(i => i === 'nodemon')) {
                if(!this.editPackageJson('scripts', 'dev', 'nodemon src/index.js')){
                    return false;
                }
            }
        }

    }

    doAutomaticInstalls() {
        const installs = ['express', 'morgan', 'dotenv', 'body-parser'];
        const devInstalls = ['nodemon', '@types/express', '@types/morgan', "@types/dotenv", "@types/body-parser"];

        if(this.auto === 'mongoose') {
            installs.push('mongoose');
            devInstalls.push('@types/mongoose');
        } else if(this.auto === 'sequelize') {
            installs.push('mysql2', 'sequelize');
            devInstalls.push('@types/mysql2', '@types/sequelize');
        }

        this.install(installs, '');
        this.install(devInstalls, '--save-dev');

        if(!this.editPackageJson('scripts', 'dev', 'nodemon src/index.js')){
            return false;
        }
    }

    generateAutomaticFiles() {

        const initTemplatePath = `${this.script_dir}\\templates\\init`;
        let content = fs.readFileSync(`${initTemplatePath}\\index.js`).toString();
        fs.writeFileSync(`${this.srcDir}\\index.js`, content);
        content = fs.readFileSync(`${initTemplatePath}\\controller.js`).toString();
        fs.writeFileSync(`${this.controllersDir}\\index.js`, content);
        content = fs.readFileSync(`${initTemplatePath}\\models.js`).toString();
        fs.writeFileSync(`${this.modelsDir}\\index.js`, content);
        content = fs.readFileSync(`${initTemplatePath}\\route.js`).toString();
        fs.writeFileSync(`${this.routesDir}\\index.js`, content);
    }

    env() {
        let envString = '';
        const templatePath = `${this.script_dir}\\templates`;
        if(this.auto === 'mongoose') {
            envString = fs.readFileSync(`${templatePath}\\.envm`).toString();
        } else if (this.auto === 'sequelize') {
            envString = fs.readFileSync(`${templatePath}\\.envs`).toString();
        }

        fs.writeFileSync(`${this.projectDir}\\.env`, envString);

        return true;
    }

    gitIgnore() {
        const templatePath = `${this.script_dir}\\templates`;
        const ignored = fs.readFileSync(`${templatePath}\\gitignore`).toString();

        fs.writeFileSync(`${this.projectDir}\\.gitignore`, ignored);
    }

    install(installs, mode) {

        installs.map(install => {
            logger.INFO(`installing ${install} !`);
            if (shell.exec(`npm i ${install} ${mode}  > nul 2>&1`).code !== 0) {
                logger.WARN(`${install} install failed !`);
            } else {
                logger.INFO(`${install} installed !`);
            }
        });
    }

    /**
     *
     * @param firstLevel
     * @param secondLevel
     * @param newValue
     * @returns {boolean}
     */
    editPackageJson(firstLevel, secondLevel, newValue) {
        logger.INFO(`adding ${secondLevel} parameter in package.json`);
        if(!fs.existsSync(`${this.projectDir}\\package.json`)){
            logger.ERROR(`${this.projectDir}\\package.json doesn't exist`);
            return false;
        }

        const packageJson = fs.readFileSync(`${this.projectDir}\\package.json`);
        const configs = JSON.parse(packageJson.toString());
        configs[firstLevel][secondLevel] = newValue;
        fs.writeFileSync(`${this.projectDir}\\package.json`, JSON.stringify(configs, null, 4));

        return true;
    }
}



module.exports = InitProject;
