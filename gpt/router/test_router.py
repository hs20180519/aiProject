from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/python/api/test"
)


# https://fastapi.tiangolo.com/
# https://wikidocs.net/book/8531
# https://livvjh.com/posts/develop/fastapi-beginner/

class TestRequest(BaseModel):
    req_test: str


class TestResponse(BaseModel):
    res_test: str


@router.post(path="/hello",
             response_model=TestResponse)
async def explain_grammar_endpoint(req: TestRequest):
    print(req.req_test)
    return {"res_test": req.req_test + " world"}
