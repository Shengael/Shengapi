'use strict';


class RouterBuilder {

    build(app) {
        app.use('/Tbtb', require('./TbtbRoute/Tbtb.route'));
        app.use('/Tata', require('./TataRoute/Tata.route'));
    }

}

module.exports = new RouterBuilder();