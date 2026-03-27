const OPENROUTER_API_KEY = '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';

export async function askQwen(messages) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen/qwen-2.5-7b-instruct',
      messages: messages,
      max_tokens: 500,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Нет ответа';
}