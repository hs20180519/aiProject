from pydantic import BaseModel, PositiveInt, Field

from models.dialog_schema import DialogEntry


class InputDialogData(BaseModel):
    line_count: PositiveInt = Field(title="생성할 최소 문장 수", gt=5)
    word_pairs: dict[str, str] = Field(title="영어-한국어 단어 쌍 딕셔너리", min_items=1)

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "line_count": 7,
                    "word_pairs": {
                        "aboard": "배로",
                        "abort": "중단하다",
                        "about": "-에 대하여"
                    }
                }
            ]
        }
    }


class InputGrammarData(BaseModel):
    dialog: list[DialogEntry] = Field(title="문장 리스트", min_items=1)

    model_config = {
        "json_schema_extra": {
            "examples": [
                [
                    {
                        "speaker": "Person A",
                        "message": "Hey, have you heard about the new cruise ship that's setting sail next month?"
                    },
                    {
                        "speaker": "Person B",
                        "message": "Yes, I have! I'm actually planning to go aboard it."
                    },
                    {
                        "speaker": "Person A",
                        "message": "That's great! It's supposed to be a luxurious experience."
                    }
                ]
            ]
        }
    }
