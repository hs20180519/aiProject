from pydantic import BaseModel


class TranslationRequest(BaseModel):
    source: str
    target: str
    text: str


class TranslationResponse(BaseModel):
    translatedText: str
