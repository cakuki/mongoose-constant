var should = require('should');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = require('./support/db');


describe('mongoose-constant', function() {
    var constantPlugin = require('../');

    before(db.connect);
    afterEach(db.reset);

    it('should export a function', function() {
        constantPlugin.should.be.an.instanceOf(Function);
    });

    it('should not throw an exception when used', function(done) {
        (function() {
            var FooSchema = new Schema({
                string: { type: String, constant: true },
                number: { type: Number, constant: true }
            });
            FooSchema.plugin(constantPlugin);
            var Foo = mongoose.model('Foo', FooSchema);

            new Foo({
                string: 'test',
                number: 1337
            }).save(done);
        }).should.not.throw();
    });

    it('should throw an exception when used on Object SchemaType', function() {
        should.throws(function() {
            var FooSchema = new Schema({
                string: { type: String, constant: true },
                number: { type: Number, constant: true },
                object: { type: Object, constant: true }
            });
            FooSchema.plugin(constantPlugin);
            mongoose.model('Foo', FooSchema);
        });
    });

    it('should throw an exception when used on Array SchemaType', function() {
        should.throws(function() {
            var FooSchema = new Schema({
                string: { type: String, constant: true },
                number: { type: Number, constant: true },
                object: { type: Array, constant: true }
            });
            FooSchema.plugin(constantPlugin);
            mongoose.model('Foo', FooSchema);
        });
    });

    describe('save callback', function() {
        afterEach(db.reset);

        it('should return validation error when constant marked string changed', function(done) {
            var FooSchema = new Schema({
                path1: { type: String, constant: true }
            });
            FooSchema.plugin(constantPlugin);
            var Foo = mongoose.model('Foo', FooSchema);

            var bar = new Foo({
                path1: 'test1'
            });

            bar.save(function(err, bar) {
                if (err) done(err);
                bar.path1 = 'test2';
                bar.save(function(err, bar) {
                    should.exist(err);
                    err.should.be.an.instanceOf(mongoose.Error.ValidationError);
                    err.should.have.a.property('errors');
                    err.errors.should.have.a.property('path1');
                    err.errors['path1'].should.be.an.instanceOf(mongoose.Error.ValidatorError);
                    err.errors['path1'].message.should.be.exactly('Constant `path1` cannot be changed.');
                    err.errors['path1'].path.should.be.exactly('path1');
                    err.errors['path1'].type.should.be.exactly('constant plugin');
                    done();
                });
            });
        });

        it('should return validation error when constant marked number changed', function(done) {
            var FooSchema = new Schema({
                path1: { type: Number, constant: true }
            });
            FooSchema.plugin(constantPlugin);
            var Foo = mongoose.model('Foo', FooSchema);

            var bar = new Foo({
                path1: 1
            });

            bar.save(function(err, bar) {
                if (err) done(err);
                bar.path1 = 2;
                bar.save(function(err, bar) {
                    should.exist(err);
                    err.should.be.an.instanceOf(mongoose.Error.ValidationError);
                    err.should.have.a.property('errors');
                    err.errors.should.have.a.property('path1');
                    err.errors['path1'].should.be.an.instanceOf(mongoose.Error.ValidatorError);
                    err.errors['path1'].message.should.be.exactly('Constant `path1` cannot be changed.');
                    err.errors['path1'].path.should.be.exactly('path1');
                    err.errors['path1'].type.should.be.exactly('constant plugin');
                    done();
                });
            });
        });

        it('should not return an error when constant marked string is set to same value', function(done) {
            var FooSchema = new Schema({
                path1: { type: String, constant: true }
            });
            FooSchema.plugin(constantPlugin);
            var Foo = mongoose.model('Foo', FooSchema);

            var bar = new Foo({
                path1: 'test1'
            });

            bar.save(function(err, bar) {
                if (err) done(err);
                bar.path1 = 'test1';
                bar.save(function(err, bar) {
                    should.not.exist(err);
                    done();
                });
            });
        });
    });
});
