# EV Station Finder with Integrated Chatbot

## Setup Instructions

### 1. Backend Setup (Flask Chatbot)

```bash
cd ChatBot
pip install -r requirements.txt
python app.py
```

The Flask server will run on `http://localhost:5555`

### 2. Frontend Setup (Next.js)

```bash
# In the root directory
npm install
npm run dev
```

The Next.js app will run on `http://localhost:3000`

### 3. Environment Variables

Make sure your `ChatBot/.env` file contains:
```
GROQ_API_KEY=your_groq_api_key_here
GROQ_API_KEY_2=optional_second_key
GROQ_API_KEY_3=optional_third_key
HUGGINGFACE_TOKEN=optional_hf_token
```

### 4. Usage

1. Open `http://localhost:3000` in your browser
2. Click the blue chat button in the bottom-right corner
3. Login with any username/password (demo mode)
4. Start chatting with the EV Assistant!

### Features

- **Floating Chat Widget**: Accessible from any page
- **Authentication**: Secure login system
- **Real-time Chat**: Instant responses from the AI
- **EV-Focused**: Specialized for electric vehicle queries
- **Multi-language Support**: English and Hinglish

### API Endpoints

- `POST /predict` - Send chat messages
- `POST /login` - User authentication
- `GET /logout` - User logout
- `POST /get_greeting` - Get localized greeting

### Troubleshooting

1. **CORS Issues**: Make sure both servers are running
2. **Authentication**: Check Flask session cookies
3. **API Errors**: Verify GROQ API keys in .env file

### Next Steps

- Add user registration in the chat widget
- Implement persistent chat history
- Add more languages
- Integrate with your EV station database