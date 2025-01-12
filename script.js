import { showResults, selectAnswer, sendResults } from './resultsProcess.js'

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
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
        const quizContainer = document.getElementById('quiz-container');
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
    selectAnswer(selectedOption, currentQuestion.answer);
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

document.getElementById('submit-results').onclick = sendResults;

document.getElementById('share-vk').onclick = function() {
    const title = "Я прошел квиз!";
    const description = "Посмотрите, как я справился с вопросами! Присоединяйтесь к квизу и проверьте свои знания.";
    const url = encodeURIComponent(window.location.href); // URL вашего квиза
    const shareUrl = `https://vk.com/share.php?url=${url}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;
    
    window.open(shareUrl, '_blank');
};

displayQuestion();
