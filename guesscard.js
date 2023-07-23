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
            body: JSON.stringify({
                question,
                cardData
            }),
        });
        
        const responseBody = await response.text();  // Read the body as text first
        
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
        return data.answer;
    } catch (error) {
        console.error('Error fetching response from ChatGPT API:', error);
        throw error;
    }
}

// Function to handle user input and game flow
async function handleQuestion() {
    const userInput = document.getElementById('userInput').value.trim();
    if (!userInput) return;

    document.getElementById('userInput').value = '';
    attempts++;

    console.log(`Asking question: ${userInput}`);
    const response = await askQuestion(userInput);
    console.log(`Received response: ${response}`);

    const responseDiv = document.getElementById('response');
    responseDiv.innerHTML = `Response: ${response}`;

    if (response === "Yes") {
        responseDiv.innerHTML += `<br>Correct! You guessed the card "${cardData.name}" in ${attempts} attempts.`;
        attempts = 0;
        getRandomCard();
    }
}

document.getElementById('askButton').addEventListener('click', handleQuestion);
getRandomCard();
