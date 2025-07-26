from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
import mysql.connector
import networkx as nx
import numpy as np
#
# =========================
#  Fetch from MySQL
# Fetch Clauses from MySQL 
def fetch_clauses():
    conn = mysql.connector.connect(
        host='localhost',
        user='DB4Thoth',
        password='4444',
        database='Leaz_database'
    )
    cursor = conn.cursor()
    cursor.execute("SELECT content FROM `table`")  # Replace `table` with actual table name
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return [row[0] for row in results]

list_of_clauses = fetch_clauses()
if not list_of_clauses:
    print("No clauses found. Check your database query or input source.")
    exit()
if len(list_of_clauses) < 2:
    print(f"Need at least 2 clauses to perform clustering. Found {len(list_of_clauses)}.")
    exit()

#  Generate Embeddings ---
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(list_of_clauses)

#  Cluster Clauses ---
kmeans = KMeans(n_clusters=5, random_state=42)
labels = kmeans.fit_predict(embeddings)

print(f"Loaded {len(list_of_clauses)} clauses")
for i, clause in enumerate(list_of_clauses[:3]):
    print(f"Clause {i+1}: {clause[:80]}...")

# Build Semantic Dependency Graph ---
G = nx.DiGraph()
similarities = cosine_similarity(embeddings)
threshold = 0.75  #  value to control graph density

for i in range(len(list_of_clauses)):
    for j in range(len(list_of_clauses)):
        if i != j and similarities[i][j] > threshold:
            G.add_edge(f"Clause {i}", f"Clause {j}", weight=similarities[i][j])

print(f"Graph created with {G.number_of_nodes()} nodes and {G.number_of_edges()} edges."
)