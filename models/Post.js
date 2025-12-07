// models/Post.js
const mongoose = require('mongoose'); // Підключення бібліотеки Mongoose

// Визначення схеми (структури) для колекції "Post" у MongoDB
const PostSchema = new mongoose.Schema({
    // Заголовок: обов'язковий рядок
    title: { type: String, required: true }, 
    // Опис: обов'язковий рядок
    description: { type: String, required: true }, 
    // Автор: обов'язковий рядок, за замовчуванням 'Анонім'
    author: { type: String, required: true, default: 'Анонім' }, 
    // Дата створення: автоматично встановлюється поточною датою
    createdAt: { type: Date, default: Date.now } 
    // Поле _id тут не потрібне! Mongoose створить його сам.
});

// Експорт моделі 'Post' для використання в контролерах
module.exports = mongoose.model('Post', PostSchema);