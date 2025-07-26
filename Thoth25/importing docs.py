# This script connects to a MySQL database, creates a database and table if they do not exist,
# and processes PDF and DOCX files to extract text, which is then inserted into the database
import mysql.connector
import PyPDF2
import docx
import os


def connect_to_db(db_name):
    return mysql.connector.connect(
        host='localhost',
        user='DB4Thoth',
        password='4444',
        database='Leaz_database'
    )

#  Create table if it doesn't exist
def create_table(db_name, table_name):
    conn = connect_to_db(db_name)
    cursor = conn.cursor()
    cursor.execute(f'''
        CREATE TABLE IF NOT EXISTS `{table_name}` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            filename VARCHAR(255),
            content LONGTEXT
        )
    ''')
    conn.commit()
    cursor.close()
    conn.close()

#  Extract text from PDF
def read_pdf(filepath):
    print(f"READING PDF: {filepath}")

   
    text = ''
    with open(filepath, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ''
    return text

#  Extract text from DOCX
def read_docx(filepath):
    doc = docx.Document(filepath)
    return '\n'.join([para.text for para in doc.paragraphs])

#  Insert into table
def insert_data(db_name, table_name, text, filename):
    conn = connect_to_db(db_name)
    cursor = conn.cursor()
    query = f"INSERT INTO `{table_name}` (filename, content) VALUES (%s, %s)"
    cursor.execute(query, (filename, text))
    conn.commit()
    cursor.close()
    conn.close()

def extract_from_nested_folders(root_folder, db_name, table_name):
    for dirpath, _, filenames in os.walk(root_folder):
        for file in filenames:
            if file.lower().endswith('.pdf'):
                full_path = os.path.join(dirpath, file)
                text = read_pdf(full_path)
                if not text.strip():
                    print(f"No text extracted from: {file}")
                else:
                    insert_data(db_name, table_name, text, file)
                    print(f" Inserted: {file} from {dirpath}")
            elif file.lower().endswith('.docx'):
                full_path = os.path.join(dirpath, file)
                text = read_docx(full_path)
                insert_data(db_name, table_name, text, file)
                print(f"Inserted: {file} from {dirpath}")
#  Main function
def main():
    folder_path = r'C:\Users\ryanv\Ai\Thoth_AI25\dataset\archive\CUAD_v1\full_contract_pdf\Part_I'
    #where you stored the pdfs and docx files are stored
    db_name = 'Leaz_database' #the name of the database
    table_name = 'table'# the name of the table

   #create_database(db_name)
    create_table(db_name, table_name)

    print(f"Scanning recursively in folder: {folder_path}")
    extract_from_nested_folders(folder_path, db_name, table_name)

    print("All nested files processed and saved to database!")
    view_database(db_name, table_name)


def view_database(db_name, table_name):
    conn = connect_to_db(db_name)
    cursor = conn.cursor()
    cursor.execute(f"SELECT id, filename, LEFT(content, 100) FROM `{table_name}`")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    print(f"\nContents of `{table_name}`:")
    if not rows:
        print(" No records found.")
    for row in rows:
        print(f"ID: {row[0]} | File: {row[1]} | Preview: {row[2][:80]}...")


if __name__ == "__main__":
    main()