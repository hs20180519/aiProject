from pydantic import BaseModel, Field


class GrammarExplanation(BaseModel):
    message: str = Field(title="문장", examples=["It's incredible"])
    explain: str = Field(title="문법 설명", examples=[
        "'It's incredible'은 'it is'의 축약형으로, 놀라운 것을 나타내는 표현입니다."
        " 이는 어떤 사실이나 현상이 매우 놀라움을 나타내며, 주로 주장이나 설명에 사용됩니다."
    ])


class GrammarResponse(BaseModel):
    grammar: list[GrammarExplanation]

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "grammar": [
                        {
                            "message": "Absolutely!",
                            "explain": "'Absolutely!'는 강한 동의를 나타내는 표현으로, 주로 긍정적인 의견이나 주장에 사용됩니다. 이는 확신을 강조하거나 상대방의 의견을 강력하게 지지하는 뜻을 가집니다."
                        },
                        {
                            "message": "It's incredible",
                            "explain": "'It's incredible'은 'it is'의 축약형으로, 놀라운 것을 나타내는 표현입니다. 이는 어떤 사실이나 현상이 매우 놀라움을 나타내며, 주로 주장이나 설명에 사용됩니다."
                        },
                        {
                            "message": "how the bond between atoms can determine the properties of a substance",
                            "explain": "'how'는 어떻게 또는 어떤 방식으로를 나타내는 부사로, 문장에서 동사나 형용사를 수정하거나 물음을 나타내는 역할을 합니다. 'the bond between atoms can determine the properties of a substance'는 명사구로, 원자 간의 결합이 물질의 특성을 결정할 수 있다는 것을 나타냅니다."
                        }
                    ]
                }
            ]
        }
    }
