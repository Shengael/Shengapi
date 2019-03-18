
function initOptionsYarg() {
    return (yargs) => {
        return yargs.option('n', {
            alias: 'name',
            type: 'string',
            demand: 'Please specify the project name',
            nargs: 1,
            describe: 'Project name'
        }).option('i', {
            alias: 'install',
            type: 'array',
            describe: 'Packages to install'
        }).option('d', {
            alias: 'devinstall',
            type: 'array',
            describe: 'Dev Packages to install'
        }).option('a', {
            alias: 'auto',
            type: 'string',
            nargs: 1,
            describe: 'create basic structure for api (-a mongoose || -a sequelize)'
        }).option('v', {
            alias: 'verbose',
            type: 'count',
            nargs: 1,
            describe: 'verbose level'
        }).help('h')
            .alias('h', 'help')
            .usage('Usage: shengapi init -n project Name [-i] [-d] [-a] [-v]');
    };
}

module.exports = initOptionsYarg();


function initOptionsYarg() {
    return (yargs) => {
        return yargs.option('n', {
            alias: 'name',
            type: 'string',
            demand: 'Please specify the element name',
            nargs: 1,
            describe: 'Element name'
        }).option('a', {
            alias: 'attributes',
            type: 'array',
            describe: 'model attributes (name:string age:number ...)'
        }).option('v', {
            alias: 'verbose',
            type: 'count',
            nargs: 1,
            describe: 'verbose level'
        }).help('h')
            .alias('h', 'help')
            .usage('Usage: shengapi init -n project Name [-i] [-d] [-a] [-v]');
    };
}

module.exports = initOptionsYarg();

// element = element
//     .usage('Usage: shengapi generate -n project Name [-v]')
//     .command('generate', 'generate new element')
//     .alias('n', 'name')
//     .string('name')
//     .describe('n', 'element name')
//     .alias('a', 'attributes')
//     .array('attributes')
//     .describe('attributes', 'model attributes')
//     .alias('v', 'verbose')
//     .count('verbose')
//     .nargs('v', 0)
//     .describe('v', 'verbose level')
//     .demandOption(['n'])
//     .help('h')
//     .alias('h', 'help');
