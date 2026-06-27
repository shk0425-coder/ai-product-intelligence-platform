export interface AIRequestOptions {
  model: string;
  temperature: number;
  timeout: number;
  maxOutputTokens: number;
  promptVersion: string;
}

export interface AnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  complaints: string[];
  jtbd: string[];
  keywords: string[];
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface AIProvider {
  analyze(prompt: string, options: AIRequestOptions): Promise<string>;
  getName(): string;
}

export interface StoredAnalysis {
  id: string;
  analysisIdentity: string;
  provider: string;
  model: string;
  promptVersion: string;
  temperature: number;
  maxOutputTokens: number;
  keyword: string;
  reviewCount: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  complaints: string[];
  jtbd: string[];
  keywords: string[];
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  processingTimeMs: number;
  createdAt: string;
}
