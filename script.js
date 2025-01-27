let currentQuestionIndex = 0;
let results = [];
let userAnswers = [];
let questions = [];

fetch('questions.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Сеть ответила с ошибкой: ' + response.status);
        }
        return response.json(); // Преобразуем ответ в JSON
    })
    .then(data => {
        questions = data; // Присваиваем загруженные данные переменной questions
        displayQuestion(); // Вызываем функцию для отображения вопроса
    })
    .catch(error => {
        console.error('Произошла ошибка при загрузке вопросов:', error);
    });


function displayQuestion() {
    const quizContainer = document.getElementById('quiz-page');
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        quizContainer.innerHTML = `<h2>${currentQuestion.question}</h2>`;
        currentQuestion.options.forEach(option => {
            quizContainer.innerHTML += `<button onclick="checkAnswer('${option}')">${option}</button>`;
        });
    } else {
        quizContainer.innerHTML = '<h2>Нет доступных вопросов.</h2>';
    }
}


function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    results.push(selectedOption);
    selectAnswer(userAnswers, selectedOption, currentQuestion.answer);
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const quizContainer = document.getElementById('quiz-page');
    quizContainer.innerHTML = '<h2>Ваши результаты:</h2>';
    results.forEach((result, index) => {
        quizContainer.innerHTML += `<p>Вопрос ${index + 1}: ${result}</p>`;
    });
    document.getElementById('finish-button').style.display = 'block';
    document.getElementById('share-container').style.display = 'block';
    document.getElementById('share-vk').style.display = 'block'; // Показываем кнопку "Поделиться в VK"
}

function selectAnswer(userAnswers, selected, correct) {
    userAnswers.push({ selected, correct }); // Сохраняем ответ пользователя
}

function sendResults(userAnswers) {
    const resultsToSend = userAnswers.map((answer, index) => {
        return `Вопрос ${index + 1}: Вы выбрали "${answer.selected}", правильный ответ: "${answer.correct}"`;
    }).join('\n');

    // Форматируем данные в JSON
    const dataToSend = JSON.stringify({ resultsToSend });

    // Отправляем данные в бот
    Telegram.WebApp.sendData(dataToSend);
}

document.getElementById('finish-button').onclick = sendResults(userAnswers);

document.getElementById('share-vk').onclick = function() {
    const title = "Я прошел квиз!";
    const description = "Посмотрите, как я справился с вопросами! Присоединяйтесь к квизу и проверьте свои знания.";
    const url = encodeURIComponent(window.location.href); // URL вашего квиза
    const shareUrl = `https://vk.com/share.php?url=${url}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;
    
    window.open(shareUrl, '_blank');
};

displayQuestion();


