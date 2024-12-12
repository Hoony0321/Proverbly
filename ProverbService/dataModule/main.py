from googleapiclient.discovery import build
import psycopg2
import os.path
from dotenv import load_dotenv
from googleapiclient.discovery import build
from google.oauth2 import service_account

# .env 파일 로드
load_dotenv()

# Google Sheets API 설정
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
SPREADSHEET_ID = os.getenv('GOOGLE_SPREADSHEET_ID')
SERVICE_ACCOUNT_FILE = os.getenv('GOOGLE_SERVICE_ACCOUNT_FILE')
RANGE_NAME = 'Proverb!A2:C'  # A2부터 C열까지 데이터를 읽습니다 (헤더 제외)

def get_sheet_data():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    service = build('sheets', 'v4', credentials=credentials)
    sheet = service.spreadsheets()
    
    result = sheet.values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=RANGE_NAME
    ).execute()
    
    return result.get('values', [])

def insert_to_postgresql(data):
    conn = psycopg2.connect(
        dbname=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT')
    )
    
    cur = conn.cursor()
    
    for row in data:
        name = row[0]
        meaning = row[1]
        example = [row[2]] if len(row) > 2 else []  # example을 배열로 변환
        
        cur.execute(
            """
            INSERT INTO public.proverb (name, meaning, example)
            VALUES (%s, %s, %s)
            """,
            (name, meaning, example)
        )
    
    conn.commit()
    cur.close()
    conn.close()

def main():
    try:
        # Google Sheet에서 데이터 가져오기
        sheet_data = get_sheet_data()
        
        if not sheet_data:
            print('데이터를 찾을 수 없습니다.')
            return
        
        # PostgreSQL에 데이터 삽입
        insert_to_postgresql(sheet_data)
        print('데이터가 성공적으로 저장되었습니다.')
        
    except Exception as e:
        print(f'오류가 발생했습니다: {str(e)}')

if __name__ == '__main__':
    main()
