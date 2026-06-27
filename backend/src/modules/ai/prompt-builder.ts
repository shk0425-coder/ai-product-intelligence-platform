export class PromptBuilder {
  static build(reviews: { raw_text: string; rating: number }[], keyword: string): string {
    const jsonSchema = `{
  "summary": "overall summary of customer reviews",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "complaints": ["complaint 1", "complaint 2"],
  "jtbd": ["jtbd job 1", "jtbd job 2"],
  "keywords": ["keyword 1", "keyword 2"],
  "sentiment": {
    "positive": 70,
    "neutral": 20,
    "negative": 10
  }
}`;

    const reviewsText = reviews
      .map((r, i) => `Review ${i + 1} (Rating: ${r.rating}): ${r.raw_text}`)
      .join('\n\n');

    return `[Role]
You are a professional customer review analyst specialized in extracting JTBD (Jobs-to-be-Done) and customer sentiment.

[Task]
Analyze the provided customer reviews for the product/keyword "${keyword}" to extract structured customer insights.

[Rules]
1. JTBD: Identify the core motivations, contexts, and goals that customers are trying to satisfy.
2. Strengths and Weaknesses: Extract positive attributes and negative downsides.
3. Complaints: Identify specific pain points, bugs, or defects.
4. Keywords: List top keywords representing customer interests.
5. Sentiment: Compute positive, neutral, and negative sentiment distribution. The sum of positive, neutral, and negative MUST be exactly 100.
6. Do NOT output any markdown tags (like \`\`\`json), conversational text, or explanations. Respond with the raw JSON string only.

[Output JSON Schema]
You MUST respond with a single JSON object matching the following structure:
${jsonSchema}

[Review Data]
${reviewsText}
`;
  }
}
