
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const fortressContainer = document.getElementById('fortress-container');
    const feedbackContainer = document.getElementById('feedback-container');

    const API_URL = 'http://127.0.0.1:5000/analyze';

    const castleParts = {
        land: `
<pre>
................................................................
................................................................
................................................................
................................................................
................................................................
</pre>
`,
        walls: `
<pre>
|..____..|..____..|..____..|..____..|..____..|..____..|..____..|
|........|........|........|........|........|........|........|
</pre>
`,
        moat: `
<pre>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
</pre>
`,
        towers: `
<pre>
  /\                                                        /\
 /  \                                                      /  \
|    |                                                    |    |
|....|                                                    |....|
</pre>
`,
        dragon: `
<pre>
                      /\_/\
                     / o o \
                    (  _  )
                     \` ' /
                      \|/
</pre>
`
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
        }
    };

    const updateUI = (data) => {
        // 1. Update Fortress Visual
        fortressContainer.querySelector('.land').innerHTML = castleParts.land;

        if (data.score >= 1) {
            fortressContainer.querySelector('.walls').innerHTML = castleParts.walls;
        } else {
            fortressContainer.querySelector('.walls').innerHTML = '';
        }

        if (data.score >= 2) {
            fortressContainer.querySelector('.moat').innerHTML = castleParts.moat;
        } else {
            fortressContainer.querySelector('.moat').innerHTML = '';
        }

        if (data.score >= 3) {
            fortressContainer.querySelector('.towers').innerHTML = castleParts.towers;
        } else {
            fortressContainer.querySelector('.towers').innerHTML = '';
        }

        if (data.score >= 4) {
            fortressContainer.querySelector('.dragon').innerHTML = castleParts.dragon;
        } else {
            fortressContainer.querySelector('.dragon').innerHTML = '';
        }


        // 2. Update Text Feedback
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
    };

    // Event Listeners
    passwordInput.addEventListener('input', analyzePassword);

    // Initial analysis on page load
    analyzePassword();
});
