const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ImageSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId: String,
    imageName: String,
    size: Number,
    generatedName: String,
    path: String,
})

module.exports = mongoose.model('Image', ImageSchema);