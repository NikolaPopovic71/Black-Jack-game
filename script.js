const dealerCards = document.getElementById("dealer-cards");
const playerCards = document.getElementById("player-cards");
const dealerScore = document.getElementById("dealer-score");
const playerScore = document.getElementById("player-score");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");
const newGameButton = document.getElementById("new-game-button");
const message = document.getElementById("message");

let deck = [];
let dealerHand = [];
let playerHand = [];
let gameOver = false;

function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function dealCard() {
  return deck.pop();
}

function calculateScore(hand) {
  let score = 0;
  let aceCount = 0;

  for (let card of hand) {
    if (card.value === "A") {
      aceCount++;
      score += 11;
    } else if (["J", "Q", "K"].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  }

  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }

  return score;
}

function updateScores(showDealerScore = false) {
  if (showDealerScore) {
    dealerScore.textContent = calculateScore(dealerHand);
  } else {
    dealerScore.textContent = "?"; // Hide dealer's score completely until the player stands
  }
  playerScore.textContent = calculateScore(playerHand);
}

function renderCards(showDealerFirstCard = false) {
  dealerCards.innerHTML = "";
  playerCards.innerHTML = "";

  dealerHand.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className = `card ${card.suit.toLowerCase()}`;
    let color = card.suit === "♥" || card.suit === "♦" ? "red" : "black";
    if (index === 0 && !showDealerFirstCard) {
      cardElement.innerHTML = "?";
    } else {
      cardElement.innerHTML = `
        <div style="position: absolute; top: 5px; left: 5px; font-size: 14px; color: ${color};">${card.value}${card.suit}</div>
        <div style="font-size: 32px; color: ${color};">${card.value}${card.suit}</div>
        <div style="position: absolute; bottom: 5px; right: 5px; font-size: 14px; transform: rotate(180deg); color: ${color};">${card.value}${card.suit}</div>
      `;
    }
    dealerCards.appendChild(cardElement);
  });

  playerHand.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.className = `card ${card.suit.toLowerCase()}`;
    let color = card.suit === "♥" || card.suit === "♦" ? "red" : "black";
    cardElement.innerHTML = `
      <div style="position: absolute; top: 5px; left: 5px; font-size: 14px; color: ${color};">${card.value}${card.suit}</div>
      <div style="font-size: 32px; color: ${color};">${card.value}${card.suit}</div>
      <div style="position: absolute; bottom: 5px; right: 5px; font-size: 14px; transform: rotate(180deg); color: ${color};">${card.value}${card.suit}</div>
    `;
    playerCards.appendChild(cardElement);
  });
}

function stand() {
  if (!gameOver) {
    while (calculateScore(dealerHand) < 17) {
      dealerHand.push(dealCard());
    }

    renderCards(true);
    updateScores(true);

    const dealerFinalScore = calculateScore(dealerHand);
    const playerFinalScore = calculateScore(playerHand);

    if (dealerFinalScore > 21) {
      endGame("Dealer busted! You win!");
    } else if (dealerFinalScore > playerFinalScore) {
      endGame("Dealer wins!");
    } else if (dealerFinalScore < playerFinalScore) {
      endGame("You win!");
    } else {
      endGame("It's a tie!");
    }
  }
}

function startNewGame() {
  deck = [];
  dealerHand = [];
  playerHand = [];
  gameOver = false;
  message.textContent = "";

  resetAnimation(message); // Reset the pulse animation

  createDeck();
  shuffleDeck();

  dealerHand.push(dealCard(), dealCard());
  playerHand.push(dealCard(), dealCard());

  updateScores(); // Hide dealer's score completely at the start
  renderCards(); // Hide the dealer's first card

  hitButton.disabled = false;
  standButton.disabled = false;
}

function hit() {
  if (!gameOver) {
    playerHand.push(dealCard());
    updateScores();
    renderCards();

    if (calculateScore(playerHand) > 21) {
      endGame("You busted! Dealer wins.");
    }
  }
}

function resetAnimation(element) {
  element.style.animation = "none";
  element.offsetHeight; /* Trigger reflow */
  element.style.animation = null;
}

function endGame(msg) {
  gameOver = true;
  message.textContent = msg;

  resetAnimation(message); // Reset the pulse animation

  // Reveal all dealer's cards and update the score
  renderCards(true);
  updateScores(true);

  // Disable the Hit and Stand buttons
  hitButton.disabled = true;
  standButton.disabled = true;
}

hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
newGameButton.addEventListener("click", startNewGame);

startNewGame();

const shareButton = document.getElementById("share-button");
const hint = document.getElementById("click-hint");
const socialsWrapper = document.querySelector(".socials-wrapper");

const toggleSocials = () => {
  socialsWrapper.classList.toggle("active");

  // Hide the hint text once the image is clicked
  hint.style.display = "none";

  const shareButtonImage = shareButton.querySelector("img");
  if (shareButtonImage.src.includes("ponITech%20-%20shorten%20logo_without_n.svg")) {
    shareButtonImage.src = "images/close.svg";
  } else {
    shareButtonImage.src = "images/ponITech%20-%20shorten%20logo_without_n.svg";
  }
};

shareButton.addEventListener("click", toggleSocials);
