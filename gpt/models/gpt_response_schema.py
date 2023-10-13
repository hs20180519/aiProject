from typing import Dict

from pydantic import BaseModel, Field

from models.dialog_schema import DialogEntry
from models.grammar_schema import GrammarExplanation


class GptResponse(BaseModel):
    word: Dict[str, str] = Field(title="영어-한국어 단어 쌍 딕셔너리")
    dialog: list[DialogEntry] = Field(title="대화 리스트")
    grammar: list[GrammarExplanation] = Field(title="문법 설명 리스트")

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
                    ],
                    "grammar": [
                        {
                            "message": "Hey, have you heard about the new cruise ship that's setting sail next month?",
                            "explain": "This sentence is a simple interrogative sentence in the present perfect tense. The subject 'you' is followed by the auxiliary verb 'have' and the past participle 'heard'. The phrase 'about the new cruise ship' functions as a prepositional phrase modifying the verb 'heard'. The relative clause 'that's setting sail next month' provides additional information about the cruise ship."
                        },
                        {
                            "message": "Yes, I have! I'm actually planning to go aboard it.",
                            "explain": "This sentence is a declarative sentence in the present continuous tense. The subject 'I' is followed by the auxiliary verb 'am' and the present participle 'planning'. The phrase 'to go aboard it' functions as an infinitive phrase indicating the purpose of the planning."
                        },
                        {
                            "message": "That's great! It's supposed to be a luxurious experience.",
                            "explain": "This sentence is a declarative sentence in the present simple tense. The phrase 'That's great!' is an exclamation expressing enthusiasm. The pronoun 'It' is followed by the copula verb 'is' and the adjective 'supposed'. The phrase 'to be a luxurious experience' functions as an infinitive phrase indicating the nature of the experience."
                        },
                        {
                            "message": "Absolutely! I've been saving up for this trip for months.",
                            "explain": "This sentence is an affirmative sentence in the present perfect continuous tense. The adverb 'Absolutely!' emphasizes agreement. The subject 'I' is followed by the auxiliary verb 'have' and the present participle 'been'. The phrase 'for this trip' functions as a prepositional phrase indicating the purpose of the saving."
                        },
                        {
                            "message": "What if something goes wrong? Will they abort the trip?",
                            "explain": "The first sentence is an interrogative sentence in the present simple tense. The phrase 'What if' introduces a hypothetical situation. The subject 'something' is followed by the verb 'goes' and the adjective 'wrong'. The second sentence is an interrogative sentence in the future simple tense. The subject 'they' is followed by the auxiliary verb 'will' and the base form of the verb 'abort'."
                        },
                        {
                            "message": "I hope not! I've been looking forward to it.",
                            "explain": "This sentence is an affirmative sentence in the present simple tense. The pronoun 'I' is followed by the verb 'hope' and the adverb 'not'. The phrase 'I've been looking forward to it' is in the present perfect continuous tense, indicating an ongoing action. The phrase 'to it' functions as an infinitive phrase indicating the object of the looking forward."
                        },
                        {
                            "message": "Well, I guess we'll just have to trust that everything will go smoothly.",
                            "explain": "This sentence is a declarative sentence in the future simple tense. The adverb 'Well' indicates a pause or hesitation. The pronoun 'I' is followed by the verb 'guess' and the pronoun 'we'. The auxiliary verb 'will' is followed by the base form of the verb 'have' and the infinitive 'to trust'. The relative clause 'that everything will go smoothly' provides additional information about the trust."
                        },
                        {
                            "message": "Definitely. I'm really excited about exploring the different destinations we'll visit.",
                            "explain": "This sentence is an affirmative sentence in the present continuous tense. The adverb 'Definitely' emphasizes agreement. The pronoun 'I' is followed by the auxiliary verb 'am' and the present participle 'excited'. The phrase 'about exploring the different destinations' functions as a prepositional phrase modifying the verb 'excited'. The pronoun 'we' is followed by the auxiliary verb 'will' and the base form of the verb 'visit'."
                        },
                        {
                            "message": "Me too! I can't wait to learn more about the cultures and history of those places.",
                            "explain": "This sentence is an affirmative sentence in the present simple tense. The pronoun 'Me' is followed by the adverb 'too'. The pronoun 'I' is followed by the auxiliary verb 'can't' and the base form of the verb 'wait'. The phrase 'to learn more about the cultures and history of those places' functions as an infinitive phrase indicating the object of the waiting."
                        },
                        {
                            "message": "It's going to be an amazing adventure!",
                            "explain": "This sentence is a declarative sentence in the future continuous tense. The pronoun 'It' is followed by the copula verb 'is' and the present participle 'going'. The phrase 'to be an amazing adventure' functions as an infinitive phrase indicating the nature of the adventure."
                        }
                    ]
                }
            ]
        }
    }
