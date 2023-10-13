import uvicorn
from fastapi import FastAPI
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.middleware.cors import CORSMiddleware

from config.logging_setup import setup_logging
from router import gpt_router

setup_logging()

app = FastAPI()
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gpt_router.router)


@app.on_event("startup")
async def init_app():
    print("🚀 GPT API START 🚀")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
