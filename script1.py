import sys
import json
from PyPDF2 import PdfFileReader
from pathlib import Path
pdf = PdfFileReader(str(sys.argv[1]))

page_1_text= pdf.getPage(0).extractText()
# print(page_1_object)
text=''
for page in pdf.pages:
        text += page.extractText()
#print(json.dumps(text)) #<json version of the parsed pdf>
print(text) 
sys.stdout.flush()
# print('python script running cool ', str(sys.argv[1]))