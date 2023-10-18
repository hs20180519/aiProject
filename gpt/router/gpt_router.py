import logging
from typing import Annotated

from fastapi import APIRouter, HTTPException, Header, Depends, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address

from gpt.models.dialog_schema import DialogResponse
from gpt.models.gpt_request_scema import InputDialogData, InputGrammarData
from gpt.models.grammar_schema import GrammarResponse
from gpt.word_langchain.process import generate_dialog_process, generate_grammar_explain_process

router = APIRouter(
    prefix="/api/gpt"
)


async def get_token_header(x_token: Annotated[str, Header()]):
    if x_token != "elice-ai-8-1-team":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="X-Token header invalid")


limiter = Limiter(key_func=get_remote_address)


@router.post(path="/generate-dialog",
             response_model=DialogResponse,
             dependencies=[Depends(get_token_header)])
@limiter.limit("3/second")
async def generate_dialog_endpoint(request: Request, input_data: InputDialogData):
    try:
        dialog_result, selected_word_dict = await generate_dialog_process(input_data)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"OpenApi Fail in generate_dialog_endpoint {e}")

    logging.info(f'{dialog_result}')

    return {"word": selected_word_dict,
            "dialog": dialog_result.dialog}


@router.post(path="/explain-grammar",
             response_model=GrammarResponse,
             dependencies=[Depends(get_token_header)])
@limiter.limit("3/second")
async def explain_grammar_endpoint(request: Request, dialog: InputGrammarData):
    grammar_response_content = await generate_grammar_explain_process(dialog)

    return {"grammar": grammar_response_content.grammar}
