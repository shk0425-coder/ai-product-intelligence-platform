export function parseResponse(rawResponse: string): unknown {
  let cleanText = rawResponse.trim();

  // 1. Markdown code block 제거 (```json 또는 ```)
  if (cleanText.includes('```')) {
    const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = cleanText.match(jsonBlockRegex);
    if (match && match[1]) {
      cleanText = match[1].trim();
    }
  }

  // 2. 만약 앞뒤에 설명용 자연어가 포함된 경우, 가장 처음 등장하는 '{' 와 가장 마지막 '}' 사이를 추출
  if (!cleanText.startsWith('{') || !cleanText.endsWith('}')) {
    const startIdx = cleanText.indexOf('{');
    const endIdx = cleanText.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
      cleanText = cleanText.substring(startIdx, endIdx + 1).trim();
    }
  }

  return JSON.parse(cleanText);
}
