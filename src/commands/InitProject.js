'use strict';

// PACKAGE NPM
const fs               = require('fs');
const logger           = require('../utils').Logger;
const shell            = require('shelljs');
// CLASS IMPORTED
const Project          = require('../models/Project');
const Tree             = require('../models/Tree');
const PackageInstaller = require('../models/PackageInstaller');
// JSON CONFIGURATION
const config           = require('../../Config/default.json');
const _                = require('lodash');


class InitProject {

    /**
     *
     * @param {Object} argv result of Yargs
     * @param WORKING_DIR
     * @param SCRIPT_DIR
     */
    constructor(argv, WORKING_DIR, SCRIPT_DIR) {
        this.project          = new Project(argv, WORKING_DIR, SCRIPT_DIR);
        this.tree             = new Tree(this.project.name, `${this.project.templateDir}\\init`, this.project.srcDir);
        this.packageInstaller = new PackageInstaller(this.project);
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
        if (!this.packageInstaller.editPackageJson('scripts', 'start', 'node src/index.js')) {
            return false;
        }
        if (!this.createStructDev()) {
            return false;
        }

        if(!this.packageInstaller.run()) return false;

        if (this.project.auto) {
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

        this.tree.createDir(`${this.project.dir}\\`, struct);

        return true;
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
}


module.exports = InitProject;
