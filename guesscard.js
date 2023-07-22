let cardData;
let attempts = 0;

// Function to get a random Magic card from Scryfall API
async function getRandomCard() {
  try {
    const response = await fetch('https://api.scryfall.com/cards/random');
    const data = await response.json();
    cardData = data;
    displayCard(data);
  } catch (error) {
    console.error('Error fetching random card:', error);
  }
}

// Function to display the Magic card information
function displayCard(data) {
  const cardImage = document.getElementById('cardImage');
  cardImage.src = data.image_uris.normal;
}

// Function to ask a question to ChatGPT API
async function askQuestion(question) {
  const chatGptApiKey = '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';

  // Rest of the askQuestion function remains the same
}

// Function to handle user input and game flow
async function handleQuestion() {
  const userInput = document.getElementById('userInput').value.trim();
  if (!userInput) return;

  document.getElementById('userInput').value = '';
  attempts++;

  // Ask the question to ChatGPT API
  console.log(`Asking question: ${userInput}`);
  const response = await askQuestion(userInput);
  console.log(`Received response: ${response}`);

  // Display the response to the user
  const responseDiv = document.getElementById('response');
  responseDiv.innerHTML = `Response: ${response}`;

  // If the user correctly guesses the card
  if (response === "Yes") {
    responseDiv.innerHTML += `<br>Correct! You guessed the card "${cardData.name}" in ${attempts} attempts.`;
    attempts = 0;
    getRandomCard();
  }
}

// Event listener for the "Ask" button
document.getElementById('askButton').addEventListener('click', handleQuestion);

// Initialize the game by getting a random card
getRandomCard();
