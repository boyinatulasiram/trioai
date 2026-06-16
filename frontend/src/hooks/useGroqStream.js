import { useState, useCallback } from 'react';

export function useGroqStream() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateStream = useCallback(async (endpoint, systemPrompt, userPromptOrMessages, onChunk, onComplete) => {
    setIsLoading(true);
    setError(null);

    try {
      // Handle either a simple system/user prompt or a full conversation messages array
      const messagesBody = Array.isArray(userPromptOrMessages)
        ? userPromptOrMessages
        : [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPromptOrMessages }
          ];

      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesBody
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let fullContent = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          for (const line of lines) {
            if (line === 'data: [DONE]') {
               if (onComplete) onComplete(fullContent);
               setIsLoading(false);
               return;
            }
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                const content = data.choices[0]?.delta?.content;
                if (content) {
                  fullContent += content;
                  onChunk(content, fullContent);
                }
              } catch (e) {
                // Ignore parse errors on incomplete chunks
              }
            }
          }
        }
      }
      
      if (onComplete) onComplete(fullContent);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { generateStream, isLoading, error };
}
