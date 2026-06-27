import { AIProvider } from './types.js';
import { GeminiProvider } from './providers/gemini.provider.js';

export class ProviderFactory {
  static create(name: string): AIProvider {
    switch (name.toLowerCase()) {
      case 'gemini':
        return new GeminiProvider();
      default:
        throw new Error(`Unsupported AI provider: ${name}`);
    }
  }
}
