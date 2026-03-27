const OPENROUTER_API_KEY = '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';

export async function askQwen(messages) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen/qwen-2.5-72b-instruct',
      messages: messages,
      max_tokens: 500,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Нет ответа';
}