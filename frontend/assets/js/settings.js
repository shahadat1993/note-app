import { api } from './api.js';
import { redirectIfNotAuth, toast } from './utils.js';

await redirectIfNotAuth();

const profileForm = document.querySelector('#profileForm');
const passwordForm = document.querySelector('#passwordForm');

const loadProfile = async () => {
  try {
    const { user } = await api('/auth/me');
    profileForm.name.value = user.name;
    profileForm.email.value = user.email;
  } catch (error) {
    toast(error.message, 'error');
  }
};

profileForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await api('/users/profile', {
      method: 'PUT',
      body: JSON.stringify({
        name: profileForm.name.value,
        email: profileForm.email.value
      })
    });
    toast('Profile updated');
  } catch (error) {
    toast(error.message, 'error');
  }
});

passwordForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await api('/users/password', {
      method: 'PUT',
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword.value,
        newPassword: passwordForm.newPassword.value
      })
    });
    passwordForm.reset();
    toast('Password updated');
  } catch (error) {
    toast(error.message, 'error');
  }
});

await loadProfile();