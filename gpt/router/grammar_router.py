from fastapi import HTTPException, APIRouter, FastAPI, status
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
    try:

        if len(sentence.sentence) > 256:
            raise ValueError('256자 이상의 문장은 교정이 불가능합니다.')
        
        if len(sentence.sentence)==0:
            raise ValueError('문장이 입력되지 않았습니다.')

        corrected_sentence = gec_pipe(sentence.sentence, max_length=256, num_beams=5)[0]['generated_text']
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{e} 문장 교정에 실패했습니다. 다시 시도해주세요."
        )
    return {corrected_sentence}