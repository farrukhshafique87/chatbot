import os
from flask import Flask, render_template, request, jsonify
from openai import OpenAI

app = Flask(__name__)

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY') or ""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    if not OPENAI_API_KEY:
        return jsonify({'reply': 'OpenAI API key not set on server.'})
    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are Max, a helpful sports shop assistant. Answer user questions about sports gear, shopping, and general sports topics in a friendly, concise way."},
                {"role": "user", "content": user_message}
            ]
        )
        reply = response.choices[0].message.content.strip()
    except Exception as e:
        reply = f"Sorry, there was an error: {str(e)}"
    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(debug=True) 