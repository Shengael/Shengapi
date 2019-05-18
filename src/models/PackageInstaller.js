'use strict';

const _      = require('lodash');
const config = require('../../Config/default.json');

const logger = require('../utils').Logger;
const shell  = require('shelljs');
const fs     = require('fs');

class PackageInstaller {

    constructor(project) {
        this.project = project;
    }

    run() {
        if (!this.project.auto) {
            if (!this.doInstalls()) return false;
        } else {
            if (!this.doAutomaticInstalls()) return false;
        }

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

        return true;

    }

    doAutomaticInstalls() {
        let installs = config.global.installs;
        if (this.project.auto === 'sequelize') installs = _.merge(installs, config.sequelize.installs);
        else if (this.project.auto === 'mongoose') installs = _.merge(installs, config.mongoose.installs);

        _.forEach(installs, install => {
            this.install(install.array, install.options);
        });

        return this.editPackageJson('scripts', 'dev', 'nodemon src/index.js');


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

module.exports = PackageInstaller;
