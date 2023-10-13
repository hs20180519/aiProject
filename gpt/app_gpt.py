import csv
import datetime
import json
import logging
import os
import random
import re

import openai
from dotenv import load_dotenv
from pydantic import ValidationError

from config.logging_setup import setup_logging
from models.dialog_schema import DialogResponse

OPENAI_MODEL = "gpt-3.5-turbo"
SYSTEM_MESSAGE_CONTENT = ("You are an English dialog script and grammar explanation generator. "
                          "The output is always JSON in the given format. "
                          "Don't attach anything other than your answer.")

MAX_ATTEMPTS = 10


def initialize():
    load_dotenv()
    setup_logging()
    openai.api_key = os.getenv("OPENAI_API_KEY")


def check_words_in_script(word_list, script):
    dialogue_content = ' '.join([item['message'] for item in script['dialogue']]).lower()
    for word in word_list:
        if len(word) > 1:
            pattern = re.compile(rf'\b{word}\b')
        else:
            pattern = re.compile(rf'(?<![a-zA-Z]){word}(?![a-zA-Z])')
        if not pattern.search(dialogue_content):
            return False
    return True


def generate_dialogue_prompt(word_dict, line_count):
    english_words = ', '.join(word_dict.keys())
    korean_meanings = ', '.join(word_dict.values())
    return f"""
        Generate a {line_count}-line dialogue ensuring that the following words are used at least once:
    {english_words} ({korean_meanings}).
        Even if it makes the conversation sound unnatural, make sure every specified word is used. 
        After writing the dialogue, double-check to make sure you haven't missed any of the words:
        {{
            "dialogue": [{{"speaker": "Person A", "message": "{{message}}"}}, {{"speaker": "Person B", "message": "{{message}}"}}]
        }}
    """


def request_dialogue(prompt):
    try:
        response = openai.ChatCompletion.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_MESSAGE_CONTENT},
                {"role": "user", "content": prompt},
            ],
        )
        response_content = response.choices[0].message.content.strip()
        response_obj = json.loads(response_content)
        response_content_fixed = json.dumps(response_obj)
        return DialogResponse.model_validate_json(response_content_fixed).model_dump()
    except (ValidationError, json.JSONDecodeError, Exception) as e:
        logging.error(f"An error occurred: {e}", exc_info=True)


def generate_script(word_dict, line_count):
    prompt = generate_dialogue_prompt(word_dict=word_dict, line_count=line_count)
    for attempt in range(1, MAX_ATTEMPTS + 1):
        logging.info(f'Attempt {attempt} to generate script.')
        dialogue_json = request_dialogue(prompt=prompt)
        if dialogue_json:
            if check_words_in_script(word_list=list(word_dict.keys()), script=dialogue_json):
                logging.info('All words found in script. Generation successful.')
                return dialogue_json
            else:
                logging.warning('Not all words found in script. Retrying.')
        else:
            logging.error('Dialogue generation failed.')
    logging.error('All attempts failed. Returning None.')


def save_script_to_file(script, word_list):
    result_with_word_list = {
        "word_list": word_list,
        "script": script
    }
    formatted_result = json.dumps(result_with_word_list, indent=2, ensure_ascii=False, separators=(',', ': '))
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f'script_{timestamp}.json'
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(formatted_result)
    logging.info(f'Script saved to file: {filename}')

    # if dialogue_json:
    #     grammar_json = generate_grammar_explanations(dialogue_json)
    #     if grammar_json:
    #         script_json = {
    #             "situation": situation,
    #             "line_count": line_count,
    #             "dialogue": dialogue_json['dialogue'],
    #             "grammar": grammar_json['grammar'],
    #         }
    #         return script_json
    # return None


def read_vocab_from_csv(file_path):
    word_dict = {}
    with open(file_path, 'r', encoding='utf-8') as f:
        csv_reader = csv.reader(f)
        next(csv_reader)
        for row in csv_reader:
            english_word = row[0].strip()
            korean_meaning = row[1].strip()
            word_dict[english_word] = korean_meaning
    return word_dict


if __name__ == '__main__':
    vocab_file_path = 'vocab2.csv'
    word_dict = read_vocab_from_csv(vocab_file_path)

    initialize()

    for i in range(5):
        line_count = 7

        selected_words = random.sample(list(word_dict.keys()), 5)
        selected_word_dict = {word: word_dict[word] for word in selected_words}

        script = generate_script(word_dict=selected_word_dict, line_count=line_count)
        if script:
            save_script_to_file(script=script, word_list=list(selected_word_dict.keys()))
        else:
            print("Script generation failed.")
