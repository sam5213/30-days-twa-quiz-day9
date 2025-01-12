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
