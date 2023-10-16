from dotenv import load_dotenv
from langchain.callbacks import StdOutCallbackHandler
from langchain.chat_models import ChatOpenAI
from langchain.prompts import SystemMessagePromptTemplate

load_dotenv()

global system_template, system_message_prompt
system_template = """
You are an English dialog script and grammar explanation generator.
The output is always JSON in the given format.
Don't attach anything other than your answer.
Question:"""
system_message_prompt = SystemMessagePromptTemplate.from_template(system_template)

global llm
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, callbacks=[StdOutCallbackHandler()])
