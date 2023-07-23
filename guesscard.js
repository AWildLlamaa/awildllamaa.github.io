require('dotenv-browserify').config();
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
    const chatGptApiKey = process.env.CHATGPT_API_KEY;
  
    try {
      const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${chatGptApiKey}`,
        },
        body: JSON.stringify({
          'prompt': `You are playing a game of 20 Questions to guess a Magic card. Is the card ${question}?`,
          'temperature': 0.7,
          'max_tokens': 100,
          'stop': '\n',
        }),
      });
  
      // Check if the response status is 404 (Not Found)
      if (response.status === 404) {
        throw new Error('API endpoint not found. Please check the API URL.');
      }
  
      const data = await response.json();
      const answer = data.choices[0]?.text.trim(); // Use optional chaining to handle possible undefined response
      return answer || "I'm sorry, I couldn't answer that question.";
    } catch (error) {
      console.error('Error fetching response from ChatGPT API:', error);
      return "I'm sorry, I couldn't answer that question.";
    }
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
