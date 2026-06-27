from typing import TypedDict, List, Optional

class CustomerEmotion(TypedDict):
    current: str
    desired: str

class CustomerQuestion(TypedDict):
    question: str
    answer: str

class SellingPoint(TypedDict):
    hook: str
    description: str

class RecommendedContent(TypedDict):
    visualLayout: str
    copywriting: List[str]

class CTA(TypedDict):
    buttonText: str
    actionUrlPlaceholder: str

class StoryboardStep(TypedDict):
    step: int
    type: str
    name: str
    title: str
    objective: str
    customerEmotion: CustomerEmotion
    customerQuestion: CustomerQuestion
    sellingPoint: SellingPoint
    recommendedContent: RecommendedContent
    cta: Optional[CTA]

class Storyboard(TypedDict):
    steps: List[StoryboardStep]

class StrategyResponse(TypedDict):
    productName: str
    keyword: str
    storyboard: Storyboard

class ImageStyle(TypedDict):
    styleName: str
    elements: List[str]

class CameraAngle(TypedDict):
    angle: str
    shotType: str

class Lighting(TypedDict):
    type: str
    mood: str

class Composition(TypedDict):
    focus: str
    ruleOfThirds: bool

class StoryboardScene(TypedDict):
    step: int
    name: str
    title: str
    imagePrompt: str
    negativePrompt: str
    style: ImageStyle
    composition: Composition
    cameraAngle: CameraAngle
    lighting: Lighting

class CreativeResponse(TypedDict):
    productName: str
    keyword: str
    scenes: List[StoryboardScene]

class Sentiment(TypedDict):
    positive: int
    neutral: int
    negative: int

class AnalysisResponse(TypedDict):
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    complaints: List[str]
    jtbd: List[str]
    keywords: List[str]
    sentiment: Sentiment

class JTBD(TypedDict):
    situation: str
    coreJob: str
    emotionalOutcome: str

class PainPoint(TypedDict):
    category: str
    description: str
    severity: str

class DesiredOutcome(TypedDict):
    outcome: str
    priority: str

class PurchaseMotivation(TypedDict):
    trigger: str
    expectedBenefit: str

class PurchaseBarrier(TypedDict):
    barrier: str
    mitigationFactor: str

class UsageContext(TypedDict):
    where: str
    when: str
    how: str

class CustomerSegment(TypedDict):
    segmentName: str
    characteristics: List[str]

class UnexpectedInsight(TypedDict):
    insight: str
    implication: str

class JTBDResponse(TypedDict):
    jtbd: List[JTBD]
    painPoints: List[PainPoint]
    desiredOutcomes: List[DesiredOutcome]
    purchaseMotivation: List[PurchaseMotivation]
    purchaseBarrier: List[PurchaseBarrier]
    usageContext: List[UsageContext]
    customerSegments: List[CustomerSegment]
    unexpectedInsights: List[UnexpectedInsight]
