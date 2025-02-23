const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.getElementById("game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

// Items array
const items = [
    { name: "🎮", },
    { name: "🎲", },
    { name: "🎯", },
    { name: "🎨", },
    { name: "🎭", },
    { name: "🎪", },
    { name: "🎢", },
    { name: "🎡", },
];

// Initial Time, Moves & Win Count
let seconds = 0;
let movesCount = 0;
let winCount = 0;

// Timer
const timeGenerator = () => {
    seconds += 1;
    timeValue.innerHTML = seconds;
};

// Calculate moves
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = movesCount;
};

// Pick random objects from item array
const generateRandom = (size = 4) => {
    let tempArray = [...items];
    let cardValues = [];
    size = (size * size) / 2;
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    cardValues.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < size * size; i++) {
        gameContainer.innerHTML += `
            <div class="card" data-card-value="${cardValues[i].name}">
                <div class="card-front"></div>
                <div class="card-back">${cardValues[i].name}</div>
            </div>
        `;
    }
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;
    
    cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (!card.classList.contains("matched") && !card.classList.contains("flipped")) {
                card.classList.add("flipped");
                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    movesCounter();
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue === secondCardValue) {
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        firstCard = false;
                        winCount += 1;
                        if (winCount === Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<h2>You Won!</h2>
                            <h4>Moves: ${movesCount}</h4>
                            <h4>Time: ${seconds} seconds</h4>`;
                            stopGame();
                        }
                    } else {
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 900);
                    }
                }
            }
        });
    });
};

// Start game
startButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = movesCount;
    timeValue.innerHTML = seconds;
    initializer();
});

// Stop game
stopButton.addEventListener("click", () => {
    stopGame();
});

// Initialize game
const initializer = () => {
    winCount = 0;
    let cardValues = generateRandom();
    matrixGenerator(cardValues);
};

// Stop game function
const stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
};