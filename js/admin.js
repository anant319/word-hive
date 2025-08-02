// This script handles the functionality for the admin.html page using Firestore.
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// --- Firebase Initialization ---
// IMPORTANT: Replace this placeholder with your actual Firebase config object.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


/**
 * Handles the book publishing form submission.
 */
function initializePublishForm() {
    const publishForm = document.getElementById('publish-book-form');
    const successMessage = document.getElementById('publish-success');

    if (!publishForm) return;
    
    publishForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission

        const title = document.getElementById('book-title').value;
        const author = document.getElementById('author-name').value;
        const price = parseFloat(document.getElementById('book-price').value);
        const img = document.getElementById('cover-image-url').value;

        if (!title || !author || isNaN(price) || !img) {
            alert('Please fill out all fields correctly.');
            return;
        }

        try {
            // Add the new book to the 'books' collection in Firestore
            const docRef = await addDoc(collection(db, "books"), {
                title: title,
                author: author,
                price: price,
                img: img,
                createdAt: serverTimestamp() // Adds a server-side timestamp
            });

            console.log("Document written with ID: ", docRef.id);

            // Show a success message and reset the form
            successMessage.classList.remove('hidden');
            publishForm.reset();

            // Hide the success message after a few seconds
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 3000);

        } catch (error) {
            console.error("Error adding document: ", error);
            alert('There was an error publishing the book. Please check the console.');
        }
    });
}


/**
 * Main initialization function for the admin page.
 */
async function initializeAdminPage() {
    try {
        // Sign in anonymously to get permissions to write to the database
        await signInAnonymously(auth);
        console.log("Signed in anonymously for admin actions.");
        
        // Initialize the form functionality
        initializePublishForm();

    } catch (error) {
        console.error("Error during admin page initialization: ", error);
        alert("Could not connect to the database. Admin features are disabled.");
    }
}

// --- Main Execution ---
document.addEventListener('DOMContentLoaded', initializeAdminPage);
