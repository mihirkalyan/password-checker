import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from zxcvbn import zxcvbn

app = Flask(__name__)
CORS(app)

def calculate_mountain_score(password, zxcvbn_results):
    if zxcvbn_results['score'] < 2:
        return zxcvbn_results['score']
    score = zxcvbn_results['score']
    has_mixed_case = (re.search(r"[a-z]", password) and re.search(r"[A-Z]", password))
    if has_mixed_case and score < 5:
        score += 1
    if len(password) >= 12 and score < 5:
        score += 1
    return min(score, 5)

@app.route('/analyze', methods=['POST'])
def analyze_password():
    data = request.get_json()
    password = data.get('password', '')

    if not password:
        return jsonify({
            'score': 0,
            'warning': '',
            'suggestions': ['Start typing to see your mountain grow!']
        })

    zxcvbn_results = zxcvbn(password)
    score = calculate_mountain_score(password, zxcvbn_results)
    feedback = zxcvbn_results.get('feedback', {})

    response_data = {
        'score': score,
        'warning': feedback.get('warning', ''),
        'suggestions': feedback.get('suggestions', [])
    }

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
