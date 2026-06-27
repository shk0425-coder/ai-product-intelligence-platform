from typing import Any, Dict, List, cast
from dashboard.types import (
    AnalysisResponse,
    JTBDResponse,
    StrategyResponse,
    CreativeResponse,
    StoryboardStep,
    StoryboardScene,
)

def map_analysis_response(data: Dict[str, Any]) -> AnalysisResponse:
    sentiment = data.get("sentiment", {})
    return {
        "summary": data.get("summary", ""),
        "strengths": data.get("strengths", []),
        "weaknesses": data.get("weaknesses", []),
        "complaints": data.get("complaints", []),
        "jtbd": data.get("jtbd", []),
        "keywords": data.get("keywords", []),
        "sentiment": {
            "positive": sentiment.get("positive", 0),
            "neutral": sentiment.get("neutral", 0),
            "negative": sentiment.get("negative", 0)
        }
    }

def map_jtbd_response(data: Dict[str, Any]) -> JTBDResponse:
    return {
        "jtbd": data.get("jtbd", []),
        "painPoints": data.get("painPoints", []),
        "desiredOutcomes": data.get("desiredOutcomes", []),
        "purchaseMotivation": data.get("purchaseMotivation", []),
        "purchaseBarrier": data.get("purchaseBarrier", []),
        "usageContext": data.get("usageContext", []),
        "customerSegments": data.get("customerSegments", []),
        "unexpectedInsights": data.get("unexpectedInsights", [])
    }

def map_strategy_response(data: Dict[str, Any]) -> StrategyResponse:
    storyboard = data.get("storyboard", {})
    steps = storyboard.get("steps", [])
    mapped_steps = []
    for step in steps:
        cta = step.get("cta")
        mapped_cta = {
            "buttonText": cta.get("buttonText", ""),
            "actionUrlPlaceholder": cta.get("actionUrlPlaceholder", "")
        } if cta else None
        
        mapped_steps.append({
            "step": step.get("step", 0),
            "type": step.get("type", ""),
            "name": step.get("name", ""),
            "title": step.get("title", ""),
            "objective": step.get("objective", ""),
            "customerEmotion": {
                "current": step.get("customerEmotion", {}).get("current", ""),
                "desired": step.get("customerEmotion", {}).get("desired", "")
            },
            "customerQuestion": {
                "question": step.get("customerQuestion", {}).get("question", ""),
                "answer": step.get("customerQuestion", {}).get("answer", "")
            },
            "sellingPoint": {
                "hook": step.get("sellingPoint", {}).get("hook", ""),
                "description": step.get("sellingPoint", {}).get("description", "")
            },
            "recommendedContent": {
                "visualLayout": step.get("recommendedContent", {}).get("visualLayout", ""),
                "copywriting": step.get("recommendedContent", {}).get("copywriting", [])
            },
            "cta": mapped_cta
        })
    return {
        "productName": data.get("productName", ""),
        "keyword": data.get("keyword", ""),
        "storyboard": {
            "steps": cast(List[StoryboardStep], mapped_steps)
        }
    }

def map_creative_response(data: Dict[str, Any]) -> CreativeResponse:
    scenes = data.get("scenes", [])
    mapped_scenes = []
    for scene in scenes:
        style = scene.get("style", {})
        comp = scene.get("composition", {})
        cam = scene.get("cameraAngle", {})
        light = scene.get("lighting", {})
        mapped_scenes.append({
            "step": scene.get("step", 0),
            "name": scene.get("name", ""),
            "title": scene.get("title", ""),
            "imagePrompt": scene.get("imagePrompt", ""),
            "negativePrompt": scene.get("negativePrompt", ""),
            "style": {
                "styleName": style.get("styleName", ""),
                "elements": style.get("elements", [])
            },
            "composition": {
                "focus": comp.get("focus", ""),
                "ruleOfThirds": comp.get("ruleOfThirds", False)
            },
            "cameraAngle": {
                "angle": cam.get("angle", ""),
                "shotType": cam.get("shotType", "")
            },
            "lighting": {
                "type": light.get("type", ""),
                "mood": light.get("mood", "")
            }
        })
    return {
        "productName": data.get("productName", ""),
        "keyword": data.get("keyword", ""),
        "scenes": cast(List[StoryboardScene], mapped_scenes)
     }
