let fetch;
if (typeof window === 'undefined') {
    fetch = require('node-fetch');
} else {
    import('node-fetch').then(module => {
        fetch = module.default;
    });
}

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    let payload;
    try {
        payload = JSON.parse(event.body);
    } catch (e) {
        return {
            statusCode: 400,
            body: 'Invalid JSON payload received.',
        };
    }

    if (!payload || !payload.question) {
        return {
            statusCode: 400,
            body: 'Payload must contain a "question" property.',
        };
    }

    const question = payload.question;
    const apiKey = process.env.CHATGPT_API_KEY;
    const validAnswers = ["Yes", "No", "I Don't Know", "Please Ask Again"];

    try {
        const response = await fetch(`https://api.openai.com/v1/engines/davinci/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                prompt: question,
                max_tokens: 150,
                temperature: 0.10
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
        }        

        const data = await response.json();
        const answer = data.choices[0].text.trim();

        if (!validAnswers.includes(answer)) {
            return {
                statusCode: 500,
                body: `Received unexpected answer from OpenAI: ${answer}. Please ask again.`,
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ answer: answer }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: `Error processing the request: ${error.message}`,
        };
    }
};
