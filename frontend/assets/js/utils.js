export const toast = (message, type = 'success') => {
  const toastEl = document.createElement('div');
  toastEl.className = `toast ${type}`;
  toastEl.textContent = message;
  document.body.appendChild(toastEl);

  setTimeout(() => toastEl.classList.add('show'), 50);

  setTimeout(() => {
    toastEl.classList.remove('show');
    setTimeout(() => toastEl.remove(), 300);
  }, 2500);
};

export const redirectIfNotAuth = async () => {
  try {
    const { api } = await import('./api.js');
    await api('/auth/me', { method: 'GET' });
  } catch (error) {
   window.location.href = './login.html';
  }
};