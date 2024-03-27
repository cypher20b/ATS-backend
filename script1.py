import sys
import json
from PyPDF2 import PdfFileReader
from pathlib import Path
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from collections import Counter
pdf = PdfFileReader(str(sys.argv[1]))

page_1_text= pdf.getPage(0).extractText()
# print(page_1_object)
text=''
for page in pdf.pages:
        text += page.extractText()
#print(json.dumps(text)) #<json version of the parsed pdf>
def extract_keywords(txt):
        tokens - word_tokenize(txt)
        stop_words = set(stopwords.words('english'))
        filtered_tokens = [word.lower() for word in tokens if word.lower() not in stop_words and word.isalnum()]
        lemmatizer - WordNetLemmatizer()
        lemmatized_tokens = [lemmatizer.lemmatize(word) for word in filtered_tokens]
        num_keywords = 10
        keywords = word_freq.most_common(num_keywords)
        return keywords

keywd = extract_keywords(text)
print(keywd) 
print(text) 
sys.stdout.flush()
# print('python script running cool ', str(sys.argv[1]))