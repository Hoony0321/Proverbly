import requests
from bs4 import BeautifulSoup
import openai
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.oauth2 import service_account
import time
import os
from dotenv import load_dotenv
import json
# .env 파일 로드
load_dotenv()

# OpenAI API 키 설정
openai.api_key = os.getenv('OPENAI_API_KEY')

# Google Sheets API 설정
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SERVICE_ACCOUNT_FILE = os.getenv('GOOGLE_SERVICE_ACCOUNT_FILE')
SPREADSHEET_ID = os.getenv('GOOGLE_SPREADSHEET_ID')

def crawl_website(url):
    """웹사이트 크롤링 함수"""
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    proverbs = []
    
    # section-content 클래스를 가진 div 찾기
    section_content = soup.find('div', class_='section-content')
    
    if section_content:
        # br 태그들을 기준으로 텍스트 분리
        elements = section_content.stripped_strings
        
        for text in elements:
            # 광고나 불필요한 텍스트 제외
            if ('ezoic' not in text.lower() and 
                'advertisement' not in text.lower() and
                len(text.strip()) > 0 and
                'here\'s a list' not in text.lower()):
                # 설명 부분 제거 (em dash 사용)
                proverb = text.strip()
                if ' – ' in proverb:
                    proverb = proverb.split(' – ')[0]
                
                proverbs.append(proverb)
    
    # 중복 제거 및 빈 문자열 제거
    proverbs = list(set([p for p in proverbs if p and len(p.strip()) > 0]))
    
    # txt 파일에 저장
    try:
        with open('proverbs.txt', 'w', encoding='utf-8') as f:
            for proverb in proverbs:
                f.write(proverb + '\n')
        print(f"총 {len(proverbs)}개의 속담이 proverbs.txt 파일에 저장되었습니다.")
    except Exception as e:
        print(f"파일 저장 중 오류 발생: {e}")
    
    return proverbs

def count_proverbs(file_path='proverbs.txt'):
    """txt 파일의 속담 수를 세는 함수"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            # 빈 줄을 제외한 실제 데이터 라인만 카운트
            proverbs = [line.strip() for line in f if line.strip()]
            count = len(proverbs)
            print(f"총 {count}개의 속담이 있습니다.")
            return count
    except FileNotFoundError:
        print(f"'{file_path}' 파일을 찾을 수 없습니다.")
        return 0
    except Exception as e:
        print(f"파일 읽기 중 오류 발생: {e}")
        return 0

def query_chatgpt(proverb):
    """ChatGPT API 호출 함수"""
    
    prompt = f"""
        Analyze the input sentence and determine if it is a valid English proverb. Return the result in JSON format with these fields:
        1. **Success**: `true` if it is a valid proverb, otherwise `false`.
        2. **Proverb**: The input sentence.
        3. **Meaning**: A brief explanation in Korean (leave empty if not a proverb).
        4. **Example**: An English sentence using the proverb in context (leave empty if not a proverb).

        **Input Sentence**:
        "{proverb}"

        **Expected Output**:
        - If valid:
        {{
        "Success": true,
        "Proverb": "{proverb}",
        "Meaning": "Provide the Korean meaning of the proverb here.",
        "Example": "Provide an example sentence using the proverb here."
        }}
        - If invalid:
        {{
        "Success": false,
        "Proverb": "{proverb}",
        "Meaning": "",
        "Example": ""
        }}
        """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"ChatGPT API 오류: {e}")
        return None

def update_google_sheet(data):
    """Google Sheets 업데이트 함수"""
    try:
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        service = build('sheets', 'v4', credentials=credentials)
        
        # 데이터 준비
        values = []
        for item in data:
            print(item)
            try:
                json_item = json.loads(item)

                if json_item['Success'] == False:
                    continue
        
                values.append([json_item['Proverb'], json_item['Meaning'], json_item['Example']])
            except:
                continue
        
        # Google Sheets에 데이터 추가
        body = {
            "values": values
        }
        service.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID,
            range='Proverb!A2',  # 시작 셀 위치
            valueInputOption='RAW',
            body=body
        ).execute()
        
        print(f"{len(values)} 행이 추가되었습니다.")
        
    except Exception as e:
        print(f"Google Sheets API 오류: {e}")

def main():
    url = os.getenv('TARGET_URL')
    
    # 1. 웹사이트 크롤링
    # crawled_data = crawl_website(url)

    # 2. 파일 읽기
    with open('proverbs.txt', 'r', encoding='utf-8') as f:
        crawled_data = f.readlines()
    
    # 4. ChatGPT 응답 수집
    responses = []
    for idx, proverb in enumerate(crawled_data[100:300]):
        response = query_chatgpt(proverb)
        print(response)
        responses.append(response)
        print(f"{idx} / {len(crawled_data)}")
    
    # 5. Google Sheets에 데이터 저장
    update_google_sheet(responses)

if __name__ == "__main__":
    main() 