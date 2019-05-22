'use strict';
const dotenv = require('dotenv');
const test_connection = require('../../config').mongo_connection;
const mongoose = require('mongoose');


dotenv.config();
let $controller$;

const expect = require('chai').expect;


before(async function() {
    await test_connection('test');
    $controller$ = require('./User.controller');
    //await mongoose.connection.collections.User.drop();
});

describe('$Model$ Controller', () => {
    describe('#create()', () => {
        it('should return new $Model$', async () => {
            const $model$ = await $controller$.create();
            expect($model$).to.not.be.undefined;

        });
    });
    describe('#getAll()', () => {
        it('should return $Model$ array', async () => {
            const $model$s = await $controller$.getAll();
            expect($model$s).to.be.an('array');
            expect($model$s).to.have.length(1);
        });
    });

    describe('#getById()', () => {
        it('should return an $Model$', async () => {
            const $model$ = await $controller$.getById(1);
            expect($model$).to.not.be.undefined;
        });

        it('should return undefined', async () => {
            const users = await $controller$.getById(2);
            expect(users).to.be.null;
        });
    });

    describe('#update()', () => {

    });

} );

after(async function() {
    await mongoose.connection.collections.User.drop();
    mongoose.connection.close();
});
