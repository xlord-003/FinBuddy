from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import pickle
import torch
import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
embeddings_path = os.getenv('EMBEDDINGS_PATH', 'kb_embeddings.pkl')
model_path = os.getenv('MODEL_PATH', './model')

# Load precomputed embeddings untuk chatbot
try:
    with open(embeddings_path, 'rb') as file:
        kb_embeddings = pickle.load(file)
    print(f"Embeddings loaded successfully, shape: {kb_embeddings.shape}")
except Exception as e:
    print(f"Error loading embeddings: {e}")
    kb_embeddings = None

# Load SentenceTransformer model untuk chatbot
try:
    encoder = SentenceTransformer(model_path)
    print("Encoder model loaded successfully")
except Exception as e:
    print(f"Error loading encoder: {e}")
    encoder = None

# Load responses dari CSV untuk chatbot
try:
    kb_df = pd.read_csv('fine-tuning - knowledge_base_finbuddy.csv')
    responses = kb_df['Jawaban'].tolist()
    print(f"Loaded {len(responses)} responses from CSV")
except Exception as e:
    print(f"Error loading responses: {e}")
    responses = []

# Load model dan preprocessor untuk klasifikasi perilaku
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, InputLayer
import joblib

try:
    # Muat label encoder terlebih dahulu
    label_encoder = joblib.load("mod_klas/label_encoder.pkl")
    num_classes = len(label_encoder.classes_)
    print(f"Label Encoder loaded. Classes: {list(label_encoder.classes_)}, Number of classes: {num_classes}")

    # Definisikan ulang arsitektur model sesuai kode pelatihan
    model = Sequential([
        Dense(128, activation="relu", input_shape=(14,)),
        Dropout(0.3),
        Dense(64, activation="relu"),
        Dense(num_classes, activation="softmax")  # Gunakan num_classes dari label_encoder
    ])

    # Muat bobot
    model.load_weights("mod_klas/mlp_behavior_model.h5")
    print("Model weights loaded successfully")

    # Compile model dengan konfigurasi sama seperti saat pelatihan
    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    print("Model compiled successfully")

    # Muat preprocessor
    preprocessor = joblib.load("mod_klas/preprocessor.pkl")
    print("Preprocessor loaded successfully")

    print("Classification model and preprocessors loaded successfully")
except Exception as e:
    print(f"Error loading classification model or preprocessors: {str(e)}")
    model = None
    preprocessor = None
    label_encoder = None

# Endpoint untuk chatbot (tetap sama)
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

# Endpoint baru untuk klasifikasi perilaku
@app.route('/predict_behavior', methods=['POST'])
def predict_behavior():
    if model is None or preprocessor is None or label_encoder is None:
        return jsonify({'error': 'Classification model or preprocessors not loaded'}), 500

    try:
        data = request.get_json()

        # Validasi input
        required_fields = [
            'monthly_income', 'financial_aid', 'tuition', 'housing', 'food',
            'transportation', 'books_supplies', 'entertainment', 'personal_care',
            'technology', 'health_wellness', 'miscellaneous'
        ]
        for field in required_fields:
            if field not in data or data[field] is None:
                return jsonify({'error': f'Missing field: {field}'}), 400

        # Hitung total_spending dan disposable_income
        expenses = [
            data['tuition'], data['housing'], data['food'], data['transportation'],
            data['books_supplies'], data['entertainment'], data['personal_care'],
            data['technology'], data['health_wellness'], data['miscellaneous']
        ]
        total_spending = sum(expenses)
        disposable_income = data['monthly_income'] + data['financial_aid']

        if disposable_income <= 0:
            return jsonify({'error': 'Disposable income <= 0'}), 400

        # Buat DataFrame
        input_data = pd.DataFrame([{
            "monthly_income": data['monthly_income'],
            "financial_aid": data['financial_aid'],
            "tuition": data['tuition'],
            "housing": data['housing'],
            "food": data['food'],
            "transportation": data['transportation'],
            "books_supplies": data['books_supplies'],
            "entertainment": data['entertainment'],
            "personal_care": data['personal_care'],
            "technology": data['technology'],
            "health_wellness": data['health_wellness'],
            "miscellaneous": data['miscellaneous'],
            "total_spending": total_spending,
            "disposable_income": disposable_income
        }])

        # Preprocess dan prediksi
        input_processed = preprocessor.transform(input_data)
        prediction = model.predict(input_processed)
        predicted_label = label_encoder.inverse_transform([np.argmax(prediction)])[0]

        return jsonify({'label': predicted_label})

    except Exception as e:
        print(f"Error in predict_behavior: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)