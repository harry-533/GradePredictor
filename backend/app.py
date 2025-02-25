from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://gradepredictor.vercel.app"}})

model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json 
        features = []
        features_end = []
        for item in data:
            if item in ["resources", "parents", "motivation", "income", "teaching", "peers", "level", "far"]:
                mapping = {0: (1, 0), 1: (0, 1)}
                features_end.extend(mapping.get(data[item], (0, 0)))    
            else:
                features.append(data[item])

        features = features + features_end
        features = np.array([features]).astype(float)

        columns_to_scale = [0, 1, 3, 4, 6, 8]
        features[:, columns_to_scale] = scaler.transform(features[:, columns_to_scale])

        prediction = model.predict(features)
        prediction = prediction.tolist()

        response = jsonify({"predicted_grade": prediction})
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
        return response

    except Exception as e:
        response = jsonify({"error": str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
        return response

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get('PORT', 5000)))
