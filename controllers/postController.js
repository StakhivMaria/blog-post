// controllers/postController.js
const Post = require('../models/Post');

// Отримати всі пости
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // Сортування за датою створення
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Створити новий пост
exports.createPost = async (req, res) => {
    const { title, description, author } = req.body;

    // Створення нового об'єкта моделі
    const post = new Post({ title, description, author });

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message }); // 400 Bad Request при помилці валідації
    }
};

// Оновити пост
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // {new: true} поверне оновлений документ; runValidators перевірить поля
        );

        if (!post) {
            return res.status(404).json({ message: 'Пост не знайдено' });
        }

        res.json(post);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Видалити пост
exports.deletePost = async (req, res) => {
    try {
        // Mongoose обробить ID, переданий через req.params.id
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            // 404 - Пост не знайдено (навіть якщо ID був коректний, але поста не існує)
            return res.status(404).json({ message: 'Пост не знайдено.' });
        }

        // 204 - Успішне видалення
        res.status(204).send();
    } catch (err) {
        // Якщо Mongoose не може привести ID до формату ObjectId, 
        // це CastError. Повертаємо 400 Bad Request
        if (err.name === 'CastError') {
            console.error('Некоректний формат ID:', req.params.id);
            return res.status(400).json({ message: 'Надано некоректний ID поста.' });
        }
        
        // Всі інші помилки - 500
        console.error('Внутрішня помилка сервера при видаленні:', err.message);
        res.status(500).json({ message: 'Помилка сервера: ' + err.message });
    }
};
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Пост не знайдено.' });
        }

        res.json(post);
    } catch (err) {
        // Обробка CastError (якщо ID має невірний формат)
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Надано некоректний ID поста.' });
        }
        res.status(500).json({ message: err.message });
    }
};