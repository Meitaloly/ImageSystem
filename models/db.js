const mongoose = require('mongoose');
const path = require('path');
const root = path.join(__dirname, '../');

if (!process.env.DB_CONNECTION_STRING) {
    require('custom-env').env(process.env.NODE_ENV, root)
}

mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true, useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
mongoose.Promise = global.Promise;

db.once('open', () => {
    console.log("DB connected successfuly")
});
db.on('error', err => {
    console.log(err);
});

module.exports = {
    Image: require('./image/imageSchema.js'),
};