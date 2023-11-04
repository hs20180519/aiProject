import csv
import datetime
import json
import logging
import os
import re
import tempfile


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


def check_words_in_dialog(word_list, dialog):
    logging.info(f"Dialog: {dialog}")
    dialog_content = ' '.join([item.message for item in dialog.dialog]).lower()
    logging.info(f"Dialog content: {dialog_content}")

    for word in word_list:
        if len(word.split()) >= 4:
            logging.info(f"Skipping word: {word}")
            continue

        # 슬래시('/')를 포함하는 표현은 체크에서 제외
        if '/' in word or ' ' in word:
            logging.info(f"Skipping phrase with special characters or spaces: {word}")
            continue

        # '(n)'과 같은 부분을 제거
        clean_word = re.sub(r'\s?\(.*?\)', '', word).lower()

        # 공백이나 특수문자가 포함된 단어/표현의 경우 \b 경계를 사용하지 않습니다.
        if ' ' in clean_word or any(not c.isalnum() for c in clean_word):
            pattern = re.compile(re.escape(clean_word))
        else:
            pattern = re.compile(rf'\b{clean_word}[a-z]*\b')

        match = pattern.search(dialog_content)
        logging.info(f"Searching for word: {word}, Match found: {match}")

        if not match:
            logging.warning(f"Word not found: {word}")
            return False

    return True


def save_to_file(dialog, grammar, word_list):
    result_with_word_list = {
        "word_list": word_list,
        "dialog": dialog.model_dump()["dialog"],
        "grammar": grammar.model_dump()["grammar"]
    }
    formatted_result = json.dumps(result_with_word_list, indent=2, ensure_ascii=False, separators=(',', ': '))
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f'./result{timestamp}.json'
    temp_dir = tempfile.mkdtemp()
    temp_filename = os.path.join(temp_dir, filename)

    with open(temp_filename, 'w', encoding='utf-8') as f:
        f.write(formatted_result)
    os.rename(temp_filename, filename)
    logging.info(f'Result saved to file: {filename}')
