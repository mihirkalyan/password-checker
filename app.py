import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from zxcvbn import zxcvbn


app = Flask(__name__)
CORS(app)

def calculate_mountain_score(password):
    length = len(password)
    if length == 0:
        return 0

    has_numbers = re.search(r"\d", password) is not None
    has_symbols = re.search(r"[!@#$%^&*(),.?\":{}|<>]", password) is not None

    if length >= 12 and has_numbers and has_symbols:
        return 5
    elif length > 7 and has_numbers and has_symbols:
        return 4
    elif length > 7 and (has_numbers or has_symbols):
        return 3
    elif length > 5:
        return 2
    else:
        return 1

@app.route('/analyze', methods=['POST'])
def analyze_password():
    data = request.get_json()
    password = data.get('password', '')

    # If the password is empty, return a default weak score.
    if not password:
        return jsonify({
            'score': 0,
            'warning': '',
            'suggestions': ['Start typing to see your mountain grow!']
        })

    # Use our custom logic for the score
    score = calculate_mountain_score(password)

    # Still use zxcvbn for its detailed feedback
    results = zxcvbn(password)
    feedback = results.get('feedback', {})

    response_data = {
        'score': score,
        'warning': feedback.get('warning', ''),
        'suggestions': feedback.get('suggestions', [])
    }

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)