document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const passwordInput = document.getElementById('password-input');
    const mountainDisplay = document.getElementById('mountain-display');
    const feedbackContainer = document.getElementById('feedback-container');
    const showPasswordToggle = document.getElementById('show-password-toggle');
    const copyButton = document.getElementById('copy-button');
    const loadingIndicator = document.getElementById('loading-indicator');

    // --- API URL ---
    const API_URL = 'http://127.0.0.1:5000/analyze';

    // --- ASCII Art (6 Levels) ---
    const mountainLevels = [
        ``, // Score 0
        `









                       /  
                      /    \ 
                     /      \ 
    ________________/        \________________`, // Score 1
        `






                        /  
                       /    \ 
                      /      \ 
                     /        \ 
                    /          \ 
    _______________/            \_______________`, // Score 2
        `




                        /..\ 
                       /....\ 
                      /......\ 
                     /        \ 
                    /          \ 
                   /            \ 
                  /              \ 
    _____________/                \_____________`, // Score 3
        `


                        /\ 
                       /..\ 
                      /....\ 
                     /......\ 
                    /........\ 
                   /          \ 
                  /            \ 
                 /              \ 
                /                \ 
    ___________/                  \___________`, // Score 4
        `
                        /\ 
                       /  \ 
                      /....\ 
                     /......\ 
                    /........\ 
                   /..........\ 
                  /            \ 
                 /              \ 
                /                \ 
               /                  \ 
    __________/                    \__________` // Score 5
    ];

    // --- Debounce Function ---
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    // --- UI Update Function ---
    const updateUI = (data) => {
        mountainDisplay.innerHTML = mountainLevels[data.score];
        let feedbackHTML = '';
        if (data.warning) {
            feedbackHTML += `<p class="warning">> ${data.warning}</p>`;
        }
        if (data.suggestions && data.suggestions.length > 0) {
            feedbackHTML += '<ul>';
            data.suggestions.forEach(suggestion => {
                feedbackHTML += `<li>> ${suggestion}</li>`;
            });
            feedbackHTML += '</ul>';
        }
        feedbackContainer.innerHTML = feedbackHTML;
        if (feedbackHTML.trim() !== '') {
            feedbackContainer.classList.add('has-feedback');
        } else {
            feedbackContainer.classList.remove('has-feedback');
        }
    };

    // --- API Call ---
    const analyzePassword = async () => {
        const password = passwordInput.value;
        loadingIndicator.classList.remove('hidden');
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            updateUI(data);
        } catch (error) {
            console.error("Error fetching password analysis:", error);
            feedbackContainer.innerHTML = `<p class="warning">Could not connect to analysis server.</p>`;
            feedbackContainer.classList.add('has-feedback');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    };

    // --- Event Listeners ---
    passwordInput.addEventListener('input', debounce(analyzePassword, 300));

    showPasswordToggle.addEventListener('change', () => {
        passwordInput.type = showPasswordToggle.checked ? 'text' : 'password';
    });

    copyButton.addEventListener('click', () => {
        passwordInput.select();
        document.execCommand('copy');
        copyButton.textContent = 'Copied!';
        setTimeout(() => { copyButton.textContent = 'Copy'; }, 1500);
    });

    // --- Initial Call ---
    analyzePassword();
});