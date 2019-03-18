
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
