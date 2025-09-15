document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const mountainDisplay = document.getElementById('mountain-display');
    const feedbackContainer = document.getElementById('feedback-container');

    const API_URL = 'http://127.0.0.1:5000/analyze';

    const mountainLevels = [
        // Score 0: No password, no mountain
        ``,
        // Score 1: A small hill
        `









                       /  
                      /    \ 
                     /      \ 
    ________________/        \________________`,
        // Score 2: A taller mountain
        `





                        /  
                       /    \ 
                      /      \ 
                     /        \ 
                    /          \ 
    _______________/            \_______________`,
        // Score 3: Mountain with a snow cap
        `




                        /..\ 
                       /....\ 
                      /......\ 
                     /        \ 
                    /          \ 
                   /            \ 
                  /              \ 
    _____________/                \_____________`,
        // Score 4: Tallest mountain (no clouds)
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
    ___________/                  \___________`
    ];

    const updateUI = (data) => {
        // Set the mountain art from the array based on score
        mountainDisplay.innerHTML = mountainLevels[data.score];

        // Build the feedback HTML
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

        // Add or remove the class to show/hide the feedback box
        if (feedbackHTML.trim() !== '') {
            feedbackContainer.classList.add('has-feedback');
        } else {
            feedbackContainer.classList.remove('has-feedback');
        }
    };

    const analyzePassword = async () => {
        const password = passwordInput.value;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            updateUI(data);

        } catch (error) {
            console.error("Error fetching password analysis:", error);
            feedbackContainer.innerHTML = `<p class="warning"> Could not connect to analysis server. Please try again later.</p>`;
            feedbackContainer.classList.add('has-feedback');
        }
    };

    passwordInput.addEventListener('input', analyzePassword);

    analyzePassword();
});
