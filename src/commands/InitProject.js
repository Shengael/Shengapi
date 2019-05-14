'use strict';


const fs              = require('fs');
const logger          = require('../utils').Logger;
const shell           = require('shelljs');
const Project         = require('../models/Project');
const TemplateBuilder = require('../models/TemplateBuilder');
const config          = require('../../Config/default.json');
const templateRules   = require('../../Config/template.json');
const _               = require('lodash');

/**
 *
 */
class InitProject {

    /**
     *
     * @param {Object} argv result of Yargs
     * @param WORKING_DIR
     * @param SCRIPT_DIR
     */
    constructor(argv, WORKING_DIR, SCRIPT_DIR) {
        this.command         = "init";
        this.project         = new Project(argv, WORKING_DIR, SCRIPT_DIR);
        this.templateBuilder = new TemplateBuilder(templateRules, this.project.name);
    }

    createDir(current, struct) {
        _.forEach(struct, dir => {
            const newCurrent = `${current}${dir.name}\\`;
            console.log(`create ${newCurrent}`);
            fs.mkdirSync(newCurrent);
            if (dir.files) this.createFiles(newCurrent, dir.files);
            if (dir.templates) this.createTemplates(newCurrent, dir.templates);
            if (dir.directories) this.createDir(newCurrent, dir.directories);
        });
    }

    createFiles(current, filesArray) {
        _.forEach(filesArray, f => {
            this.createFile(current, f);
        });
    }

    createFile(current, name) {
        fs.writeFileSync(`${current}${name}`, "'use strict';");
        return true;
    }

    createTemplates(current, templatesArray) {
        _.forEach(templatesArray, t => {
            this.createTemplate(current, t);
        });
    }

    createTemplate(current, template) {
        const templatePath = `${this.project.templateDir}\\${this.command}\\${template.name}`;
        if (fs.existsSync(templatePath)) {
            console.log(`create template on ${current}${template.dest}`);
            fs.writeFileSync(`${current}${template.dest}`, this.templateBuilder.apply(templatePath));
        }
    }


    execute() {
        if (!this.project.name.length) {
            logger.ERROR('invalid project name');
            return false;
        }
        if (this.project.auto !== 'mongoose' && this.project.auto !== 'sequelize' && this.project.auto) {
            logger.ERROR("-a mongoose or -a sequelize");
            return false;
        }

        if (!this.createProject()) {
            return false;
        }
        if (!this.initProject()) {
            return false;
        }
        if (!this.editPackageJson('scripts', 'start', 'node src/index.js')) {
            return false;
        }
        if (!this.createStructDev()) {
            return false;
        }

        if (!this.project.auto) {
            this.doInstalls();
        } else {
            this.doAutomaticInstalls();
            this.generateAutomaticFiles();
            this.env();
        }

        this.gitIgnore();
    }

    createProject() {
        if (!fs.existsSync(this.project.dir)) {
            logger.INFO(`creating ${this.project.name} project`);
            fs.mkdirSync(this.project.dir);
        } else {
            logger.ERROR(`${this.project.dir} already exist`);
            return false;
        }
        return true;
    }

    initProject() {
        shell.cd(this.project.dir);
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

        let struct = config.global.environment.directories;
        if (this.project.auto) {
            if (this.project.auto === 'sequelize') struct = _.merge(struct, config.sequelize.environment.directories);
            if (this.project.auto === 'mongoose') struct = _.merge(struct, config.mongoose.environment.directories);
        }

        this.createDir(`${this.project.dir}\\`, struct);

        return true;
    }

    doInstalls() {

        if (this.project.installs) {
            this.install(this.project.installs, '');
        }

        if (this.project.installDevs) {
            this.install(this.project.installDevs, '--save-dev');
            if (this.project.installDevs.find(i => i === 'nodemon')) {
                if (!this.editPackageJson('scripts', 'dev', 'nodemon src/index.js')) {
                    return false;
                }
            }
        }

    }

    doAutomaticInstalls() {
        let installs = config.global.installs;
        if(this.project.auto === 'sequelize') installs = _.merge(installs, config.sequelize.installs);
        else if(this.project.auto === 'mongoose') installs = _.merge(installs, config.mongoose.installs);

        _.forEach(installs, install => {
            this.install(install.array, install.options);
        });

        if (!this.editPackageJson('scripts', 'dev', 'nodemon src/index.js')) {
            return false;
        }
    }

    generateAutomaticFiles() {


        if (this.project.auto === 'sequelize') {
            shell.cd(this.project.srcDir);
            if (shell.exec(`sequelize init --force > nul 2>&1`).code !== 0) {
                logger.ERROR(`sequelize init failed`);
                shell.exit(1);
            }
        }

        shell.cd(this.project.parentDir);
    }

    env() {
        let envString      = '';
        const templatePath = `${this.project.script_dir}\\templates`;
        if (this.project.auto === 'mongoose') {
            envString = fs.readFileSync(`${templatePath}\\.envm`).toString();
        } else if (this.project.auto === 'sequelize') {
            envString = fs.readFileSync(`${templatePath}\\.envs`).toString();
        }

        fs.writeFileSync(`${this.project.dir}\\.env`, envString);

        return true;
    }

    gitIgnore() {
        const templatePath = `${this.project.script_dir}\\templates`;
        const ignored      = fs.readFileSync(`${templatePath}\\gitignore`).toString();

        fs.writeFileSync(`${this.project.dir}\\.gitignore`, ignored);
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
        if (!fs.existsSync(`${this.project.dir}\\package.json`)) {
            logger.ERROR(`${this.project.dir}\\package.json doesn't exist`);
            return false;
        }

        const packageJson                = fs.readFileSync(`${this.project.dir}\\package.json`);
        const configs                    = JSON.parse(packageJson.toString());
        configs[firstLevel][secondLevel] = newValue;
        fs.writeFileSync(`${this.project.dir}\\package.json`, JSON.stringify(configs, null, 4));

        return true;
    }
}


module.exports = InitProject;
