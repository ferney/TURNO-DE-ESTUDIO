// Variables globales
let preguntas = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let userAnswers = [];

// Elementos del DOM
const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-button');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const progressFill = document.getElementById('progress-fill');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const retryButton = document.getElementById('retry-button');
const returnButton = document.getElementById('return-button');

// Carga el archivo JSON de preguntas
async function cargarPreguntas() {
    try {
        const response = await fetch('json/preguntas-cateterismo.json');
        if (!response.ok) {
            throw new Error('Error al cargar las preguntas');
        }
        const data = await response.json();
        preguntas = data.map(pregunta => ({
            ...pregunta,
            opciones: aleatorizarOpciones([...pregunta.opciones])
        }));
        
        totalQuestionsElement.textContent = preguntas.length;
        mostrarPregunta();
    } catch (error) {
        console.error('Error:', error);
        questionContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error al cargar las preguntas. Por favor, intenta recargar la página.</p>
            </div>
        `;
    }
}

// Aleatoriza las opciones de respuesta
function aleatorizarOpciones(opciones) {
    for (let i = opciones.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
    }
    return opciones;
}

// Muestra la pregunta actual
function mostrarPregunta() {
    const pregunta = preguntas[currentQuestionIndex];
    questionContainer.querySelector('#question').textContent = pregunta.pregunta;
    
    optionsContainer.innerHTML = '';
    pregunta.opciones.forEach((opcion, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = `
            <input type="radio" name="option" id="option${index}" value="${index}">
            <label for="option${index}">${opcion.texto}</label>
        `;
        
        optionElement.addEventListener('click', () => {
            selectedOption = index;
            nextButton.disabled = false;
            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            optionElement.classList.add('selected');
        });
        
        optionsContainer.appendChild(optionElement);
    });
    
    updateProgress();
}

// Actualiza la barra de progreso
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / preguntas.length) * 100;
    progressFill.style.width = `${progress}%`;
    currentQuestionElement.textContent = currentQuestionIndex + 1;
}

// Verifica la respuesta y avanza a la siguiente pregunta
function verificarRespuesta() {
    const pregunta = preguntas[currentQuestionIndex];
    const opcionSeleccionada = pregunta.opciones[selectedOption];
    
    if (opcionSeleccionada.correcta) {
        score++;
    }
    
    // Almacenar la respuesta del usuario
    userAnswers.push({
        question: pregunta.pregunta,
        userAnswer: opcionSeleccionada.texto,
        correctAnswer: pregunta.opciones[pregunta.opciones.findIndex(o => o.correcta)].texto,
        isCorrect: opcionSeleccionada.correcta,
        explanation: pregunta.explicacion
    });
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < preguntas.length) {
        selectedOption = null;
        nextButton.disabled = true;
        mostrarPregunta();
    } else {
        mostrarResultado();
    }
}

// Muestra el resultado final
function mostrarResultado() {
    const quizContainer = document.querySelector('.quiz-container');
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    showResult();
}

// Función para mostrar el resultado con feedback detallado
function showResult() {
    const feedbackItemsContainer = document.getElementById('feedback-items');
    const respuestasCorrectas = userAnswers.filter(answer => answer.isCorrect).length;
    const totalPreguntas = userAnswers.length;
    scoreElement.textContent = `${respuestasCorrectas}/${totalPreguntas}`;
    
    // Generar feedback para cada pregunta
    feedbackItemsContainer.innerHTML = '';
    userAnswers.forEach((answer, index) => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = `feedback-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
        
        const status = document.createElement('div');
        status.className = `feedback-status ${answer.isCorrect ? 'correct' : 'incorrect'}`;
        status.innerHTML = `<i class="fas fa-${answer.isCorrect ? 'check-circle' : 'times-circle'}"></i> ${answer.isCorrect ? 'Correcto' : 'Incorrecto'}`;
        
        const questionText = document.createElement('div');
        questionText.className = 'feedback-question';
        questionText.textContent = answer.question;
        
        const userAnswer = document.createElement('div');
        userAnswer.className = `feedback-answer ${answer.isCorrect ? 'correct' : 'incorrect'}`;
        userAnswer.innerHTML = `<i class="fas fa-user"></i> Tu respuesta: ${answer.userAnswer}`;
        
        const correctAnswer = document.createElement('div');
        correctAnswer.className = 'feedback-answer correct';
        correctAnswer.innerHTML = `<i class="fas fa-check"></i> Respuesta correcta: ${answer.correctAnswer}`;
        
        feedbackItem.appendChild(status);
        feedbackItem.appendChild(questionText);
        feedbackItem.appendChild(userAnswer);
        if (!answer.isCorrect) {
            feedbackItem.appendChild(correctAnswer);
        }
        
        feedbackItemsContainer.appendChild(feedbackItem);
    });
}

// Reinicia el quiz
function reiniciarQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;
    userAnswers = [];
    preguntas = preguntas.map(pregunta => ({
        ...pregunta,
        opciones: aleatorizarOpciones([...pregunta.opciones])
    }));
    
    const quizContainer = document.querySelector('.quiz-container');
    resultContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    nextButton.disabled = true;
    mostrarPregunta();
}

// Event Listeners
nextButton.addEventListener('click', verificarRespuesta);
retryButton.addEventListener('click', reiniciarQuiz);
returnButton.addEventListener('click', () => {
    window.location.href = '../index.html';
});

// Inicializa el quiz cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', cargarPreguntas);
