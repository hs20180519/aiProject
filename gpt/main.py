import uvicorn
from fastapi import FastAPI
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.middleware.cors import CORSMiddleware

from config.logging_setup import setup_logging
from router import gpt_router
from router import grammar_router

setup_logging()

app = FastAPI()
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "http://34.64.87.27",
    "https://34.64.87.27",
    "http://kdt-ai-8-team01-1.elicecoding.com",
    "https://kdt-ai-8-team01-1.elicecoding.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gpt_router.router)
app.include_router(grammar_router.router)

@app.on_event("startup")
async def init_app():
    print("🚀 GPT API START 🚀")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8777, reload=True)
