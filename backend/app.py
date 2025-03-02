from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
# Enables CORS for the deployed front-end
CORS(app, resources={r"/*": {"origins": "https://gradepredictor.vercel.app"}})

# Loads the model and scaler that I trained
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json 
        features = []
        features_end = []
        for item in data:
            # If the feature is one of the following, they need to be manually one hot encoded
            if item in ["resources", "parents", "motivation", "income", "teaching", "peers", "level", "far"]:
                # Each feature has 3 values so maps to three binary columns, but drops one as it is implicit
                mapping = {0: (1, 0), 1: (0, 1)}
                features_end.extend(mapping.get(data[item], (0, 0)))    
            else:
                # rest of the columns are just added unchanged
                features.append(data[item])

        # adds the encoded columns to the unchanged features
        features = features + features_end
        features = np.array([features]).astype(float)

        # the following columns need to be scaled, scalar used when training the model is used
        columns_to_scale = [0, 1, 3, 4, 6, 8]
        features[:, columns_to_scale] = scaler.transform(features[:, columns_to_scale])

        # Uses the dataset to predict the users predicted grade
        prediction = model.predict(features)
        prediction = prediction.tolist()

        # the predicted grade is returned to the front end
        response = jsonify({"predicted_grade": prediction})
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
        return response

    except Exception as e:
        response = jsonify({"error": str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
        return response

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get('PORT', 5000)))
