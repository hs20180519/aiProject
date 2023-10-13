import logging
import random

from dotenv import load_dotenv
from langchain.callbacks import StdOutCallbackHandler
from langchain.chat_models.openai import ChatOpenAI
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import HumanMessagePromptTemplate, SystemMessagePromptTemplate, \
    ChatPromptTemplate

from config.logging_setup import setup_logging
from models.grammar_schema import GrammarResponse
from word_langchain.generate import create_llm_chain, generate_dialog
from word_langchain.utils import read_vocab_from_csv, save_to_file


def initialize():
    setup_logging()
    load_dotenv()

    global system_template, system_message_prompt
    system_template = """
    You are an English dialog script and grammar explanation generator.
    The output is always JSON in the given format.
    Don't attach anything other than your answer.
    Question:"""
    system_message_prompt = SystemMessagePromptTemplate.from_template(system_template)

    global vocab_file_path, word_dict
    vocab_file_path = 'vocab2.csv'
    word_dict = read_vocab_from_csv(vocab_file_path)

    global llm
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, callbacks=[StdOutCallbackHandler()])


if __name__ == '__main__':
    initialize()

    DEFAULT_LINE_COUNT = 7
    DEFAULT_WORD_COUNT = 3

    ########################################################################################################

    line_count = DEFAULT_LINE_COUNT
    selected_words = random.sample(list(word_dict.keys()), DEFAULT_WORD_COUNT)
    selected_word_dict = {word: word_dict[word] for word in selected_words}
    english_words = ', '.join(selected_word_dict.keys())
    korean_meanings = ', '.join(selected_word_dict.values())

    dialog_human_template = \
        """
        Create a dialog with at least {line_count} lines so that the following words are used at least once:
        {english_words} ({korean_meanings}).
        Each word must be used at least once in the dialog. Ensure that the conversation, although may sound unnatural, incorporates all the specified words.
        After writing the dialog, verify that each word from the list is used by checking them off one by one:
        {{
            "dialog": [{{"speaker": "Person A", "message": "{{message}}"}},
             {{"speaker": "Person B", "message": "{{message}}"}}]
        }}
        """
    dialog_human_message_prompt = HumanMessagePromptTemplate.from_template(template=dialog_human_template)
    dialog_chat_prompt = ChatPromptTemplate.from_messages(messages=[system_message_prompt, dialog_human_message_prompt])

    dialog_llm_chain = create_llm_chain(dialog_chat_prompt, llm)
    dialog_input_variables = [line_count, english_words, korean_meanings]
    dialog_names = ['line_count', 'english_words', 'korean_meanings']
    dialog_variable_dict = {name: value for name, value in zip(dialog_names, dialog_input_variables)}

    dialog_result = generate_dialog(dialog_llm_chain, dialog_variable_dict, selected_word_dict)

    logging.info(f'{dialog_result}')

    ########################################################################################################

    grammar_human_template = \
        """
        Explain the grammatical structure of each sentence and the usage of key phrases at a B2 level or above.
        Skip the basic level of grammar:
        {dialog}
        {{
            "grammar": [{{"message": "{{message}}", "explain":  "Provide a grammatical explanation here"}}]
        }}
        """
    grammar_human_message_prompt = HumanMessagePromptTemplate.from_template(template=grammar_human_template)
    grammar_chat_prompt = ChatPromptTemplate.from_messages(
        messages=[system_message_prompt, grammar_human_message_prompt])

    grammar_llm_chain = create_llm_chain(grammar_chat_prompt, llm)
    grammar_input_variables = [dialog_result.model_dump_json()]
    grammar_names = ['dialog']
    grammar_variable_dict = {name: value for name, value in zip(grammar_names, grammar_input_variables)}

    grammar_generated_result = grammar_llm_chain.generate(input_list=[grammar_variable_dict])
    logging.info(f'{grammar_generated_result.generations}')
    logging.info(f'{grammar_generated_result.llm_output}')

    grammar_parser = PydanticOutputParser(pydantic_object=GrammarResponse)
    grammar_response_content = grammar_parser.parse(grammar_generated_result.generations[0][0].text)

    ########################################################################################################

    save_to_file(dialog=dialog_result, grammar=grammar_response_content, word_list=selected_words)
