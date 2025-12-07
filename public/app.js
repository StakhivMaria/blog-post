const postsList = document.getElementById('posts-list');
const postForm = document.getElementById('post-form');
const postIdInput = document.getElementById('post-id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const authorInput = document.getElementById('author');
const submitButton = postForm.querySelector('button[type="submit"]');
const cancelButton = document.getElementById('cancel-edit');

// --- ФУНКЦІЇ ДЛЯ ВЗАЄМОДІЇ З API ---

/**
 * Отримує всі пости з бекенду та оновлює список.
 */
async function fetchPosts() {
    try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        renderPosts(data);
    } catch (error) {
        console.error('Помилка при завантаженні постів:', error);
        postsList.innerHTML = '<p>Не вдалося завантажити пости.</p>';
    }
}

/**
 * Надсилає запит на створення або оновлення поста.
 * @param {object} postData - Дані поста.
 * @param {string | null} postId - ID поста для оновлення або null для створення.
 */
async function createOrUpdatePost(postData, postId = null) {
    const method = postId ? 'PUT' : 'POST';
    const url = postId ? `/api/posts/${postId}` : '/api/posts';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });

        if (response.ok) {
            resetForm();
            fetchPosts(); // Оновити список
        } else {
            const error = await response.json();
            alert(`Помилка: ${error.message || 'Невідома помилка'}`);
        }
    } catch (error) {
        console.error('Помилка при створенні/оновленні поста:', error);
    }
}

/**
 * Надсилає запит на видалення поста за ID.
 * @param {string} id - MongoDB _id поста.
 */
async function deletePost(id) {
    if (!confirm('Ви впевнені, що хочете видалити цей пост?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'DELETE',
        });

        if (response.status === 204) {
            fetchPosts(); 
        } else {
            const error = await response.json();
            alert(`Помилка видалення: ${error.message || 'Невідома помилка'}`);
        }
    } catch (error) {
        console.error('Помилка при видаленні поста:', error);
    }
}

/**
 * Отримує дані одного поста для заповнення форми редагування.
 * @param {string} id - MongoDB _id поста.
 */
async function fetchPostForEdit(id) {
    try {
        const response = await fetch(`/api/posts/${id}`);
        
        if (response.ok) {
            const post = await response.json();
            fillEditForm(post); 
        } else if (response.status === 404) {
            // Якщо пост не знайдено (наприклад, вже видалений)
            alert('Пост для редагування не знайдено. Оновіть сторінку.');
            fetchPosts(); // Оновити список, щоб прибрати видалений пост
        } else {
            alert('Не вдалося завантажити дані поста для редагування.');
        }
    } catch (error) {
        console.error('Помилка завантаження поста для редагування:', error);
    }
}


// --- ФУНКЦІЇ ДЛЯ УПРАВЛІННЯ ІНТЕРФЕЙСОМ ---

/**
 * Заповнює форму даними поста для редагування.
 * @param {object} post - Об'єкт поста.
 */
function fillEditForm(post) {
    postIdInput.value = post._id; 
    titleInput.value = post.title;
    descriptionInput.value = post.description;
    authorInput.value = post.author;
    submitButton.textContent = 'Оновити Пост';
    cancelButton.style.display = 'block';
    window.scrollTo(0, 0); 
}

/**
 * Скидає форму до стану "Створити".
 */
function resetForm() {
    postIdInput.value = '';
    postForm.reset();
    submitButton.textContent = 'Створити Пост';
    cancelButton.style.display = 'none';
}

/**
 * Генерує HTML-відображення списку постів.
 * @param {Array<object>} posts - Масив об'єктів постів.
 */
function renderPosts(posts) {
    postsList.innerHTML = '';
    if (posts.length === 0) {
        postsList.innerHTML = '<p>Постів поки немає. Створіть перший!</p>';
        return;
    }

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        
        // Використовуємо data-id для передачі ID в обробники подій
        postCard.innerHTML = `
            <h3>${post.title}</h3>
            <p><strong>Автор:</strong> ${post.author}</p>
            <p>${post.description}</p>
            <div class="post-actions">
                
                <button class="edit-btn" data-id="${post._id}">Редагувати</button>
                
                <button class="delete-btn" data-id="${post._id}">Видалити</button>
            </div>
        `;
        postsList.appendChild(postCard);
    });
}

// --- ОБРОБНИКИ ПОДІЙ ---

// 1. Обробка відправки форми (Створити/Оновити)
postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = postIdInput.value; 
    const postData = {
        title: titleInput.value,
        description: descriptionInput.value,
        author: authorInput.value,
    };

    createOrUpdatePost(postData, id || null);
});

// 2. Обробка скасування редагування
cancelButton.addEventListener('click', resetForm);


// 3. ГЛОБАЛЬНИЙ ОБРОБНИК для Редагування та Видалення
document.addEventListener('DOMContentLoaded', () => {
    fetchPosts(); // 1. Завантажити пости
    
    // 2. Встановлюємо обробник кліків на батьківському контейнері postsList
    postsList.addEventListener('click', (e) => {
        const target = e.target;
        // Зчитуємо ID з data-атрибуту
        const postId = target.dataset.id;
        
        // Перевіряємо, чи клік був на кнопці з data-id
        if (!postId) return; 

        if (target.classList.contains('delete-btn')) {
            // ЛОГІКА ВИДАЛЕННЯ
            deletePost(postId);
            
        } else if (target.classList.contains('edit-btn')) {
            // ЛОГІКА РЕДАГУВАННЯ
            fetchPostForEdit(postId); 
        }
    });
});