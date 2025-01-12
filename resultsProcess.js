export function showResults() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '<h2>Ваши результаты:</h2>';
    results.forEach((result, index) => {
        quizContainer.innerHTML += `<p>Вопрос ${index + 1}: ${result}</p>`;
    });
    document.getElementById('submit-results').style.display = 'block';
    document.getElementById('share-container').style.display = 'block';
    document.getElementById('share-vk').style.display = 'block'; // Показываем кнопку "Поделиться в VK"
}

export function selectAnswer(selected, correct) {
    userAnswers.push({ selected, correct }); // Сохраняем ответ пользователя
}

export function sendResults() {
    const resultsToSend = userAnswers.map((answer, index) => {
        return `Вопрос ${index + 1}: Вы выбрали "${answer.selected}", правильный ответ: "${answer.correct}"`;
    }).join('\n');

    // Форматируем данные в JSON
    const dataToSend = JSON.stringify({ resultsToSend });

    // Отправляем данные в бот
    Telegram.WebApp.sendData(dataToSend);
}
