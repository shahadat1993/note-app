import { api } from './api.js';
import { redirectIfNotAuth, toast } from './utils.js';

await redirectIfNotAuth();

const notesGrid = document.querySelector('#notesGrid');
const noteForm = document.querySelector('#noteForm');
const logoutBtn = document.querySelector('#logoutBtn');
const userName = document.querySelector('#userName');

let editingNoteId = null;

const renderNotes = async () => {
  try {
    const notes = await api('/notes');
    notesGrid.innerHTML = '';

    if (!notes.length) {
      notesGrid.innerHTML = '<div class="empty-state">No notes found. Create your first note.</div>';
      return;
    }

   notes.forEach((note) => {
  const col = document.createElement('div');
  col.className = 'col-12 col-md-6';

  col.innerHTML = `
    <article class="h-100 rounded-4 border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
      <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
        <h3 class="h5 fw-bold mb-0 text-white">${note.title}</h3>
        <span class="badge rounded-pill text-bg-dark px-3 py-2">
          ${note.isPinned ? 'Pinned' : 'Note'}
        </span>
      </div>

      <p class="text-slate-300 mb-3" style="line-height: 1.8;">
        ${note.content}
      </p>

      <div class="d-flex flex-wrap gap-2 mb-4">
        ${note.tags.map(tag => `<span class="rounded-pill px-3 py-2 text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-400/10">#${tag}</span>`).join('')}
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-sm rounded-4 px-3 py-2 text-white bg-violet-500/20 border border-violet-400/10" data-edit="${note._id}">
          Edit
        </button>
        <button class="btn btn-sm rounded-4 px-3 py-2 text-red-200 bg-red-500/10 border border-red-400/10" data-delete="${note._id}">
          Delete
        </button>
      </div>
    </article>
  `;

  notesGrid.appendChild(col);
});

    document.querySelectorAll('[data-edit]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          const notes = await api('/notes');
          const note = notes.find((n) => n._id === btn.dataset.edit);

          if (!note) return;

          noteForm.title.value = note.title;
          noteForm.content.value = note.content;
          noteForm.tags.value = note.tags.join(', ');
          noteForm.isPinned.checked = note.isPinned;
          editingNoteId = note._id;

          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    });

    document.querySelectorAll('[data-delete]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          await api(`/notes/${btn.dataset.delete}`, { method: 'DELETE' });
          toast('Note deleted');
          await renderNotes();
        } catch (error) {
          toast(error.message, 'error');
        }
      });
    });
  } catch (error) {
    toast(error.message, 'error');
  }
};

const loadUser = async () => {
  try {
    const { user } = await api('/auth/me');
    userName.textContent = user.name;
  } catch (error) {
    toast(error.message, 'error');
  }
};

noteForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    title: noteForm.title.value,
    content: noteForm.content.value,
    tags: noteForm.tags.value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    isPinned: noteForm.isPinned.checked
  };

  try {
    if (editingNoteId) {
      await api(`/notes/${editingNoteId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      toast('Note updated');
      editingNoteId = null;
    } else {
      await api('/notes', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      toast('Note created');
    }

    noteForm.reset();
    await renderNotes();
  } catch (error) {
    toast(error.message, 'error');
  }
});

logoutBtn?.addEventListener('click', async () => {
  try {
    await api('/auth/logout', { method: 'POST' });
   window.location.href = './login.html';
  } catch (error) {
    toast(error.message, 'error');
  }
});

await loadUser();
await renderNotes();