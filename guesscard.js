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
      const prompt = `Given the information about the Magic the Gathering card "${cardData.name}" with attributes like color identity "${cardData.color_identity}" and type "${cardData.type_line}", answer this question 
                    about the card with either "Yes", "No", or "I didn't quite understand that. Please ask again." In the case of "Yes" or "No", only reply with a one-word answer: ${question}?`;
      
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
  
      const validAnswers = ["Yes", "No", "I Don't Know", "Please Ask Again"];
      if (!validAnswers.includes(answer)) {
        throw new Error('Received unexpected answer from OpenAI: ' + answer + '. Please ask again.');
      }
  
      return answer;
    } catch (error) {
      console.error('Error fetching response from ChatGPT API:', error);
      throw error;
    }
}  


let isQuestionAsked = false;

async function handleQuestion() {
  const userInput = document.getElementById('userInput').value.trim();
  if (!userInput) return;

  // Check if the question has already been asked
  if (isQuestionAsked) {
    console.log('Question already asked. Please wait for the response.');
    return;
  }

  isQuestionAsked = true; // Set the flag to true to indicate the question has been asked
  document.getElementById('userInput').value = '';
  attempts++;

  console.log(`Asking question: ${userInput}`);
  const response = await askQuestion(userInput);
  console.log(`Received response: ${response}`);

  const responseDiv = document.getElementById('response');

  // Get card details and append to response only if the response is valid
  if (response === "Yes" || response === "No" || response === "I Don't Know" || response === "Please Ask Again") {
    const cardDetails = `Given the information about the Magic the Gathering card "${cardData.name}" with attributes like color identity "${cardData.color_identity}" and type "${cardData.type_line}", `;
    responseDiv.innerHTML = `${cardDetails}answer this question about the card with either "Yes", "No", or "I didn't quite understand that. Please ask again.": ${userInput}?`;
  } else {
    // Handle unexpected response
    responseDiv.innerHTML = `Received unexpected answer from OpenAI: ${response}. Please ask again.`;
  }

  // Reset the flag after displaying the response
  isQuestionAsked = false;

  if (response === "Yes") {
    responseDiv.innerHTML += `<br>Correct! You guessed the card "${cardData.name}" in ${attempts} attempts.`;
    attempts = 0;
    getRandomCard();
  }
}

document.getElementById('askButton').addEventListener('click', handleQuestion);
getRandomCard();
