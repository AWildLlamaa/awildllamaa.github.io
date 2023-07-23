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
      body: JSON.stringify({error: 'Method Not Allowed'}),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({error: 'Invalid JSON payload received.'}),
    };
  }

  if (!payload || !payload.question) {
    return {
      statusCode: 400,
      body: JSON.stringify({error: 'Payload must contain a "question" property.'}),
    };
  }

  const question = payload.question;
  const apiKey = process.env.CHATGPT_API_KEY;

  console.log('Sending to OpenAI:', JSON.stringify({
    prompt: question,
    max_tokens: 50,
    temperature: 0.5,
    stop_sequences: ["Yes", "No", "I don't know"]
  }, null, 2));

  try {
    const response = await fetch(`https://api.openai.com/v1/engines/davinci/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: question,
        max_tokens: 50,
        temperature: 0.5,
        stop_sequences: ["Yes", "No", "I don't know"]
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error response:', await response.text());
      throw new Error(`OpenAI API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].text.trim();
    console.log(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: answer }),
    };
  } catch (error) {
    console.error('Error in lambda function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({error: `Error processing the request: ${error.message}`}),
    };
  }
};
