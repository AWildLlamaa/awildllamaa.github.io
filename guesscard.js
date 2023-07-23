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
        const prompt = `There is a Magic the Gathering card named "${cardData.name}", which has attributes like a color identity of "${cardData.color_identity}" and type of "${cardData.type_line}". ${question}? Answer with "Yes", "No", or "I don't know" only.`;
      
      const response = await fetch('/.netlify/functions/askChatGPT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: prompt,
        }),
      });
  
      const responseBody = await response.text();
  
      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseBody);
          console.error('Error from server:', errorData);
        } catch (jsonError) {
          console.error('Error from server (non-JSON response):', responseBody);
        }
        throw new Error('Server error');
      }
  
      const data = JSON.parse(responseBody);
      const answer = data.answer.trim();
  
      return answer;
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
