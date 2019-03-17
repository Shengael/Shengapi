'use strict';

const chalk = require('chalk');
class Logger {

    constructor() {
        this.verbose_level = 0;
    }

    setVerboseLevel(verbose_level){
        this.verbose_level = verbose_level;
    }

    ERROR(){
        arguments[0] = `${chalk.black.bgRed('ERROR')}: ${chalk.red(arguments[0])}`;
        this.verbose_level >= 0 && console.log.apply(console, arguments);
    }

    WARN() {
        arguments[0] = `${chalk.black.bgYellow('WARN')}: ${chalk.yellow(arguments[0])}`;
        this.verbose_level >= 1 && console.log.apply(console, arguments);
    }

    INFO() {
        arguments[0] = `${chalk.black.bgGreen('INFO')}: ${chalk.green(arguments[0])}`;
        this.verbose_level >= 2 && console.log.apply(console, arguments);
    }
}


module.exports = new Logger();
