import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBRTGz_G8DBvQbvF8YwGCN9rre-F8GGTD8",
  authDomain: "room-finder-v1.firebaseapp.com",
  projectId: "room-finder-v1",
  storageBucket: "room-finder-v1.appspot.com",
  messagingSenderId: "156456101448",
  appId: "1:156456101448:web:2639d6d24d58862043da7d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('resetEmail').value.trim();
  const btn = document.querySelector('.submit-btn');
  const originalBtnText = btn.innerHTML;
  
  // Simple validation
  if (!email) {
    alert('Please enter your email');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset link sent! Check your email');
    document.getElementById('resetEmail').value = '';
  } catch (error) {
    alert(error.message.includes('user-not-found') 
      ? 'Email not found' 
      : 'Failed to send reset link');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalBtnText;
  }
});