from langchain_core.prompts import ChatPromptTemplate

def create_prompt_from_template(template):
   prompt = ChatPromptTemplate.from_template(template)
   return prompt
