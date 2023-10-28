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
- python 버전 3.10.13 이상
- `.env` 파일 생성 후 OpenAI api 토큰 발급받아서 `OPENAI_API_KEY=토큰` 형식으로 설정
- mac pip 안될 때 : `pip3 install —upgrade pip`
- `pip3 install -r requirements.txt`
- 로컬인 경우 : `uvicorn main:app --port=8777` 또는 `python3 main.py`

## vm 에서 실행
- python 버전 3.10.13 이상
- virtualenv  설정
  - `pip install virtualenv`
  - `virtualenv .venv -p python3.10.13`
  - `source .venv/bin/activate`
    - 또는 `pyenv virtualenv 3.10.13 elice-ai`
- `.env` 파일 생성 후 OpenAI api 토큰 발급받아서 `OPENAI_API_KEY=토큰` 형식으로 설정
- `pip install gunicorn`
- `pip install -r requirements.txt`
- `gunicorn -k uvicorn.workers.UvicornWorker --access-logfile ./gunicorn-access.log main:app --bind 0.0.0.0:8777 --workers 2 --timeout 100`

## vm 서비스 등록
```
[Unit]
Description=Gunicorn service for my FastAPI app
After=network.target

[Service]
User=elice
Group=elice
WorkingDirectory=/home/elice/team1/gpt
ExecStart=/home/elice/team1/gpt/.venv/bin/gunicorn -k uvicorn.workers.UvicornWorker --access-logfile /home/elice/team1/gpt/gunicorn-access.log main:app --bind 0.0.0.0:8777 --workers 2 --timeout 100

[Install]
WantedBy=multi-user.target
```

- `sudo vi /etc/systemd/system/myapi.service`
- `sudo systemctl daemon-reload`
- `sudo systemctl start myapi.service`

- 시스템이 시작될 때 자동으로 시작되도록 등록
  - `sudo systemctl enable myapi`
- 로그확인
  - `sudo journalctl -u myapi -f`

## nginx 설정
```
location = /openapi.json {
    rewrite ^ /python/openapi.json permanent;
}

location /python/api/ {
    proxy_pass http://10.178.0.12:8777;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

location /python/doc/ {
    proxy_pass http://10.178.0.12:8777/redoc;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

location = /python/openapi.json {
    proxy_pass http://10.178.0.12:8777/openapi.json;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```
- `sudo vi /etc/nginx/sites-enabled/default`
- `sudo nginx -t `
- `sudo systemctl reload nginx`

## 참고 링크
- https://velog.io/@ifthenelse/pyenv-virtualenv-%EC%84%A4%EC%B9%98-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
- https://cresilience.tistory.com/entry/python-pyenv-%EA%B0%80%EC%83%81%ED%99%98%EA%B2%BD-%EC%84%A4%EC%A0%95-feat-pyenv-virtualenv
- https://stackoverflow.com/questions/70431655/importerror-cannot-import-name-html5lib-from-pip-vendor-usr-lib-python3
