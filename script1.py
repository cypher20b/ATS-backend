import PyPDF2
import nltk
import sys
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from collections import Counter

def extract_text_from_pdf(pdf_file):
    text = ""
    with open(pdf_file, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text()
    return text

def extract_keywords(text):
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word.lower() for word in tokens if word.lower() not in stop_words and word.isalnum()]
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(word) for word in filtered_tokens]
    word_freq = Counter(lemmatized_tokens)
    return word_freq

def score_pdf(job_description, pdf_text):
    job_keywords = extract_keywords(job_description)
    pdf_keywords = extract_keywords(pdf_text)
    common_keywords = job_keywords.keys() & pdf_keywords.keys()
    score = sum(job_keywords[key] for key in common_keywords)
    return score

job_description = sys.argv[2]
pdf_file = sys.argv[1]
pdf_text = extract_text_from_pdf(pdf_file)
pdf_score = score_pdf(job_description, pdf_text)
print(pdf_score)
