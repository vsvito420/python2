import OpenAI from 'openai';

const openai = new OpenAI({
  base_url: 'https://requesty.ai/api/v1',
  api_key: '<REQUESTY_API_KEY>',
  default_headers: {
    'HTTP-Referer': '<YOUR_SITE_URL>', // Optional
    'X-Title': '<YOUR_SITE_NAME>', // Optional
  },
});

async function main() {
  const response = await openai.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [
      {
        role: 'User',
        content: 'Hello, who are you?',
      },
    ],
  });

  console.log(response.choices[0].message);
}

main();