// DOM Elements
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const questionCountElement = document.getElementById('question-count');
const scoreElement = document.getElementById('score');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');
const quizTitleElement = document.getElementById('quiz-title');
const modal = document.getElementById('results-modal');
const finalScoreElement = document.getElementById('final-score');
const percentageElement = document.getElementById('percentage');
const restartButton = document.getElementById('restart-btn');
const closeButton = document.querySelector('.close');

// Quiz State
let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let quizType = '';

// Initialize the quiz
function initQuiz() {
    const selectedQuiz = localStorage.getItem('selectedQuiz');
    quizType = selectedQuiz === 'random' ? 'Random Mixed Quiz' : `Quiz ${selectedQuiz}`;
    quizTitleElement.textContent = `${quizType} - Conservation Economics`;
    
    // Get the appropriate questions
    if (selectedQuiz === 'random') {
        currentQuiz = getRandomQuestions();
    } else {
        currentQuiz = [...quizData[`quiz${selectedQuiz}`]];
    }
    
    userAnswers = new Array(currentQuiz.length).fill(null);
    showQuestion();
}

// Get 10 random questions from all quizzes
function getRandomQuestions() {
    let allQuestions = [];
    for (let i = 1; i <= 110; i++) {
        allQuestions = allQuestions.concat(quizData[`quiz${i}`]);
    }
    
    // Shuffle and select 10 questions
    return shuffleArray(allQuestions).slice(0, 110);
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Display the current question
function showQuestion() {
    const question = currentQuiz[currentQuestionIndex];
    questionElement.textContent = question.question;
    
    // Update question count
    questionCountElement.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.length}`;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Create option buttons
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        
        // Highlight selected answer
        if (userAnswers[currentQuestionIndex] === index) {
            button.classList.add('selected');
        }
        
        // Highlight correct/incorrect answers if already answered
        if (userAnswers[currentQuestionIndex] !== null) {
            if (index === question.correctAnswer) {
                button.classList.add('correct');
            } else if (index === userAnswers[currentQuestionIndex] && index !== question.correctAnswer) {
                button.classList.add('incorrect');
            }
        }
        
        button.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(button);
    });
    
    // Update navigation buttons
    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === currentQuiz.length - 1;
    submitButton.style.display = currentQuestionIndex === currentQuiz.length - 1 ? 'block' : 'none';
}

// Handle option selection
function selectOption(selectedIndex) {
    // If already answered, don't allow changes
    if (userAnswers[currentQuestionIndex] !== null) return;
    
    const question = currentQuiz[currentQuestionIndex];
    userAnswers[currentQuestionIndex] = selectedIndex;
    
    // Update score if correct
    if (selectedIndex === question.correctAnswer) {
        score++;
        scoreElement.textContent = `Score: ${score}`;
    }
    
    // Highlight selected and correct answers
    const options = document.querySelectorAll('.option-btn');
    options.forEach((option, index) => {
        option.classList.remove('selected');
        
        if (index === selectedIndex) {
            option.classList.add('selected');
        }
        
        if (index === question.correctAnswer) {
            option.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correctAnswer) {
            option.classList.add('incorrect');
        }
    });
}

// Navigation functions
function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

// Show quiz results
function showResults() {
    const percentage = Math.round((score / currentQuiz.length) * 100);
    finalScoreElement.textContent = `Your score: ${score}/${currentQuiz.length}`;
    percentageElement.textContent = `${percentage}%`;
    modal.style.display = 'block';
}

// Event Listeners
nextButton.addEventListener('click', nextQuestion);
prevButton.addEventListener('click', prevQuestion);
submitButton.addEventListener('click', showResults);
restartButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', initQuiz);