import { api } from './api.js';
import { toast } from './utils.js';

const signupForm = document.querySelector('#signupForm');
const loginForm = document.querySelector('#loginForm');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(signupForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      await api('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      toast('Account created successfully');
     window.location.href = './dashboard.html';
    } catch (error) {
      toast(error.message, 'error');
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      await api('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      toast('Login successful');
    window.location.href = './dashboard.html';
    } catch (error) {
      toast(error.message, 'error');
    }
    
  });
} 