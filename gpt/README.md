## API 문서

- http://34.64.215.129/python/doc


## API URL

- http://34.64.215.129/python/api/gpt/explain-grammar
- http://34.64.215.129/python/api/gpt/generate-dialog


## 필요 토큰(헤더)

- x-token
  - elice-ai-8-1-team


## 설치 및 실행

- `pip3 install -r requirements.txt`
- `pip3 install gunicorn`
- `gunicorn -k uvicorn.workers.UvicornWorker --access-logfile ./gunicorn-access.log main:app --bind 0.0.0.0:8777 --workers 2 --timeout 100`
