from pydantic import BaseModel, Field


class TranslationRequest(BaseModel):
    source: str = Field(title="번역 원본 언어", examples=["en"])
    target: str = Field(title="번역 대상 언어", examples=["ko"])
    text: str = Field(title="번역 할 문장", examples=["It's incredible"])

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "source": "en",
                    "target": "ko",
                    "text": "Indeed. Understanding chemical bonds is crucial in fields like materials "
                            "science and chemistry."
                }
            ]
        }
    }


class TranslationResponse(BaseModel):
    translatedText: str = Field(title="번역 된 문장", examples=["놀랍습니다."])

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "translatedText": "맞아요. 화학적 결합을 이해하는 것은 재료 과학, 화학과 같은 분야에서 중요합니다."
                }
            ]
        }
    }
