export interface ImageGenerationOptions {
  aspectRatio: string;
  steps?: number;
  guidanceScale?: number;
}

export interface ImageGenerationProvider {
  generateImage(prompt: string, options?: ImageGenerationOptions): Promise<string>;
  getName(): string;
}

export class FluxImageProvider implements ImageGenerationProvider {
  constructor(private readonly apiKey: string) {}

  async generateImage(prompt: string, options?: ImageGenerationOptions): Promise<string> {
    const payload = {
      prompt,
      aspect_ratio: options?.aspectRatio || '1:1',
      steps: options?.steps || 28,
      guidance_scale: options?.guidanceScale || 3.5,
    };

    // API Key 가 없거나 mock 용인 경우 모의 URL 리턴
    if (!this.apiKey || this.apiKey === 'mock-api-key') {
      const promptHash = Buffer.from(prompt).toString('base64').substring(0, 16);
      return `https://images.flux.ai/outputs/mock_${promptHash}.png`;
    }

    const response = await fetch('https://api.bfl.ml/v1/flux-1-dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`FLUX API Request Failed: Status ${response.status}`);
    }

    interface FluxApiResponse {
      images?: string[];
      output?: string[];
      result?: {
        sample?: string;
      };
    }

    const result = (await response.json()) as FluxApiResponse;
    // BFL 또는 Replicate standard response format 매핑
    const imageUrl = result.images?.[0] || result.output?.[0] || result.result?.sample;
    if (!imageUrl) {
      throw new Error('FLUX API Response does not contain generated image URL');
    }

    return imageUrl;
  }

  getName(): string {
    return 'FLUX.1-dev';
  }
}
