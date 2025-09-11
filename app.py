from flask import Flask, request, jsonify
from flask_cors import CORS
from zxcvbn import zxcvbn

# Initialize Flask App
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing to allow frontend communication
CORS(app)

# Define high-risk account types for stricter password rules
HIGH_RISK_ACCOUNTS = {'Banking', 'Email'}

@app.route('/analyze', methods=['POST'])
def analyze_password():
    data = request.get_json()
    password = data.get('password', '')
    account_type = data.get('account_type', 'Social Media')

    # If the password is empty, return a default weak score.
    if not password:
        return jsonify({
            'score': 0,
            'warning': '',
            'suggestions': ['Start typing to see your fortress grow!']
        })

    # Perform the core analysis with zxcvbn
    results = zxcvbn(password)
    score = results.get('score', 0)
    feedback = results.get('feedback', {})

    # --- Context-Aware Recommendations ---
    # For high-risk accounts, we require a stronger password.
    # If the score isn't "Excellent" (4), we demote it by one level.
    if account_type in HIGH_RISK_ACCOUNTS and score < 4:
        score = max(0, score - 1) # Ensure score doesn't go below 0

    response_data = {
        'score': score,
        'warning': feedback.get('warning', ''),
        'suggestions': feedback.get('suggestions', [])
    }

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)