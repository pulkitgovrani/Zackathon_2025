from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
import mysql.connector
import numpy as np
# This file is used to create semantic embeddings and visualize relationships between clauses in a MySQL database.
# It fetches clauses, generates embeddings, clusters them, builds a semantic graph, and provides suggestions for related documents.
#   It also includes functions to create binders for document organization and preview them.
#
#  =========================
#  Fetch from MySQL
# =========================
def fetch_clauses_from_db():
    conn = mysql.connector.connect(
        host="localhost",
        user="DB4Thoth",        # the username for your MySQL database
        password="4444",    # the password for your MySQL database
        database="Leaz_database"       #  the name of your MySQL database
    )
    cursor = conn.cursor()
    cursor.execute("SELECT id, filename, content FROM `table`")  # Replace `table` with your actual table name
    results = cursor.fetchall()
    conn.close()

    # Structure: list of dicts for downstream traceability
    return [{"id": r[0], "filename": r[1], "content": r[2]} for r in results if r[2]]

# =========================
# Step 1: Create Binders
# =========================
def create_binders(doc_items, model, num_binders=3):
    contents = [d["content"] for d in doc_items]
    embeddings = model.encode(contents)
    kmeans = KMeans(n_clusters=num_binders, random_state=42)
    labels = kmeans.fit_predict(embeddings)

    binders = {i: [] for i in range(num_binders)}
    for idx, label in enumerate(labels):
        entry = doc_items[idx].copy()
        entry["embedding"] = embeddings[idx]  # optional: keep embedding
        binders[label].append(entry)

    return binders, kmeans.cluster_centers_

# =========================
#  Step 2: Suggest Binder
# =========================
def suggest_binder(upload_text, model, binder_centroids):
    new_embed = model.encode([upload_text])
    similarities = cosine_similarity(new_embed, binder_centroids)[0]
    best_match = int(np.argmax(similarities))
    return best_match, similarities[best_match]

# =========================
#  Step 3: Preview Binder
# =========================
def preview_binder(binders, binder_id):
    print(f"\n Suggested Binder: #{binder_id}")
    print("Top related documents:")
    for i, doc in enumerate(binders[binder_id][:3]):
        preview = doc["content"][:80].replace("\n", " ")
        print(f" - [{doc['filename']}] {preview}...")

# =========================
# Step 4: Run Everything
# =========================
def run_demo():
    model = SentenceTransformer('all-MiniLM-L6-v2')

    print("\n Connecting to database and loading documents...")
    doc_items = fetch_clauses_from_db()
    print(f" Retrieved {len(doc_items)} entries.")

    print("\n Clustering into binders...")
    binders, centroids = create_binders(doc_items, model)

    # Example new document
    upload_text = "This document outlines responsibilities for handling sensitive customer data."

    print("\n New Upload:")
    print(upload_text)

    binder_id, confidence = suggest_binder(upload_text, model, centroids)
    print(f"\n Suggested Binder: #{binder_id} with confidence {confidence:.4f}")
    preview_binder(binders, binder_id)

if __name__ == "__main__":
    run_demo()