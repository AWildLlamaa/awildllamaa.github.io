let fetch;
import('node-fetch').then(module => {
    fetch = module.default;
});


exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const payload = JSON.parse(event.body);
    const question = payload.question;

    const apiKey = process.env.CHATGPT_API_KEY;

    try {
        const response = await fetch(`https://api.openai.com/v1/engines/davinci-codex/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                prompt: question,
                max_tokens: 150,
            }),
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify({ answer: data.choices[0].text.trim() }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Error processing the request.',
        };
    }
};