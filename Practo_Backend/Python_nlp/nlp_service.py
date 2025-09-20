from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
import logging

# 🧠 Load medical NLP model from scispaCy
# Make sure you've installed it via:
# pip install scispacy
# pip install https://huggingface.co/allenai/scispacy-models/resolve/main/en_ner_bc5cdr_md-0.5.0.tar.gz

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for frontend integration
logging.basicConfig(level=logging.INFO)

nlp = spacy.load("en_ner_bc5cdr_md")  # Medical entity model

# 🔍 Rule-based symptom keywords
SYMPTOM_KEYWORDS = [
    "fatigue", "tiredness", "thirst", "fever", "cough", "pain",
    "headache", "nausea", "vomiting", "dizziness", "weakness"
]

@app.route("/extract", methods=["POST"])
def extract_entities():
    try:
        text = request.json.get("text", "")
        if not text.strip():
            return jsonify({"error": "Text is required"}), 400

        logging.info(f"🔍 Extracting entities from: {text[:100]}...")

        doc = nlp(text)

        diagnoses = [ent.text for ent in doc.ents if ent.label_ == "DISEASE"]
        medications = [ent.text for ent in doc.ents if ent.label_ == "CHEMICAL"]

        lower_text = text.lower()
        symptoms = [kw for kw in SYMPTOM_KEYWORDS if kw in lower_text]

        return jsonify({
            "diagnoses": diagnoses,
            "medications": medications,
            "symptoms": symptoms
        })

    except Exception as e:
        logging.error(f"❌ Extraction error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(port=7000)