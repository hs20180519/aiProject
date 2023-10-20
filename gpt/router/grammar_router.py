from fastapi import APIRouter, FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()
gec_pipe = pipeline(model="hs2019125/gec-fine-tuned")

router = APIRouter(
    prefix="/api/grammar"
)

class Sentence(BaseModel):
    sentence: str

@router.post('/correct')
async def correct_text(sentence: Sentence):
    corrected_sentence = gec_pipe(sentence.sentence, max_length=128, num_beams=5)[0]['generated_text']
    return {corrected_sentence}