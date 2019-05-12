/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @file   This files defines the Project class.
 * @author Shengael (Luis VALDEZ).
 * @since  11.05.2019
 */

'use strict';


class Project {

    /**
     * @param {Object} argv result of Yargs
     * @param {String} argv.name defined name
     * @param {Array} argv.install defined installs
     * @param {Array} argv.installDev defined developer installs
     * @param {String} argv.auto defined mode
     * @param {String} WORKING_DIR project directory
     * @param {String} SCRIPT_DIR script directory
     */

    constructor(argv, WORKING_DIR, SCRIPT_DIR) {

        this.name = argv.name;
        this.installs = argv.install;
        this.installDevs = argv.installDev;
        this.script_dir = SCRIPT_DIR;
        this.parentDir = WORKING_DIR;
        this.dir = `${this.parentDir}\\${this.name}`;
        this.srcDir = `${this.dir}\\src`;
        this.modelsDir = `${this.srcDir}\\models`;
        this.controllersDir = `${this.srcDir}\\controllers`;
        this.templateDir = `${this.script_dir}\\templates`;
        this.routesDir = `${this.srcDir}\\routes`;
        this.auto = argv.auto && argv.auto.length ? argv.auto : false;
    }
}

module.exports = Project;
