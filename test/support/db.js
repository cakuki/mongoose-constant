var mongoose = require('mongoose');
var connected = false;

mongoose.connect(process.env.MONGO_DB_URI || 'mongodb://localhost/mongo-constant-test');

exports.connect = function(done) {
    if (connected)
        return done();

    mongoose.connection.once('open', function() {
        connected = true;
        done();
    });
    mongoose.connection.on('error', done);
};

exports.reset = function(done) {
    mongoose.models = {};
    mongoose.connection.db.dropDatabase(done);
};
