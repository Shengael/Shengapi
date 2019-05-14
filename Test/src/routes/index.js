'use strict';


class RouterBuilder {

    build(app) {
        app.use('/user', require('./User.route'));
        app.use('/tuser', require('./Tuser.route'));
        app.use('/toto', require('./Toto.route'));
    }

}

module.exports = new RouterBuilder();