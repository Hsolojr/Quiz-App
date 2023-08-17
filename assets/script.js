const questions = [
    {
        question: "which is the largest animal in the world?",
        answers: [
            { text: "shark", correct: false },
            { text: "Blue Whale", correct: true },
            { text: "Elephant", correct: false },
            { text: "Giraffe", correct: false },
        ],
    },
    {
        question: "which is the smallest country in the world?",
        answers: [
            { text: "Vatican City", correct: true },
            { text: "bhutan", correct: false },
            { text: "Nepal", correct: false },
            { text: "Shri Lanka", correct: false },
        ],
    },
    {
        question: "which is the largest desert in the world?",
        answers: [
            { text: "Kalahari", correct: false },
            { text: "Gobi", correct: false },
            { text: "Sahara", correct: false },
            { text: "Antarctica", correct: true },
        ],
    },
    {
        question: "which is the smallest continent in the world?",
        answers: [
            { text: "Asia", correct: false },
            { text: "Australia", correct: true },
            { text: "Arctic", correct: false },
            { text: "Africa", correct: false },
        ],
    },
];

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-btn");
    const startPage = document.getElementById("start-page");
    const quizPage = document.getElementById("quiz-page");
    const questionElement = document.getElementById("question");
    const answerButton = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");
    const timerElement = document.getElementById("timer");
    const scoresEl = document.getElementById("high-scores");

    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 90; // Time limit in seconds
    let timerInterval;
    let highScores = JSON.parse(localStorage.getItem("bestScores")) || [];

    function startGame() {
        startTimer();
        showQuestion();
        nextButton.style.display = "none";
        scoresEl.style.display = "none";
    }

    function showQuestion() {
        resetState();
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;

        currentQuestion.answers.forEach(answer => {
            const button = createAnswerButton(answer.text, answer.correct);
            answerButton.appendChild(button);
        });
    }

    function createAnswerButton(text, correct) {
        const button = document.createElement("button");
        button.textContent = text;
        button.classList.add("btn");
        if (correct) {
            button.dataset.correct = correct;
        }
        button.addEventListener("click", selectAnswer);
        return button;
    }

    function resetState() {
        while (answerButton.firstChild) {
            answerButton.removeChild(answerButton.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === "true";
        if (isCorrect) {
            selectedBtn.classList.add("correct");
            score++;
        } else {
            selectedBtn.classList.add("incorrect");
            timeLeft -= 10; // Subtract time for incorrect answer
        }
        Array.from(answerButton.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            }
            button.disabled = true;
        });
        nextButton.style.display = "block";
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            if (timeLeft <= 0 || currentQuestionIndex >= questions.length) {
                clearInterval(timerInterval);
                showScore();
            } else {
                timerElement.textContent = `Time left: ${timeLeft} seconds`;
                timeLeft--;
            }
        }, 1000);
    }

    function showScore() {
        clearInterval(timerInterval);
        resetState();
        questionElement.textContent = `Game Over! You scored ${score} out of ${questions.length}!`;
        nextButton.textContent = "Submit Score";
        nextButton.style.display = "block";
        nextButton.removeEventListener("click", startGame);
        nextButton.addEventListener("click", submitScore);
    }

    function submitScore() {
        const playerInitials = prompt("Enter your initials:");
        if (playerInitials) {
            highScores.push({ initials: playerInitials.toUpperCase(), score: score });
            highScores.sort((a, b) => b.score - a.score);
            highScores = highScores.slice(0, 10);
            localStorage.setItem("bestScores", JSON.stringify(highScores));
        }
        showHighScores();
        nextButton.textContent = "Play Again";
        nextButton.removeEventListener("click", submitScore);
        nextButton.addEventListener("click", startGameAgain);
    }

    function showHighScores() {
        scoresEl.innerHTML = "";
        highScores.forEach(entry => {
            const scoreItem = document.createElement("li");
            scoreItem.textContent = `${entry.initials}: ${entry.score}`;
            scoresEl.appendChild(scoreItem);
        });
        scoresEl.style.display = "block";
    }

    function startGameAgain() {
        currentQuestionIndex = 0;
        score = 0;
        timeLeft = 90;
        startGame();
    }

    startBtn.addEventListener("click", () => {
        startGame();
        startPage.style.display = "none";
        quizPage.style.display = "block";
    });

    nextButton.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showScore();
        }
    });
});