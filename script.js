document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const nextButton = document.getElementById("next-button");
    const startScreen = document.getElementById("start-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resultScreen = document.getElementById("result-screen");
    const timerElement = document.getElementById("timer-value");
    const quizContainer = document.getElementById("quiz-container");
    const feedbackElement = document.getElementById("feedback");
    const progressBar = document.querySelector(".progress-bar");
    const scoreElement = document.getElementById("score");
    const totalElement = document.getElementById("total");

    let timer;
    let timeLeft = 15;
    let currentQuestionIndex = 0;
    let score = 0;
    const questions = [
        { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: 2 },
        { question: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "Jane Austen", "Mark Twain", "Ernest Hemingway"], answer: 0 },
        { question: "What is the largest planet in our solar system?", options: ["Earth", "Jupiter", "Mars", "Saturn"], answer: 1 },
        { question: "In which year did the Titanic sink?", options: ["1912", "1905", "1898", "1923"], answer: 0 },
        { question: "What is the chemical symbol for water?", options: ["O2", "H2O", "CO2", "NaCl"], answer: 1 },
        { question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"], answer: 1 },
        { question: "What is the capital of Japan?", options: ["Beijing", "Seoul", "Tokyo", "Bangkok"], answer: 2 },
        { question: "What is the smallest prime number?", options: ["0", "1", "2", "3"], answer: 2 },
        { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Mercury"], answer: 1 },
        { question: "Who developed the theory of relativity?", options: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Galileo Galilei"], answer: 1 },
        { question: "What is the capital of Canada?", options: ["Toronto", "Vancouver", "Montreal", "Ottawa"], answer: 3 },
        { question: "Who is the author of the Harry Potter series?", options: ["J.K. Rowling", "J.R.R. Tolkien", "George R.R. Martin", "C.S. Lewis"], answer: 0 },
        { question: "What is the main ingredient in guacamole?", options: ["Tomato", "Avocado", "Onion", "Lettuce"], answer: 1 },
        { question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"], answer: 0 },
        { question: "Who was the first man to walk on the moon?", options: ["Yuri Gagarin", "Buzz Aldrin", "Neil Armstrong", "Michael Collins"], answer: 2 },
        { question: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum"], answer: 2 },
        { question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Brisbane", "Canberra"], answer: 3 },
        { question: "Who wrote 'Pride and Prejudice'?", options: ["Emily Brontë", "Jane Austen", "Charlotte Brontë", "Louisa May Alcott"], answer: 1 },
        { question: "Which element has the chemical symbol 'O'?", options: ["Oxygen", "Gold", "Silver", "Osmium"], answer: 0 },
        { question: "What is the square root of 64?", options: ["6", "7", "8", "9"], answer: 2 }
    ];

    startButton.addEventListener("click", startQuiz);
    nextButton.addEventListener("click", nextQuestion);

    function startQuiz() {
        startScreen.classList.remove("active");
        quizScreen.classList.add("active");
        loadQuestion();
        startTimer();
        updateProgressBar();
        updateScore(); // Initialize score display
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                showFeedback("Time's up!", false);
                document.querySelectorAll(".option button").forEach((button, index) => {
                    if (index === questions[currentQuestionIndex].answer) {
                        button.classList.add("correct");
                    }
                });
                nextButton.classList.remove("d-none");
            }
        }, 1000);
    }

    function formatTime(seconds) {
        return `00:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    function loadQuestion() {
        const questionData = questions[currentQuestionIndex];
        quizContainer.innerHTML = `
            <div class="question">${questionData.question}</div>
            <div class="options">
                ${questionData.options.map((option, index) => `
                    <div class="option">
                        <button class="btn" onclick="checkAnswer(${index})">${option}</button>
                    </div>
                `).join("")}
            </div>
        `;
        quizContainer.classList.add("animate-question");
        setTimeout(() => quizContainer.classList.remove("animate-question"), 500); // Remove animation class after animation
    }

    function checkAnswer(selectedOption) {
        const questionData = questions[currentQuestionIndex];
        let isCorrect = false;

        if (selectedOption === questionData.answer) {
            score += 5; // Increase score by 5 marks
            isCorrect = true;
            showFeedback("Correct!", true);
        } else {
            showFeedback("Incorrect!", false);
            document.querySelectorAll(".option button")[questionData.answer].classList.add("correct");
        }

        document.querySelectorAll(".option button")[selectedOption].classList.add(isCorrect ? "correct" : "incorrect");
        clearInterval(timer);
        updateScore(); // Ensure score is updated here

        // Automatically go to the next question after a short delay
        setTimeout(() => {
            nextQuestion();
        }, 1000); // Delay in milliseconds (1 second)
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            timeLeft = 15;
            loadQuestion();
            startTimer();
            updateProgressBar();
            feedbackElement.textContent = "";
            nextButton.classList.add("d-none");
        } else {
            showResults();
        }
    }

    function showFeedback(message, isCorrect) {
        feedbackElement.textContent = message;
        feedbackElement.className = isCorrect ? "feedback feedback-correct" : "feedback feedback-incorrect";
    }

    function updateProgressBar() {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }

    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
        console.log(`Score updated: ${score}`); // Debug statement
    }

    function showResults() {
        quizScreen.classList.remove("active");
        resultScreen.classList.add("active");
        scoreElement.textContent = `You scored ${score} out of ${questions.length * 5}`; // Total score calculation
        totalElement.textContent = `Total Questions: ${questions.length}`;
    }

    window.checkAnswer = checkAnswer;
});
