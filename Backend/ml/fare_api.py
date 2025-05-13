from flask import Flask, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "fare_predictor.pkl")
model = joblib.load(MODEL_PATH)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        features = np.array([[data['distance'], data['passenger_count'], data['hour']]])
        fare = model.predict(features)[0]
        return jsonify({ 'fare': round(fare, 2) })
    except Exception as e:
        return jsonify({ 'error': str(e) }), 400

if __name__ == '__main__':
    app.run(port=5001)
