from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import pickle
import torch
import pandas as pd
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
embeddings_path = os.getenv('EMBEDDINGS_PATH', 'kb_embeddings.pkl')
model_path = os.getenv('MODEL_PATH', './model')  # Path ke folder model hasil ekstrak zip

# Load precomputed embeddings
try:
    with open(embeddings_path, 'rb') as file:
        kb_embeddings = pickle.load(file)
    print(f"Embeddings loaded successfully, shape: {kb_embeddings.shape}")
except Exception as e:
    print(f"Error loading embeddings: {e}")
    kb_embeddings = None

# Load SentenceTransformer model
try:
    encoder = SentenceTransformer(model_path)  # Muat model dari folder
    print("Encoder model loaded successfully")
except Exception as e:
    print(f"Error loading encoder: {e}")
    encoder = None

# Load responses from CSV pertama (knowledge base)
try:
    kb_df = pd.read_csv('fine-tuning - knowledge_base_finbuddy.csv')  # Ganti dengan nama file CSV-mu
    responses = kb_df['Jawaban'].tolist()  # Ganti 'jawaban' dengan nama kolom yang sesuai
    print(f"Loaded {len(responses)} responses from CSV")
except Exception as e:
    print(f"Error loading responses: {e}")
    responses = []

@app.route('/predict', methods=['POST'])
def predict():
    if kb_embeddings is None or encoder is None or not responses:
        return jsonify({'error': 'Embeddings, encoder, or responses not loaded'}), 500

    try:
        data = request.get_json()
        user_message = data.get('message', '')
        print(f"Received message: {user_message}")

        if not user_message.strip():
            return jsonify({'response': 'Silakan masukkan pertanyaan.'})

        # Encode user message
        user_embedding = encoder.encode(user_message, convert_to_tensor=True)
        print(f"User embedding shape: {user_embedding.shape}")

        # Compute cosine similarity
        similarities = util.cos_sim(user_embedding, kb_embeddings)[0]
        print(f"Similarities: {similarities}")

        # Find the most similar embedding
        best_match_idx = torch.argmax(similarities).item()
        highest_similarity = similarities[best_match_idx].item()
        print(f"Best match index: {best_match_idx}, similarity: {highest_similarity}")

        # Return the corresponding response
        if highest_similarity > 0.5:
            if best_match_idx < len(responses):
                response = responses[best_match_idx]
            else:
                response = "Maaf, respons tidak ditemukan untuk indeks ini."
        else:
            response = "Maaf, saya tidak mengerti pertanyaan Anda."

        return jsonify({'response': response})

    except Exception as e:
        print(f"Error in predict: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)