import logging
import re

from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser

from models.dialog_schema import DialogResponse
from word_langchain.utils import check_words_in_dialog

DEFAULT_RETRIES = 3


def create_llm_chain(prompt, llm, verbose=True):
    return LLMChain(prompt=prompt, llm=llm, verbose=verbose)


def generate_dialog(llm_chain, variable_dict, selected_word_dict, retries=DEFAULT_RETRIES):
    dialog_result = None
    dialog_parser = PydanticOutputParser(pydantic_object=DialogResponse)

    for _ in range(retries):
        generated_result = llm_chain.generate(input_list=[variable_dict])

        logging.info(f'{generated_result.generations}')
        logging.info(f'{generated_result.llm_output}')

        # 배열이나 객체의 마지막에 위치한 쉼표(trailing comma) 제거
        dialog_fixed_json = re.sub(r',\s*([]}])', r'\1', generated_result.generations[0][0].text)

        try:
            dialog_response_content = dialog_parser.parse(dialog_fixed_json)
        except Exception as e:
            logging.error(f'Failed to parse dialog JSON: {e}')
            continue

        logging.info(f'word_list = {selected_word_dict.keys()}')
        try:
            check_result = check_words_in_dialog(word_list=list(selected_word_dict.keys()),
                                                 dialog=dialog_response_content)
        except Exception as e:
            logging.error(f'Failed to validate dialog: {e}')
            continue

        logging.info(f'validate_dialog result: {check_result}')

        if check_result:
            logging.info('All words found in dialog. Generation successful.')
            dialog_result = dialog_response_content
            break
        else:
            logging.warning('Not all words found in dialog. Retrying.')

    if dialog_result is None:
        raise Exception

    return dialog_result
