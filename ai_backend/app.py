from flask import Flask, request, jsonify
from flask_cors import CORS

import tensorflow as tf
import numpy as np

from PIL import Image

app = Flask(__name__)

CORS(app)

# LOAD TRAINED MODEL

model = tf.keras.models.load_model(
    "deepfake_model.h5"
)

IMG_SIZE = 128

# ANALYZE IMAGE

@app.route('/analyze', methods=['POST'])

def analyze():

    file = request.files['media']

    image = Image.open(file).convert("RGB")

    image = image.resize((IMG_SIZE, IMG_SIZE))

    image = np.array(image)

    image = image / 255.0

    image = np.expand_dims(image, axis=0)

    # REAL PREDICTION

    prediction = model.predict(image)[0][0]

    fake_probability = float(prediction) * 100

    real_probability = 100 - fake_probability

    if fake_probability > 50:

        status = "AI Generated"

    else:

        status = "Authentic"

    return jsonify({

        "aiProbability":
        f"{fake_probability:.2f}%",

        "trustScore":
        f"{real_probability:.2f}%",

        "status":
        status,

        "explanation":
        "CNN deep learning model analyzed visual artifacts, texture inconsistencies, facial patterns, and AI-generated indicators."
    })

if __name__ == '__main__':

    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )