/**
 * This script contains shared functionality for all pages of the Word Hive website.
 */
document.addEventListener('DOMContentLoaded', () => {
    /**
     * Sets up the event listener for the mobile menu toggle button.
     */
    function initializeMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    /**
     * Initializes the error modal functionality.
     */
    function initializeErrorModal() {
        const errorModal = document.getElementById('error-modal');
        const closeModalBtn = document.getElementById('close-modal-btn');
        if (errorModal && closeModalBtn) {
            const hideError = () => {
                errorModal.classList.add('hidden');
            };
            closeModalBtn.addEventListener('click', hideError);
        }
    }

    // Initialize all shared features.
    initializeMobileMenu();
    initializeErrorModal();
});
