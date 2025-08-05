// js/signup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  set 
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// DOM elements
const signupForm = document.getElementById('signupForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('signupEmail');
const passwordInput = document.getElementById('signupPassword');
const verifyPasswordInput = document.getElementById('verifyPassword');
const termsCheckbox = document.getElementById('termsAgreement');
const submitBtn = document.querySelector('.submit-btn');

// Form submission handler
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const verifyPassword = verifyPasswordInput.value;
  
  // Validate inputs
  if (!validateInputs(fullName, email, password, verifyPassword)) {
    return;
  }

  // Set loading state
  setLoadingState(true);

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with full name
    await updateProfile(userCredential.user, {
      displayName: fullName
    });

    // Save additional user data to database
    await set(ref(database, 'users/' + userCredential.user.uid), {
      fullName: fullName,
      email: email,
      createdAt: new Date().toISOString()
    });

    // Show success message
    showMessage('Account created successfully! Redirecting...', 'success');
    
    // Redirect after delay
    setTimeout(() => {
      window.location.href = 'Home.html';
    }, 1500);
    
  } catch (error) {
    handleSignupError(error);
  } finally {
    setLoadingState(false);
  }
});

// Input validation
function validateInputs(fullName, email, password, verifyPassword) {
  // Clear previous errors
  clearErrors();

  let isValid = true;

  if (!fullName) {
    showError(fullNameInput, 'Full name is required');
    isValid = false;
  }

  if (!email) {
    showError(emailInput, 'Email is required');
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError(emailInput, 'Please enter a valid email');
    isValid = false;
  }

  if (!password) {
    showError(passwordInput, 'Password is required');
    isValid = false;
  } else if (password.length < 8) {
    showError(passwordInput, 'Password must be at least 8 characters');
    isValid = false;
  }

  if (password !== verifyPassword) {
    showError(verifyPasswordInput, 'Passwords do not match');
    isValid = false;
  }

  if (!termsCheckbox.checked) {
    showError(termsCheckbox, 'You must accept the terms');
    isValid = false;
  }

  return isValid;
}

// Error handling
function handleSignupError(error) {
  let errorMessage = 'Signup failed. Please try again.';
  
  switch(error.code) {
    case 'auth/email-already-in-use':
      errorMessage = 'Email already in use';
      showError(emailInput, errorMessage);
      break;
    case 'auth/invalid-email':
      errorMessage = 'Invalid email address';
      showError(emailInput, errorMessage);
      break;
    case 'auth/weak-password':
      errorMessage = 'Password should be at least 6 characters';
      showError(passwordInput, errorMessage);
      break;
    default:
      showMessage(errorMessage, 'error');
  }
}

// UI Helpers
function setLoadingState(isLoading) {
  submitBtn.disabled = isLoading;
  const icon = submitBtn.querySelector('i');
  const text = submitBtn.querySelector('span');
  
  if (isLoading) {
    icon.classList.replace('fa-user-plus', 'fa-spinner');
    icon.classList.add('fa-spin');
    text.textContent = ' Creating Account...';
  } else {
    icon.classList.replace('fa-spinner', 'fa-user-plus');
    icon.classList.remove('fa-spin');
    text.textContent = ' Create Account';
  }
}

function showError(inputElement, message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  inputElement.parentNode.appendChild(errorElement);
  inputElement.classList.add('input-error');
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => el.remove());
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

function showMessage(message, type) {
  // Remove existing messages
  const existing = document.querySelector('.auth-message');
  if (existing) existing.remove();
  
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `auth-message auth-message-${type}`;
  messageEl.innerHTML = `
    <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
    <span>${message}</span>
  `;
  
  // Insert after security assurance
  const securityAssurance = document.querySelector('.security-assurance');
  securityAssurance.after(messageEl);
  
  // Auto-remove after 5 seconds (except success messages that redirect)
  if (type !== 'success') {
    setTimeout(() => messageEl.remove(), 5000);
  }
}

// Add styles for messages and errors
const style = document.createElement('style');
style.textContent = `
  .error-message {
    color: #e53e3e;
    font-size: 0.8rem;
    margin-top: 0.3rem;
    text-align: left;
  }
  
  .input-error {
    border-color: #e53e3e !important;
  }
  
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
document.head.appendChild(style);