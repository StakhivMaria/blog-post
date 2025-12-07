// controllers/postController.js
const Post = require('../models/Post');

// Отримати всі пости
exports.getPosts = async (req, res) => {
    try {
        // Знайти всі пости, відсортовані за датою створення (найновіші перші)
        const posts = await Post.find().sort({ createdAt: -1 }); 
        res.json(posts);
    } catch (err) {
        // Повернення 500 Internal Server Error у разі збою
        res.status(500).json({ message: err.message });
    }
};

// Створити новий пост
exports.createPost = async (req, res) => {
    const { title, description, author } = req.body;

    // Створення нового об'єкта моделі на основі даних запиту
    const post = new Post({ title, description, author });

    try {
        // Збереження поста у MongoDB
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        // Повернення 400 Bad Request при помилці валідації Mongoose (наприклад, відсутнє обов'язкове поле)
        res.status(400).json({ message: err.message }); 
    }
};

// Отримати пост за ID (використовується для редагування)
exports.getPostById = async (req, res) => {
    try {
        // Пошук поста за ID з URL-параметрів
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Пост не знайдено.' });
        }

        res.json(post);
    } catch (err) {
        // Обробка CastError, якщо ID має невірний формат (MongoDB ObjectId)
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Надано некоректний ID поста.' });
        }
        res.status(500).json({ message: err.message });
    }
};

// Оновити пост
exports.updatePost = async (req, res) => {
    try {
        // Знайти пост за ID та оновити його. { new: true } повертає оновлений документ.
        const post = await Post.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } 
        );

        if (!post) {
            return res.status(404).json({ message: 'Пост не знайдено' });
        }

        res.json(post);
    } catch (err) {
        // Повернення 400 Bad Request у разі помилки валідації або формату ID
        res.status(400).json({ message: err.message });
    }
};

// Видалити пост
exports.deletePost = async (req, res) => {
    try {
        // Знайти пост за ID та видалити його
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            // 404 - Пост не знайдено
            return res.status(404).json({ message: 'Пост не знайдено.' });
        }

        // 204 No Content - успішне видалення
        res.status(204).send();
    } catch (err) {
        // Обробка CastError: некоректний формат ID
        if (err.name === 'CastError') {
            console.error('Некоректний формат ID:', req.params.id);
            return res.status(400).json({ message: 'Надано некоректний ID поста.' });
        }
        
        // Всі інші помилки - 500
        console.error('Внутрішня помилка сервера при видаленні:', err.message);
        res.status(500).json({ message: 'Помилка сервера: ' + err.message });
    }
};