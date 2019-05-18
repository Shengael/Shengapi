'use strict';

const models = require('../models');
const $Model$ = models.$Model$;

class $controller$ {

    constructor() {

    }

    async create(email,password) {
        let new$Model$ = new $Model$({
            $attributesJSON$
        });
        await new$Model$.save();
    }

    async getAll() {
        let $model$s = await $Model$.find({},'email name firstname phone_number address postal city is_deleted rank language');
        return $model$s;
    }

    async getById(id) {
        return await $Model$.findOne({id});

    }

    async update(id, $attributesList$) {

        let $model$ = await this.getById(id);
        if($model$ === undefined){
            return undefined;
        }
        // password = password === undefined ? user.password : password;

        $model$ = await $Model$.findOneAndUpdate(
            {
                id: id
            },{
                $set:{
                    $attributesJSON$
                }
            },{
                new : false
            });
        return $model$;
    }

    async delete(id) {
        let $model$ = await this.getById(id);
        if($model$ === undefined){
            return undefined;
        }

        await $model$.remove({id});
    }

}

module.exports = new $controller$();
