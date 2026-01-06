import os
import time
import random
from groq import Groq
from dotenv import load_dotenv
from datetime import datetime, timedelta
import requests

load_dotenv()

# Rate limiting tracker
last_request_time = {}
MIN_DELAY = 60  # 60 seconds between requests per key

# Multiple API keys for rotation
api_keys = [
    os.getenv("GROQ_API_KEY"),
    os.getenv("GROQ_API_KEY_2"),
    os.getenv("GROQ_API_KEY_3")
]
api_keys = [key for key in api_keys if key]  # Remove None values

def huggingface_chat(message, language="en"):
    """Backup API using Hugging Face"""
    hf_token = os.getenv("HUGGINGFACE_TOKEN")
    if not hf_token:
        return None
    
    try:
        headers = {"Authorization": f"Bearer {hf_token}"}
        payload = {
            "inputs": message,
            "parameters": {
                "max_new_tokens": 200,
                "temperature": 0.7,
                "return_full_text": False
            }
        }
        
        response = requests.post(
            "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
            headers=headers,
            json=payload,
            timeout=15
        )
        
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                return result[0].get('generated_text', '').strip()
        return None
    except Exception as e:
        print(f"HF Error: {e}")
        return None
def get_system_prompt(language):
    if language == "en":
        return "You are an EV Assistant that helps users find electric vehicle charging stations. You can understand spelling errors and typos in city names and questions. When asked about EV charging stations in any city, provide real information about actual charging networks like Tata Power, Ather Grid, ChargeZone, BSES, etc. Include specific locations, addresses, plot numbers, and charging types. Only answer EV-related questions. DO NOT mention PlugShare, ChargeHub, or other third-party apps. DO NOT include disclaimers about calling ahead or checking websites. Respond in English."
    elif language == "hinglish":
        return "You are an EV Assistant that helps users find electric vehicle charging stations. You can understand spelling errors and typos in city names and questions. When asked about EV charging stations in any city, provide real information about actual charging networks like Tata Power, Ather Grid, ChargeZone, BSES, etc. Include specific locations, addresses, plot numbers, and charging types. Only answer EV-related questions. DO NOT mention PlugShare, ChargeHub, or other third-party apps. DO NOT include disclaimers about calling ahead or checking websites. Respond in Hinglish (mix of Hindi and English) like 'Aap kaise ho', 'Main theek hun', 'EV charging station kahan hai'. Use casual conversational Hinglish style."
    else:
        return f"You are an EV Assistant that helps users find electric vehicle charging stations. You can understand spelling errors and typos in city names and questions. When asked about EV charging stations in any city, provide real information about actual charging networks like Tata Power, Ather Grid, ChargeZone, BSES, etc. Include specific locations, addresses, plot numbers, and charging types. Only answer EV-related questions. DO NOT mention PlugShare, ChargeHub, or other third-party apps. DO NOT include disclaimers about calling ahead or checking websites. Always respond in {language}."

def get_fallback_response(message, language="en"):
    """Fallback responses when API is rate limited"""
    responses = {
        "en": {
            "greeting": "Hello! I'm your EV Assistant. I can help you find electric vehicle charging stations.",
            "default": "I'm currently experiencing high traffic. For EV charging stations, try checking Tata Power, Ather Grid, or ChargeZone networks in your city."
        },
        "hinglish": {
            "greeting": "Hello! Main aapka EV Assistant hun. EV charging stations dhundne mein help kar sakta hun.",
            "default": "Abhi bahut traffic hai. EV charging ke liye Tata Power, Ather Grid ya ChargeZone check kar sakte hain aapke city mein."
        }
    }
    
    msg_lower = message.lower()
    if any(word in msg_lower for word in ['hi', 'hello', 'hey', 'namaste', 'kaise ho']):
        return responses.get(language, responses["en"])["greeting"]
    return responses.get(language, responses["en"])["default"]
def get_greeting(language):
    greetings = {
        "en": "Hello! I'm your EV Assistant. How can I help you with electric vehicles today? ⚡",
        "hinglish": "Hello! Main aapka EV Assistant hun. Aaj electric vehicles ke baare mein kaise help kar sakta hun? ⚡",
        "hi": "नमस्ते! मैं आपका EV असिस्टेंट हूं। आज इलेक्ट्रिक वाहनों के बारे में मैं आपकी कैसे मदद कर सकता हूं? ⚡",
        "gu": "નમસ્તે! હું તમારો EV આસિસ્ટન્ટ છું. આજે ઇલેક્ટ્રિક વાહનો વિશે હું તમારી કેવી રીતે મદદ કરી શકું? ⚡"
    }
    return greetings.get(language, greetings["en"])

def ev_chat(message, language="en"):
    # Try Groq with updated model
    if api_keys:
        try:
            client = Groq(api_key=api_keys[0])
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",  # Updated model
                messages=[
                    {"role": "system", "content": get_system_prompt(language)},
                    {"role": "user", "content": message}
                ],
                temperature=0.2,
                max_tokens=300
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq Error: {e}")
            # Try second API key
            if len(api_keys) > 1:
                try:
                    client = Groq(api_key=api_keys[1])
                    response = client.chat.completions.create(
                        model="llama-3.1-8b-instant",
                        messages=[
                            {"role": "system", "content": get_system_prompt(language)},
                            {"role": "user", "content": message}
                        ],
                        temperature=0.2,
                        max_tokens=300
                    )
                    return response.choices[0].message.content
                except Exception as e2:
                    print(f"Groq Error 2: {e2}")
    
    return "API temporarily unavailable. Please try again in a moment."