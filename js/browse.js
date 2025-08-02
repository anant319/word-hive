// This script handles the book rendering for the browse.html page using Firestore.
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
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
 * Renders the list of books into the DOM from Firestore data.
 */
function renderBooks(books) {
    const bookList = document.getElementById('book-list');
    const loadingMessage = document.getElementById('loading-books');

    if (!bookList) return;

    if (books.length === 0) {
        loadingMessage.textContent = 'No books have been published yet.';
        bookList.innerHTML = ''; // Clear any existing content
        return;
    }

    loadingMessage.style.display = 'none'; // Hide loading message
    bookList.innerHTML = books.map(book => `
        <div class="book-card bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 flex flex-col">
            <img src="${book.img}" alt="Cover for ${book.title}" class="w-full h-72 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/300x450/cccccc/ffffff?text=Image+Not+Found';">
            <div class="p-6 flex-grow flex flex-col">
                <h3 class="text-lg font-bold mb-2">${book.title}</h3>
                <p class="text-gray-600 mb-4">by ${book.author}</p>
                <div class="mt-auto flex justify-between items-center">
                    <span class="text-xl font-bold text-orange-600">$${book.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition" data-id="${book.id}" data-title="${book.title}" data-author="${book.author}" data-price="${book.price}" data-img="${book.img}">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
    
    addCartButtonListeners();
}

/**
 * Shows a toast notification message.
 */
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (toast) {
        toast.textContent = message;
        toast.classList.remove('hidden', 'opacity-0');
        setTimeout(() => {
            toast.classList.add('opacity-0');
            // Wait for the transition to finish before hiding it completely
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 2000);
    }
}


/**
 * Adds a book to the cart in localStorage.
 */
function addToCart(book) {
    let cart = JSON.parse(localStorage.getItem('wordHiveCart')) || [];
    const existingItem = cart.find(item => item.id === book.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...book, quantity: 1 });
    }

    localStorage.setItem('wordHiveCart', JSON.stringify(cart));
    showToast(`'${book.title}' added to cart!`);
}


/**
 * Attaches event listeners to all 'Add to Cart' buttons.
 */
function addCartButtonListeners() {
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const bookData = e.target.dataset;
            const book = {
                id: bookData.id,
                title: bookData.title,
                author: bookData.author,
                price: parseFloat(bookData.price),
                img: bookData.img
            };
            addToCart(book);
        });
    });
}


/**
 * Fetches books from Firestore in real-time.
 */
async function initializeBookFetching() {
    try {
        await signInAnonymously(auth);
        console.log("Signed in anonymously.");
        
        const booksCollection = collection(db, "books");
        // Order books by creation date, newest first
        const q = query(booksCollection, orderBy("createdAt", "desc"));

        onSnapshot(q, (querySnapshot) => {
            const books = [];
            querySnapshot.forEach((doc) => {
                books.push({ id: doc.id, ...doc.data() });
            });
            renderBooks(books);
        }, (error) => {
            console.error("Error fetching books: ", error);
            const loadingMessage = document.getElementById('loading-books');
            if(loadingMessage) loadingMessage.textContent = 'Could not load books. Please try again later.';
        });
    } catch (error) {
        console.error("Error during anonymous sign-in or initialization: ", error);
        const loadingMessage = document.getElementById('loading-books');
        if(loadingMessage) loadingMessage.textContent = 'Could not connect to the database.';
    }
}


// --- Main Execution ---
document.addEventListener('DOMContentLoaded', initializeBookFetching);
