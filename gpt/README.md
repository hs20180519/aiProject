## API 문서

- http://34.64.215.129/python/doc

## API URL

- 로컬 환경인 경우 (외부에서 접속 시 주소 다른 것에 주의)
  - http://localhost:8777/api/gpt/explain-grammar
  - http://localhost:8777/api/gpt/generate-dialog
- 운영 환경인 경우
  - http://34.64.215.129/python/api/gpt/explain-grammar
  - http://34.64.215.129/python/api/gpt/generate-dialog

## 필요 토큰(헤더)

- x-token
  - elice-ai-8-1-team

## 설치 및 실행

- `.env` 파일 생성 후 OpenAI api 토큰 발급받아서 `OPENAI_API_KEY=토큰` 형식으로 설정
- mac pip 안될 때 : `pip3 install —upgrade pip`
- `pip3 install -r requirements.txt`
- 로컬인 경우 : `uvicorn main:app --port=8777` 또는 `python3 main.py`

## vm 에서 실행

- `pip3 install gunicorn`
- `gunicorn -k uvicorn.workers.UvicornWorker --access-logfile ./gunicorn-access.log main:app --bind 0.0.0.0:8777 --workers 2 --timeout 100`
