import { AIProvider, AIRequestOptions } from '../types.js';

export class GeminiProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || 'mock-key';
  }

  getName(): string {
    return 'gemini';
  }

  async analyze(prompt: string, options: AIRequestOptions): Promise<string> {
    const model = options.model || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
    
    const maxRetries = 2;
    const timeoutMs = options.timeout || 60000;

    let attempts = 0;
    while (attempts <= maxRetries) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }],
            }],
            generationConfig: {
              temperature: options.temperature ?? 0.2,
              responseMimeType: 'application/json',
              maxOutputTokens: options.maxOutputTokens || 4096,
            },
          }),
        });

        clearTimeout(timeoutId);

        if (response.status === 200) {
          const resJson = (await response.json()) as {
            candidates?: { content?: { parts?: { text?: string }[] } }[];
          };
          const text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return text;
          }
          throw new Error('Gemini API response candidate text was empty');
        }

        throw new Error(`Gemini API responded with status ${response.status}`);
      } catch (error) {
        clearTimeout(timeoutId);
        attempts++;
        const err = error as Error & { status?: number; response?: { status?: number } };
        const isTimeout = err.name === 'AbortError' || err.message?.includes('timeout');
        const status = err.status || err.response?.status;
        
        const isRetryable = status === 429 || status === 500 || status === 503 || isTimeout || !status;

        if (attempts > maxRetries || !isRetryable) {
          throw error;
        }

        const backoffMs = attempts * 1000;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }

    throw new Error('Gemini API call failed after maximum retries');
  }
}
