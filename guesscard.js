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
  // Replace 'YOUR_CHATGPT_API_KEY' with your actual ChatGPT API key
  const chatGptApiKey = 'YOUR_CHATGPT_API_KEY';

  // Rest of the askQuestion function remains the same
}

// Function to handle user input and game flow
async function handleQuestion() {
  const userInput = document.getElementById('userInput').value.trim();
  if (!userInput) return;

  document.getElementById('userInput').value = '';
  attempts++;

  // Ask the question to ChatGPT API
  const response = await askQuestion(userInput);

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
