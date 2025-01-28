class Quiz {
    constructor() {
        this.currentQuestionIndex = 0;
        this.currentQuestion = 0;
        this.answers = [];
        this.results = [];
        this.userAnswers = [];
        this.questions = [];
	this.correctAnswersCount = 0;
	this.incorrectAnswersCount = 0;  
        this.init();
    }

    async init() {
        // Welcome page
        document.getElementById('start-button').addEventListener('click', () => this.startQuiz());
	document.getElementById('finish-button').addEventListener('click', () => this.sendResults());

        // Create SVG icons
        this.icons = [
            this.createIcon('circle', '#3b82f6'),
            this.createIcon('square', '#22c55e'),
            this.createIcon('triangle', '#eab308'),
            this.createIcon('x', '#ef4444')
        ];

        // Загрузка вопросов из JSON-файла
        await this.loadQuestions();
    }

    async loadQuestions() {
        try {
            const response = await fetch('./questions.json');
            if (!response.ok) {
                throw new Error('Сеть ответила с ошибкой: ' + response.status);
            }
            this.questions = await response.json(); // Присваиваем загруженные данные переменной questions
        } catch (error) {
            console.error('Произошла ошибка при загрузке вопросов:', error);
        }
    }

    createIcon(type, color) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', color);
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');

        let path = '';
        switch(type) {
            case 'circle':
                path = 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z';
                break;
            case 'square':
                path = 'M3 3h18v18H3z';
                break;
            case 'triangle':
                path = 'M3 20h18L12 4z';
                break;
            case 'x':
                svg.innerHTML = '<path d="M18 6L6 18M6 6l12 12"/>';
                return svg;
        }

        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', path);
        svg.appendChild(pathElement);
        return svg;
    }

    startQuiz() {
        document.getElementById('welcome-page').classList.remove('active');
        document.getElementById('welcome-page').style.display = 'none';
        document.getElementById('quiz-page').classList.add('active');
        this.showQuestion();
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion];
        document.getElementById('question-text').textContent = question.question;

        const optionsGrid = document.getElementById('options-grid');
        optionsGrid.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';

            const iconClone = this.icons[index].cloneNode(true);
            iconClone.classList.add('option-icon');

            const textElement = document.createElement('span');
            textElement.textContent = option;

            optionElement.appendChild(iconClone);
            optionElement.appendChild(textElement);

            optionElement.addEventListener('click', () => this.selectAnswer(index));
            optionsGrid.appendChild(optionElement);
        });
    }

    selectAnswer(index) {
        this.answers[this.currentQuestion] = index;

        const selected = this.questions[this.currentQuestion].options[index];
        const correct = this.questions[this.currentQuestion].options[0];
        this.userAnswers.push({ selected, correct });
	this.results.push(selected === correct);

        // Update UI to show selected answer
        const options = document.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        options[index].classList.add('selected');

        // Move to next question after a short delay
        if (this.currentQuestion < this.questions.length - 1) {
            setTimeout(() => {
                this.currentQuestion++;
                this.showQuestion();
            }, 500);
        } else {
	    this.finishQuiz()
	}
    }


    finishQuiz() {
        document.getElementById('quiz-page').classList.remove('active');
        document.getElementById('quiz-page').style.display = 'none';
        document.getElementById('finish-page').style.display = 'flex';	
    }

    sendResults() {
        const resultsToSend = this.userAnswers.map((answer, index) => {
            return `Вопрос ${index + 1}: Выбран "${answer.selected}", дефолтный ответ: "${answer.correct}"`;
        }).join('\n');
    
        // Форматируем данные в JSON
        const dataToSend = JSON.stringify({ resultsToSend });
    
        // Отправляем данные в бот
        Telegram.WebApp.sendData(dataToSend);

        document.getElementById('finish-page').style.display = 'none';
        document.getElementById('results-page').style.display = 'flex';	
	this.displayResultsChart();
        // document.getElementById('share-vk').onclick = function() {
        //     const title = "Я прошел квиз!";
        //     const description = "Посмотрите, как я справился с вопросами! Присоединяйтесь к квизу и проверьте свои знания.";
        //     const url = encodeURIComponent(window.location.href); // URL вашего квиза
        //     const shareUrl = `https://vk.com/share.php?url=${url}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;
            
        //     window.open(shareUrl, '_blank');
        // };

	// document.getElementById("share-vk").addEventListener("click", () => {
	//     const url = "https://sam5213.github.io/30-days-twa-quiz-day9";
	//     const VKlink = `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=Мой результат в квизе ${this.incorrectAnswersCount} из 2! Проверь тоже свои силы в телеграм боте @twa_quiz_30_days_bot.`;
	//     window.open(VKlink, "_blank", "width=auto,height=auto");
	// });	

	document.getElementById("share-vk").addEventListener("click", () => {
	    const url = "https://t.me/twa_quiz_30_days_bot";
	    const title = `Мой результат в квизе ${this.correctAnswersCount} из 2! Проверь тоже свои силы в телеграм боте @twa_quiz_30_days_bot.`;
	    
	    // URL для открытия приложения ВКонтакте
	    const appLink = `vk://share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
	    
	    // URL для открытия в браузере
	    const webLink = `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
	
	    // Попытка открыть приложение
	    const start = Date.now();
	    window.location = appLink;
	
	    // Проверка, открыто ли приложение
	    setTimeout(() => {
	        const end = Date.now();
	        if (end - start < 3000) {
	            // Если прошло менее 3 секунд, значит приложение не открылось, открываем в браузере
	            window.location = webLink;
	        }
	    }, 2000); // Проверяем через 2 секунд
	});
    }
	
    displayResultsChart() {
	const ctx = document.getElementById('resultsChart').getContext('2d');
	this.correctAnswersCount = this.results.filter(result => result).length;
	this.incorrectAnswersCount = this.results.length - this.correctAnswersCount;
	
	const chart = new Chart(ctx, {
	type: 'bar',
	data: {
	    labels: ['Правильные', 'Неправильные'],
		datasets: [{
		    label: 'Результаты квиза',
		    data: [this.correctAnswersCount, this.incorrectAnswersCount],
		    backgroundColor: ['#3CB371', '#CD5C5C'],
		}]
	    },
	    options: {
		scales: {
		    y: {
			beginAtZero: true
		    }
		}
	    }
	});
	
	document.getElementById('resultsChart').style.display = 'block';
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});
