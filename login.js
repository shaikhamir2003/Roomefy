// js/login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBRTGz_G8DBvQbvF8YwGCN9rre-F8GGTD8",
  authDomain: "room-finder-v1.firebaseapp.com",
  databaseURL: "https://room-finder-v1-default-rtdb.firebaseio.com",
  projectId: "room-finder-v1",
  storageBucket: "room-finder-v1.appspot.com",
  messagingSenderId: "156456101448",
  appId: "1:156456101448:web:2639d6d24d58862043da7d",
  measurementId: "G-3QCM5F74WQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberMe = document.getElementById('rememberMe');
const submitBtn = document.querySelector('.submit-btn');
const googleBtn = document.getElementById('googleBtn');
const facebookBtn = document.getElementById('facebookBtn');

// Form submission handler
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage('Please fill in all fields', 'error');
    return;
  }

  setLoadingState(true);

  try {
    await setPersistence(
      auth,
      rememberMe.checked ? browserLocalPersistence : browserSessionPersistence
    );
    await signInWithEmailAndPassword(auth, email, password);
    // Redirect after delay
    setTimeout(() => {
      window.location.href = 'Home.html';
    }, 1500);
  } catch (error) {
    handleAuthError(error);
  } finally {
    setLoadingState(false);
  }
});

// Social login handlers
googleBtn.addEventListener('click', () =>
  handleSocialLogin(new GoogleAuthProvider())
);
facebookBtn.addEventListener('click', () =>
  handleSocialLogin(new FacebookAuthProvider())
);

async function handleSocialLogin(provider) {
  try {
    const result = await signInWithPopup(auth, provider);
    showMessage(
      `Welcome, ${result.user.displayName || result.user.email}!`,
      'success'
    );
  } catch (error) {
    handleAuthError(error);
  }
}

// UI Helpers
function setLoadingState(isLoading) {
  submitBtn.disabled = isLoading;
  const icon = submitBtn.querySelector('i');
  if (isLoading) {
    icon.classList.replace('fa-sign-in-alt', 'fa-spinner');
    icon.classList.add('fa-spin');
  } else {
    icon.classList.replace('fa-spinner', 'fa-sign-in-alt');
    icon.classList.remove('fa-spin');
  }
}

function handleAuthError(error) {
  let message = 'Something went wrong. Please try again.';

  switch (error.code) {
    // Email/Password Errors
    case 'auth/invalid-email':
      message = 'Invalid email format.';
      break;
    case 'auth/user-not-found':
      message = 'No account found with this email.';
      break;
    case 'auth/wrong-password':
      message = 'Incorrect password.';
      break;
    case 'auth/user-disabled':
      message = 'This account has been disabled. Contact support.';
      break;
    case 'auth/email-already-in-use':
      message = 'Email is already registered. Please login.';
      break;
    case 'auth/weak-password':
      message = 'Password is too weak. Use at least 6 characters.';
      break;

    // Network & Quota
    case 'auth/network-request-failed':
      message = 'Network error. Check your internet connection.';
      break;
    case 'auth/too-many-requests':
      message = 'Too many attempts. Try again later.';
      break;

    // Popup & OAuth
    case 'auth/popup-blocked':
      message = 'Popup blocked by browser. Allow popups and retry.';
      break;
    case 'auth/popup-closed-by-user':
      message = 'Popup closed before completing sign-in.';
      break;
    case 'auth/account-exists-with-different-credential':
      message =
        'An account already exists with the same email via another sign-in method.';
      break;
    case 'auth/credential-already-in-use':
      message = 'This credential is already linked with a different user.';
      break;
    case 'auth/invalid-credential':
      message = 'Invalid authentication credential.';
      break;

    // Fallback to Firebase’s message if available
    default:
      if (error.message) {
        message = error.message;
      }
  }

  showMessage(message, 'error');
}

function showMessage(message, type) {
  // Remove existing
  const existing = document.querySelector('.auth-message');
  if (existing) existing.remove();

  // Build new
  const messageEl = document.createElement('div');
  messageEl.className = `auth-message auth-message-${type}`;
  messageEl.innerHTML = `
    <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
    <span>${message}</span>
  `;

  // Inject after security assurance
  const securityAssurance = document.querySelector('.security-assurance');
  securityAssurance.after(messageEl);

  // Auto-remove
  setTimeout(() => messageEl.remove(), 5000);
}

// Inject styles for messages
const style = document.createElement('style');
style.textContent = `
  .auth-message {
    padding: 12px;
    border-radius: 8px;
    margin: 15px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    animation: fadeIn 0.3s ease;
  }

  .auth-message-error {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  .auth-message-success {
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild