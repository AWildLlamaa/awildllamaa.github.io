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

    try {
        const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "davinci", // Add this line
                prompt: question,
                max_tokens: 150,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
        }        

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify({ answer: data.choices[0].text.trim() }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: `Error processing the request: ${error.message}`,
        };
    }
};
