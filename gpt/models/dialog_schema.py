from pydantic import BaseModel, Field


class DialogEntry(BaseModel):
    speaker: str = Field(title="화자", examples=["Person B"])
    message: str = Field(title="문장", examples=["Yes, I have! I'm actually planning to go aboard it."])


class DialogResponse(BaseModel):
    dialog: list[DialogEntry]

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "word": {
                        "aboard": "배로",
                        "abort": "중단하다",
                        "about": "-에 대하여"
                    },
                    "dialog": [
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
                        },
                        {
                            "speaker": "Person B",
                            "message": "Absolutely! I've been saving up for this trip for months."
                        },
                        {
                            "speaker": "Person A",
                            "message": "What if something goes wrong? Will they abort the trip?"
                        },
                        {
                            "speaker": "Person B",
                            "message": "I hope not! I've been looking forward to it."
                        },
                        {
                            "speaker": "Person A",
                            "message": "Well, I guess we'll just have to trust that everything will go smoothly."
                        },
                        {
                            "speaker": "Person B",
                            "message": "Definitely. I'm really excited about exploring the different destinations we'll visit."
                        },
                        {
                            "speaker": "Person A",
                            "message": "Me too! I can't wait to learn more about the cultures and history of those places."
                        },
                        {
                            "speaker": "Person B",
                            "message": "It's going to be an amazing adventure!"
                        }
                    ]
                }
            ]
        }
    }
