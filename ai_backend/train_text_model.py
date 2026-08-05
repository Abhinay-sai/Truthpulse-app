import json
import os
import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

print("==================================================")
print("TRUTHPULSE AI: TRAINING CUSTOM NLP ENGINE")
print("==================================================")

# 1. LOAD DATASET
DATASET_PATH = "text_dataset.json"
if not os.path.exists(DATASET_PATH):
    raise FileNotFoundError(f"Dataset file not found at {DATASET_PATH}")

with open(DATASET_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

texts = [item["text"] for item in data]
labels = np.array([item["label"] for item in data], dtype=int)

print(f"[OK] Loaded {len(texts)} samples ({sum(labels)} Authentic / {len(labels) - sum(labels)} Misinformation/Fake)")

# 2. FEATURE EXTRACTION (TF-IDF N-Gram Vectorizer)
print("\n[INFO] Extracting Lexical & Semantic N-Gram Features...")
vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2), # Capture both single words and two-word phrases
    stop_words="english",
    sublinear_tf=True
)

X = vectorizer.fit_transform(texts)
y = labels

# Save vectorizer vocabulary for live inference in Flask
joblib.dump(vectorizer, "tfidf_vectorizer.pkl")
print("[OK] Vocabulary Vectorizer saved to 'tfidf_vectorizer.pkl'")

# Train-Test Split for validation
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# 3. BUILD MULTI-LAYER NEURAL NETWORK & ENSEMBLE ARCHITECTURE
print("\n[INFO] Building Multi-Layer Neural Network Architecture...")
mlp_net = MLPClassifier(
    hidden_layer_sizes=(128, 64, 32), # 3 hidden dense layers
    activation='relu',
    solver='adam',
    alpha=0.001,
    max_iter=500,
    random_state=42
)

log_reg = LogisticRegression(C=5.0, random_state=42)

# Hybrid Voting Classifier combining Deep MLP with Calibrated Linear weights
model = VotingClassifier(
    estimators=[('neural_net', mlp_net), ('linear', log_reg)],
    voting='soft'
)

# 4. TRAIN MODEL
print("\n[INFO] Starting Deep Learning & Ensemble Training...")
model.fit(X_train, y_train)

# Evaluate on Validation Set
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred) * 100
print(f"\n[RESULTS] Validation Accuracy: {acc:.2f}%")
print("\nDetailed Classification Report:")
print(classification_report(y_test, y_pred, target_names=["Misinformation/Fake", "Authentic"]))

# 5. SAVE TRAINED MODEL
MODEL_NAME = "text_authenticity_model.pkl"
joblib.dump(model, MODEL_NAME)
print(f"[SUCCESS] Custom NLP model saved as '{MODEL_NAME}'")

# 6. QUICK VERIFICATION TEST
print("\n==================================================")
print("TESTING NEWLY TRAINED MODEL")
print("==================================================")

test_claims = [
    "NASA confirms new solar panel technology improves energy conversion by 5 percent in laboratory tests.",
    "SHOCKING! Secret alien lizards are spraying mind control chemicals from UFO airplanes to turn everyone into zombies!",
    "The central bank announced steady interest rates following moderate inflation reports this quarter.",
    "Miracle quantum healing bracelet uses tachyon energy fields to reverse aging and boost your IQ by 30 points overnight!"
]

test_vecs = vectorizer.transform(test_claims)
predictions = model.predict(test_vecs)
probabilities = model.predict_proba(test_vecs)

for i, claim in enumerate(test_claims):
    prob_real = float(probabilities[i][1]) * 100
    prob_fake = float(probabilities[i][0]) * 100
    status = "Authentic (Verified)" if prob_real > 50 else "Misinformation / Fake News"
    print(f"\nClaim: \"{claim[:60]}...\"")
    print(f"  -> Prediction: {status} (Trust Score: {prob_real:.2f}% | AI/Fake Prob: {prob_fake:.2f}%)")

print("\n[DONE] All done! Your custom TruthPulse text model is trained and ready for deployment!")
