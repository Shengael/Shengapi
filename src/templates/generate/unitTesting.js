'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');
const logger = require('../../utils').Logger;


dotenv.config();
let $model$Controller;
let $model$;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    $model$Controller = require('./$Model$.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('$Model$ Controller', () => {
    describe('#create()', () => {
        it('should return new $Model$', async () => {
            const $model$ = await $model$Controller.create(/**/);
            expect($model$).to.not.be.undefined;

        });
    });
    describe('#getAll()', () => {
        it('should return $Model$ array', async () => {
            const $model$s = await $model$Controller.getAll();
            expect($model$s).to.be.an('array');
            expect($model$s).to.have.length(1);
        });
    });

    describe('#getById()', () => {
        it('should return an $Model$', async () => {

            const $model$ = await $model$Controller.getById(/**/);
            expect($model$).to.not.be.undefined;
        });

        it('should return undefined', async () => {
            const $model$ = await $model$Controller.getById(/**/);
            expect($model$).to.be.null;
        });
    });

    describe('#update()', () => {
        it('should return $Model$ updated', async () => {
            const fields = {
                name: 'Luis'
            };
            const $model$ = await $model$Controller.update(/**/, fields);
            expect($model$).to.not.be.undefined;
            expect($model$.name).to.be.equal(fields.name);
        });

        it('should return undefined', async () => {
            const fields = {
                name: 'Luis'
            };
            const $model$ = await $model$Controller.update(/**/, fields);
            expect($model$).to.be.undefined;
        });

    });

    describe('#delete()', () => {
        it('should return null', async () => {
            const $model$ = await $model$Controller.delete(/**/);
            expect($model$).to.be.null;
        });
    });

} );

after(async function() {
    await mongoose.connection.collections.$Model$.drop();
    mongoose.connection.close();
});
