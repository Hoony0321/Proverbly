import json
from crawler_gpt import crawl_website, query_chatgpt, update_google_sheet

url = 'https://www.phrases.org.uk/meanings/proverbs.html'
proverbs = crawl_website(url)


response = query_chatgpt(proverbs[10:13])
print(response)


