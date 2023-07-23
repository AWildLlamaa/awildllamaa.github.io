let cardData;
let attempts = 0;

// Function to get a random Magic card from Scryfall API
async function getRandomCard() {
  try {
    const response = await fetch('https://api.scryfall.com/cards/random');
    const data = await response.json();
    cardData = data;
    displayCard(data); // Call the displayCard function to show the card image
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
    try {
      const response = await fetch('/.netlify/functions/askChatGPT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      
      const responseBody = await response.text();  // Read the body as text first
      
      // Check if response is OK (status code 2xx)
      if (!response.ok) {
        // Try to parse the responseBody as JSON
        try {
          const errorData = JSON.parse(responseBody);
          console.error('Error from server:', errorData);
        } catch (jsonError) {
          // If parsing failed, just log the text
          console.error('Error from server (non-JSON response):', responseBody);
        }
        throw new Error('Server error');
      }
  
      const data = JSON.parse(responseBody);  // Parse the responseBody for the successful case
      return data.answer;
    } catch (error) {
      console.error('Error fetching response from ChatGPT API:', error);
      throw error;  // This will propagate the error to where askQuestion is called
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
