// models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true, default: 'Анонім' },
    createdAt: { type: Date, default: Date.now }
    // Поле _id тут не потрібне! Mongoose створить його сам.
});

module.exports = mongoose.model('Post', PostSchema);