let cardData;
let attempts = 0;

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

function displayCard(data) {
  const cardImage = document.getElementById('cardImage');
  cardImage.src = data.image_uris.normal;
}

async function askQuestion(question) {
    try {
      const response = await fetch('/.netlify/functions/askChatGPT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: `Given the information about the Magic the Gathering card "${cardData.name}" with attributes like color identity "${cardData.color_identity.join(', ')}" and type "${cardData.type_line}", answer this question about the card with either "Yes", "No", or "I didn't quite understand that. Please ask again.": ${question}?`,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error from server: ${errorData}`);
      }
  
      const data = await response.json();
      return data.answer;
    } catch (error) {
      console.error('Error fetching response from ChatGPT API:', error);
      throw error;
    }
  }
  
  async function handleQuestion() {
    const userInput = document.getElementById('userInput').value.trim();
    if (!userInput) return;
  
    document.getElementById('userInput').value = '';
    attempts++;
  
    console.log(`Asking question: ${userInput}`);
    try {
      const response = await askQuestion(userInput);
      console.log(`Received response: ${response}`);
  
      const responseDiv = document.getElementById('response');
      responseDiv.innerHTML = `Response: ${response}`;
  
      if (response === "Yes" || response === "No") {
        responseDiv.innerHTML += `<br>Correct! You guessed the card "${cardData.name}" in ${attempts} attempts.`;
        attempts = 0;
        getRandomCard();
      }
    } catch (error) {
      console.error('Error handling question:', error);
    }
  }

document.getElementById('askButton').addEventListener('click', handleQuestion);
getRandomCard();
