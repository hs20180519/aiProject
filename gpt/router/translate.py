import json
import os

import requests
from dotenv import load_dotenv

load_dotenv()

client_id = os.environ.get("REACT_APP_TRANS_ID")
client_secret = os.environ.get("REACT_APP_TRANS_SECRET")


async def translate_text(query):
    try:
        print(f"Translating text: {query}")

        data = {
            'source': query.source,
            'target': query.target,
            'text': query.text
        }

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Naver-Client-Id': client_id,
            'X-Naver-Client-Secret': client_secret,
        }

        response = requests.post('https://openapi.naver.com/v1/papago/n2mt', data=data, headers=headers)

        if response.status_code == 200:
            translated_text = json.loads(response.text)["message"]["result"]["translatedText"]
            print(f"Translation successful: {translated_text}")
            return translated_text
        else:
            print(f"Unexpected response code: {response.status_code}")
            return json.dumps({"error": f"Error code: {response.status_code}"})

    except Exception as e:
        print(f"An error occurred: {e}")
        return json.dumps({"error": "An error occurred"})
