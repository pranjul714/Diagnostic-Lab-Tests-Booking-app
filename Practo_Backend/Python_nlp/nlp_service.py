from flask import Flask, request, jsonify
import spacy

# Load medical NLP model from scispaCy
# Make sure you've installed it via:
# pip install scispacy
# pip install https://huggingface.co/allenai/scispacy-models/resolve/main/en_ner_bc5cdr_md-0.5.0.tar.gz

app = Flask(__name__)
nlp = spacy.load("en_ner_bc5cdr_md")  # Medical entity model

# Rule-based symptom keywords
SYMPTOM_KEYWORDS = [
    "fatigue", "tiredness", "thirst", "fever", "cough", "pain",
    "headache", "nausea", "vomiting", "dizziness", "weakness"
]

@app.route("/extract", methods=["POST"])
def extract_entities():
    text = request.json.get("text", "")
    doc = nlp(text)

    diagnoses = []
    medications = []
    symptoms = []

    for ent in doc.ents:
        if ent.label_ == "DISEASE":
            diagnoses.append(ent.text)
        elif ent.label_ == "CHEMICAL":
            medications.append(ent.text)

    # Rule-based symptom detection
    lower_text = text.lower()
    for keyword in SYMPTOM_KEYWORDS:
        if keyword in lower_text:
            symptoms.append(keyword)

    return jsonify({
        "diagnoses": diagnoses,
        "medications": medications,
        "symptoms": symptoms
    })

if __name__ == "__main__":
    app.run(port=7000)