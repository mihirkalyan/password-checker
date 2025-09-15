# Password Strength Checker ⛰️

This project is a simple, visual password strength checker. It uses the `zxcvbn` library to analyze password strength and provides feedback in a fun, graphical way. As your password gets stronger, you build a taller mountain!

## Features

*   **Visual Feedback:** An ASCII mountain grows taller as your password strength increases.
*   **Real-time Analysis:** Password strength is analyzed as you type.
*   **Constructive Feedback:** Get suggestions on how to improve your password.
*   **Copy to Clipboard:** Easily copy your password once you're happy with it.
*   **Show/Hide Password:** Toggle password visibility.

## How It Works

The application consists of a simple frontend (HTML, CSS, JavaScript) and a Python backend (Flask).

1.  You enter a password in the input field.
2.  The JavaScript sends the password to the Flask backend.
3.  The backend uses the `zxcvbn` library to estimate the password strength and generate feedback.
4.  A custom scoring logic is applied to create a 0-5 score.
5.  The score is sent back to the frontend.
6.  The frontend displays a pre-rendered ASCII mountain corresponding to the score.

## Setup and Usage

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mihirkalyan/password-checker.git
    cd password-checker
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    venv\Scripts\activate
    ```

3.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the backend server:**
    ```bash
    python app.py
    ```

5.  **Open the frontend:**
    Open the `index.html` file in your web browser.

## Technologies Used

*   **Frontend:**
    *   HTML
    *   CSS
    *   JavaScript

*   **Backend:**
    *   Python
    *   Flask
    *   zxcvbn
    *   Flask-Cors