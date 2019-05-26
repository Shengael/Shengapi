'use strict';

const models = require('../models');
const Controller = require('../Controller');
const $Model$ = models.$Model$;

class $controller$ extends Controller{

    constructor() {
        super($Model$);
    }

    async create($attributesList$) {
        let new$Model$ = new $Model$({
            $attributesJSON$
        });
        await new$Model$.save();
    }

    async update(id, fields) {
        let $model$ = await this.getById(id);
        return await super.update($model$, fields);
    }

    async delete(id) {
        let $model$ = await this.getById(id);
        return await super.delete($model$);
    }

}

module.exports = new $controller$();
