const REMEMBER_KEY = 'fivesystem_remember_login';
let authenticatedInThisPage = false;

export function markAuthenticated(remember = false) {
  authenticatedInThisPage = true;
  if (remember) localStorage.setItem(REMEMBER_KEY, 'true');
  else localStorage.removeItem(REMEMBER_KEY);
}

export function canRestoreSession() {
  return authenticatedInThisPage || localStorage.getItem(REMEMBER_KEY) === 'true';
}

export function clearAuthentication() {
  authenticatedInThisPage = false;
  localStorage.removeItem(REMEMBER_KEY);
}
