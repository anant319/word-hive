// This script handles the AI Book Idea Generator on the index.html page.

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-idea-btn');
    const genreInput = document.getElementById('genre-input');
    const ideaResultDiv = document.getElementById('idea-result');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');

    if (!generateBtn) return;

    const showError = (message) => {
        if (errorMessage && errorModal) {
            errorMessage.textContent = message || 'An unexpected error occurred. Please try again.';
            errorModal.classList.remove('hidden');
        }
    };

    generateBtn.addEventListener('click', async () => {
        const genre = genreInput.value.trim();
        if (!genre) {
            showError('Please enter a genre to generate an idea.');
            return;
        }

        loadingSpinner.classList.remove('hidden');
        ideaResultDiv.classList.add('hidden');
        ideaResultDiv.innerHTML = '';

        /**
         * ===================================================================
         * IMPORTANT SECURITY CHANGE:
         * We do NOT call the Google API directly from the browser.
         * Instead, we call our OWN backend endpoint (e.g., a Cloud Function).
         * This backend endpoint will securely hold the API key and call Google.
         *
         * You will need to create this backend endpoint. A sample is provided
         * in the 'functions/index.js' file.
         * ===================================================================
         */
        try {
            // This should be the URL of YOUR deployed Cloud Function or server endpoint.
            const apiEndpoint = 'YOUR_CLOUD_FUNCTION_URL_HERE'; 

            if (apiEndpoint === 'YOUR_CLOUD_FUNCTION_URL_HERE') {
                throw new Error('API endpoint is not configured. Please deploy the backend function and update the URL in generator.js.');
            }

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ genre: genre })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'The request to our server failed.');
            }

            const result = await response.json();

            ideaResultDiv.innerHTML = `
                <h3 class="text-2xl font-bold text-orange-600 mb-4">${result.title || 'Untitled'}</h3>
                <div class="space-y-4">
                    <div>
                        <h4 class="font-semibold text-lg text-gray-800">Synopsis</h4>
                        <p class="text-gray-600 whitespace-pre-wrap">${result.synopsis || 'No synopsis provided.'}</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-lg text-gray-800">Main Character</h4>
                        <p class="text-gray-600 whitespace-pre-wrap">${result.character || 'No character description provided.'}</p>
                    </div>
                </div>
            `;
            ideaResultDiv.classList.remove('hidden');

        } catch (error) {
            console.error("Error generating book idea:", error);
            showError(error.message);
        } finally {
            loadingSpinner.classList.add('hidden');
        }
    });
});
