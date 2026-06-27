export class ResponseParser {
  static parse(text: string): Record<string, unknown> {
    let cleanText = text.trim();

    if (cleanText.includes('```')) {
      const match = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        cleanText = match[1].trim();
      } else {
        cleanText = cleanText.replace(/^```/g, '').replace(/```$/g, '').trim();
      }
    }

    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }

    try {
      return JSON.parse(cleanText) as Record<string, unknown>;
    } catch (e: unknown) {
      const err = e as Error;
      throw new Error(`Failed to parse AI response JSON: ${err.message}. Raw text: "${text}"`);
    }
  }
}
