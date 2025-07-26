from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
import mysql.connector
import networkx as nx
import numpy as np
from pyvis.network import Network
#This file is used to create semantic embeddings and visualize relationships between clauses in a MySQL database. 
# It fetches clauses, generates embeddings, clusters them, builds a semantic graph, and provides suggestions for related documents.
# It also includes functions to create binders for document organization and preview them.
## =========================
#  Fetch from MySQL
# Fetch Clauses from DB, MySQL
def fetch_clauses():
    conn = mysql.connector.connect(
        host='localhost',
        user='DB4Thoth',
        password='4444',
        database='Leaz_database'
    )
    cursor = conn.cursor()
    cursor.execute("SELECT content FROM `table`")  # Replace with your actual table name
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return [row[0] for row in results]

list_of_clauses = fetch_clauses()
if len(list_of_clauses) < 2:
    print(f"Insufficient clauses found: {len(list_of_clauses)}.")
    exit()

# Embedding + Clustering 
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(list_of_clauses)

kmeans = KMeans(n_clusters=5, random_state=42)
labels = kmeans.fit_predict(embeddings)

print(f"Loaded {len(list_of_clauses)} clauses")
for i, clause in enumerate(list_of_clauses[:3]):
    print(f"Clause {i+1}: {clause[:80]}...")

#  Step 3: Semantic Graph Build
G = nx.DiGraph()
similarities = cosine_similarity(embeddings)
threshold = 0.75

for i in range(len(list_of_clauses)):
    for j in range(len(list_of_clauses)):
        if i != j and similarities[i][j] > threshold:
            G.add_edge(f"Clause {i}", f"Clause {j}", weight=similarities[i][j])

print(f"Graph created with {G.number_of_nodes()} nodes and {G.number_of_edges()} edges.")

# Step 4: Related Document Suggestion
def suggest_related(uploaded_text, stored_embeddings, stored_texts, model, top_n=5):
    upload_embed = model.encode([uploaded_text])
    sim_scores = cosine_similarity(upload_embed, stored_embeddings)[0]
    top_indices = sim_scores.argsort()[-top_n:][::-1]
    return [(stored_texts[i], sim_scores[i]) for i in top_indices]

# Example usage:
# uploaded_doc_text = "Sample clause text from new document..."
# suggestions = suggest_related(uploaded_doc_text, embeddings, list_of_clauses, model)
# for clause, score in suggestions:
#     print(f"Suggested match ({score:.2f}): {clause[:80]}...")

# Step 5 UI Visualization
def visualize_graph(G):
    net = Network(height="800px", width="100%", bgcolor="#222222", font_color="white")
    
    for node in G.nodes():
        net.add_node(node, label=node)

    for src, tgt, data in G.edges(data=True):
        if 'weight' in data:
            net.add_edge(src, tgt, value=data['weight'])
        else:
            net.add_edge(src, tgt)

    net.write_html("clause_graph.html") #file will need to be opened in a browser

G_simple = nx.Graph()
G_simple.add_edges_from(G.edges())
visualize_graph(G_simple)  # generate preview file