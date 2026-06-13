const STORAGE_KEYS = { users: 'devfolio_users', session: 'devfolio_session', projects: 'devfolio_projects', theme: 'devfolio_theme' };
const starterProjects = [
  { id: crypto.randomUUID(), title: 'Responsive Restaurant Website', stack: 'HTML, CSS, JavaScript', status: 'Completed', description: 'Built a mobile-first marketing site with accessible navigation, reusable cards, and conversion-focused calls to action.' },
  { id: crypto.randomUUID(), title: 'Task Tracker Dashboard', stack: 'JavaScript, LocalStorage, CSS Grid', status: 'In Progress', description: 'Designed a dashboard experience with persistent CRUD actions, validation, and searchable task lists.' },
  { id: crypto.randomUUID(), title: 'API Learning Hub', stack: 'REST API, Fetch, Async/Await', status: 'Planning', description: 'Planned an educational resource browser that consumes remote API data and presents loading and error states.' }
];
const $ = (selector) => document.querySelector(selector);
const getJSON = (key, fallback) => JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback));
const setJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let state = { authMode: 'login', users: getJSON(STORAGE_KEYS.users, []), session: getJSON(STORAGE_KEYS.session, null), projects: getJSON(STORAGE_KEYS.projects, starterProjects), posts: [] };
const elements = {
  themeToggle: $('#themeToggle'), authForm: $('#authForm'), authMessage: $('#authMessage'), authSubmit: $('#authSubmit'), logoutButton: $('#logoutButton'), sessionStatus: $('#sessionStatus'),
  projectForm: $('#projectForm'), projectMessage: $('#projectMessage'), projectList: $('#projectList'), projectSubmit: $('#projectSubmit'), resetProjectForm: $('#resetProjectForm'),
  searchInput: $('#searchInput'), statusFilter: $('#statusFilter'), apiGrid: $('#apiGrid'), refreshPosts: $('#refreshPosts')
};
function init() { applyTheme(); bindEvents(); renderAuthState(); renderProjects(); updateStats(); fetchPosts(); }
function bindEvents() {
  elements.themeToggle.addEventListener('click', toggleTheme);
  document.querySelectorAll('[data-auth-mode]').forEach((button) => button.addEventListener('click', () => setAuthMode(button.dataset.authMode)));
  elements.authForm.addEventListener('submit', handleAuth);
  elements.logoutButton.addEventListener('click', logout);
  elements.projectForm.addEventListener('submit', saveProject);
  elements.resetProjectForm.addEventListener('click', resetProjectForm);
  elements.searchInput.addEventListener('input', renderProjects);
  elements.statusFilter.addEventListener('change', renderProjects);
  elements.refreshPosts.addEventListener('click', fetchPosts);
}
function applyTheme() { const theme = localStorage.getItem(STORAGE_KEYS.theme) ?? 'light'; document.documentElement.dataset.theme = theme; elements.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙'; }
function toggleTheme() { localStorage.setItem(STORAGE_KEYS.theme, document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); applyTheme(); }
function setAuthMode(mode) {
  state.authMode = mode;
  document.querySelectorAll('[data-auth-mode]').forEach((button) => button.classList.toggle('is-active', button.dataset.authMode === mode));
  $('#nameInput').closest('label').style.display = mode === 'register' ? 'grid' : 'none';
  elements.authSubmit.textContent = mode === 'register' ? 'Create account' : 'Login';
  elements.authMessage.textContent = '';
}
function handleAuth(event) {
  event.preventDefault();
  const name = $('#nameInput').value.trim(); const email = $('#emailInput').value.trim().toLowerCase(); const password = $('#passwordInput').value;
  if (!email.includes('@') || password.length < 8) return showMessage(elements.authMessage, 'Enter a valid email and an 8+ character password.', 'error');
  if (state.authMode === 'register') {
    if (name.length < 2) return showMessage(elements.authMessage, 'Please enter your full name.', 'error');
    if (state.users.some((user) => user.email === email)) return showMessage(elements.authMessage, 'An account with this email already exists.', 'error');
    state.users.push({ id: crypto.randomUUID(), name, email, password }); setJSON(STORAGE_KEYS.users, state.users);
  }
  const user = state.users.find((item) => item.email === email && item.password === password);
  if (!user) return showMessage(elements.authMessage, 'No matching account found. Register first or check your credentials.', 'error');
  state.session = { id: user.id, name: user.name, email: user.email }; setJSON(STORAGE_KEYS.session, state.session);
  elements.authForm.reset(); showMessage(elements.authMessage, `Welcome, ${user.name}!`, 'success'); renderAuthState();
}
function logout() { state.session = null; localStorage.removeItem(STORAGE_KEYS.session); renderAuthState(); showMessage(elements.authMessage, 'You have been logged out.', 'success'); }
function renderAuthState() {
  const isLoggedIn = Boolean(state.session); elements.logoutButton.hidden = !isLoggedIn;
  elements.sessionStatus.textContent = isLoggedIn ? `Signed in as ${state.session.name}. Changes are saved locally.` : 'Log in to save changes.';
  elements.projectForm.querySelectorAll('input, select, textarea, button').forEach((control) => { control.disabled = !isLoggedIn && control.type !== 'button'; });
}
function saveProject(event) {
  event.preventDefault(); if (!state.session) return showMessage(elements.projectMessage, 'Please log in before editing projects.', 'error');
  const project = { id: $('#projectId').value || crypto.randomUUID(), title: $('#projectTitle').value.trim(), stack: $('#projectStack').value.trim(), status: $('#projectStatus').value, description: $('#projectDescription').value.trim() };
  if (project.title.length < 3 || !project.stack || project.description.length < 12) return showMessage(elements.projectMessage, 'Complete all fields. Description must be at least 12 characters.', 'error');
  const existingIndex = state.projects.findIndex((item) => item.id === project.id);
  if (existingIndex >= 0) state.projects[existingIndex] = project; else state.projects.unshift(project);
  persistProjects(); showMessage(elements.projectMessage, existingIndex >= 0 ? 'Project updated.' : 'Project added.', 'success'); resetProjectForm();
}
function editProject(id) { const project = state.projects.find((item) => item.id === id); if (!project) return; $('#projectId').value = project.id; $('#projectTitle').value = project.title; $('#projectStack').value = project.stack; $('#projectStatus').value = project.status; $('#projectDescription').value = project.description; elements.projectSubmit.textContent = 'Update project'; location.hash = '#projects'; }
function deleteProject(id) { state.projects = state.projects.filter((project) => project.id !== id); persistProjects(); }
function resetProjectForm() { elements.projectForm.reset(); $('#projectId').value = ''; elements.projectSubmit.textContent = 'Add project'; }
function persistProjects() { setJSON(STORAGE_KEYS.projects, state.projects); renderProjects(); updateStats(); }
function renderProjects() {
  const search = elements.searchInput.value.toLowerCase(); const filter = elements.statusFilter.value;
  const visible = state.projects.filter((project) => (filter === 'All' || project.status === filter) && [project.title, project.stack, project.description].join(' ').toLowerCase().includes(search));
  elements.projectList.innerHTML = visible.length ? visible.map(projectTemplate).join('') : '<p class="helper-text">No projects match your criteria.</p>';
  elements.projectList.querySelectorAll('[data-edit]').forEach((button) => button.addEventListener('click', () => editProject(button.dataset.edit)));
  elements.projectList.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', () => deleteProject(button.dataset.delete)));
}
function projectTemplate(project) { return `<article class="project-card"><div class="project-card__header"><h3>${escapeHTML(project.title)}</h3><span class="badge">${project.status}</span></div><p><strong>Stack:</strong> ${escapeHTML(project.stack)}</p><p>${escapeHTML(project.description)}</p><div class="project-card__actions"><button class="edit" data-edit="${project.id}" type="button">Edit</button><button class="delete" data-delete="${project.id}" type="button">Delete</button></div></article>`; }
function updateStats() { $('#totalProjects').textContent = state.projects.length; $('#completedProjects').textContent = state.projects.filter((project) => project.status === 'Completed').length; $('#inProgressProjects').textContent = state.projects.filter((project) => project.status === 'In Progress').length; $('#apiPosts').textContent = state.posts.length; }
async function fetchPosts() {
  elements.apiGrid.innerHTML = '<p class="helper-text">Loading posts from the REST API...</p>';
  try { const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6'); if (!response.ok) throw new Error('API request failed'); state.posts = await response.json(); renderPosts(); }
  catch (error) { elements.apiGrid.innerHTML = `<p class="helper-text">Unable to load API data: ${error.message}</p>`; state.posts = []; }
  updateStats();
}
function renderPosts() { elements.apiGrid.innerHTML = state.posts.map((post) => `<article class="api-card"><h3>${escapeHTML(post.title)}</h3><p>${escapeHTML(post.body)}</p></article>`).join(''); }
function showMessage(element, message, type) { element.textContent = message; element.className = `form__message ${type}`; }
function escapeHTML(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
setAuthMode('login');
init();
