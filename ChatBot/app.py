import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import chat

app = Flask(__name__)

# Allow requests from the Next.js frontend (any origin covers local network IPs)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("message")
    language = data.get("language", "en")
    response = chat.ev_chat(text, language)
    return jsonify({"answer": response})

@app.route("/get_greeting", methods=["POST"])
def get_greeting():
    data = request.get_json()
    language = data.get("language", "en")
    greeting = chat.get_greeting(language)
    return jsonify({"greeting": greeting})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "service": "EV Assistant"})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5555)
