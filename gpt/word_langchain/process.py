import logging

from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import HumanMessagePromptTemplate, ChatPromptTemplate

from gpt.models.grammar_schema import GrammarResponse
from gpt.word_langchain import system_message_prompt, llm
from gpt.word_langchain.generate import create_llm_chain, generate_dialog


async def generate_dialog_process(input_data):
    line_count = input_data.line_count
    selected_word_dict = input_data.word_pairs
    english_words = ', '.join(selected_word_dict.keys())
    korean_meanings = ', '.join(selected_word_dict.values())
    dialog_human_template = \
        """Create a dialog with at least {line_count} lines so that the following words are used at least once:
         {english_words} ({korean_meanings}). Each word must be used at least once in the dialog. Ensure that the 
        conversation, although may sound unnatural, incorporates all the specified words. After writing the dialog, 
        verify that each word from the list is used by checking them off one by one:
        
        Please answer only in the following format.
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
    return dialog_result, selected_word_dict


async def generate_grammar_explain_process(dialog):
    grammar_human_template = \
        """
        In each sentence, pick three grammatical structures at the B2 level or higher and explain them concisely in Korean.
                
        Dialog to explain: {dialog}

        Please answer only in the following format.
        {{
            "grammar": [{{"message": "phrases to explain", 
            "explain":  "Provide a grammatical explanation here in Korean"}}]
        }}
        """
    grammar_human_message_prompt = HumanMessagePromptTemplate.from_template(template=grammar_human_template)
    grammar_chat_prompt = ChatPromptTemplate.from_messages(
        messages=[system_message_prompt, grammar_human_message_prompt])
    # 연결된 체인(Chain)객체 생성
    grammar_llm_chain = create_llm_chain(grammar_chat_prompt, llm)
    grammar_input_variables = [dialog.model_dump_json()]
    grammar_names = ['dialog']
    grammar_variable_dict = {name: value for name, value in zip(grammar_names, grammar_input_variables)}
    grammar_generated_result = grammar_llm_chain.generate(input_list=[grammar_variable_dict])
    logging.info(f'{grammar_generated_result.generations}')
    logging.info(f'{grammar_generated_result.llm_output}')
    grammar_parser = PydanticOutputParser(pydantic_object=GrammarResponse)
    grammar_response_content = grammar_parser.parse(grammar_generated_result.generations[0][0].text)
    return grammar_response_content
