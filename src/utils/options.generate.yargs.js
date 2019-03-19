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
            nargs: 0,
            describe: 'verbose level'
        }).help('h')
            .alias('h', 'help')
            .usage('Usage: shengapi generate -n element Name [-a] [-v]');
    };
}

module.exports = initOptionsYarg();
