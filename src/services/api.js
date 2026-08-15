const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include', ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || 'Não foi possível concluir a solicitação.');
  return data;
}

export const authApi = {
  me: () => api('/auth/me'),
  login: (data, access = 'client') => api(`/auth/login/${access}`, { method: 'POST', body: JSON.stringify(data) }),
  register: data => api('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => api('/auth/logout', { method: 'POST' })
};
export const projectsApi = {
  list: filters => api(`/projects${filters ? `?${new URLSearchParams(filters)}` : ''}`),
  mine: () => api('/projects/mine'),
  create: data => api('/projects',{method:'POST',body:JSON.stringify(data)}),
  update: (id,data) => api(`/projects/${id}`,{method:'PATCH',body:JSON.stringify(data)}),
  remove: id => api(`/projects/${id}`,{method:'DELETE'})
};
export const ordersApi = {
  list: filters => api(`/orders${filters ? `?${new URLSearchParams(filters)}` : ''}`),
  mine: () => api('/orders/mine'),
  request: data => api('/orders/mine',{method:'POST',body:JSON.stringify(data)}),
  decide: (id,decision) => api(`/orders/mine/${id}/decision`,{method:'PATCH',body:JSON.stringify({decision})}),
  create: data => api('/orders',{method:'POST',body:JSON.stringify(data)}),
  update: (id,data) => api(`/orders/${id}`,{method:'PATCH',body:JSON.stringify(data)}),
  remove: id => api(`/orders/${id}`,{method:'DELETE'})
};
export const ticketsApi = {
  list: filters => api(`/tickets${filters ? `?${new URLSearchParams(filters)}` : ''}`),
  mine: () => api('/tickets/mine'), create: data => api('/tickets/mine',{method:'POST',body:JSON.stringify(data)}),
  myMessages: id => api(`/tickets/mine/${id}/messages`), replyMine: (id,message) => api(`/tickets/mine/${id}/messages`,{method:'POST',body:JSON.stringify({message})}),
  update: (id,data) => api(`/tickets/${id}`,{method:'PATCH',body:JSON.stringify(data)}),
  messages: id => api(`/tickets/${id}/messages`), reply: (id,data) => api(`/tickets/${id}/messages`,{method:'POST',body:JSON.stringify(data)})
};
export const usersApi = {
  list: filters => api(`/users${filters ? `?${new URLSearchParams(filters)}` : ''}`),
  get: id => api(`/users/${id}`),
  create: data => api('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => api(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: id => api(`/users/${id}`, { method: 'DELETE' })
};
export const clientsApi = {
  list: filters => api(`/clients${filters ? `?${new URLSearchParams(filters)}` : ''}`),
  me: () => api('/clients/me'),
  updateMe: data => api('/clients/me',{method:'PATCH',body:JSON.stringify(data)}),
  changePassword: data => api('/clients/me/password',{method:'PATCH',body:JSON.stringify(data)}),
  create: data => api('/clients', { method:'POST', body:JSON.stringify(data) }),
  update: (id, data) => api(`/clients/${id}`, { method:'PATCH', body:JSON.stringify(data) }),
  remove: id => api(`/clients/${id}`, { method:'DELETE' })
};
export const servicesApi = {
  list: filters => api(`/services${filters ? `?${new URLSearchParams(filters)}` : ''}`),
  create: data => api('/services',{method:'POST',body:JSON.stringify(data)}),
  update: (id,data) => api(`/services/${id}`,{method:'PATCH',body:JSON.stringify(data)}),
  remove: id => api(`/services/${id}`,{method:'DELETE'})
};
export const publicCatalogApi = {
  services: () => api('/services/public'),
  projects: () => api('/projects/public')
};
export const contentApi = {
  list: filters => api(`/content${filters ? `?${new URLSearchParams(filters)}` : ''}`),
  public: () => api('/content/public'),
  create: data => api('/content',{method:'POST',body:JSON.stringify(data)}),
  update: (id,data) => api(`/content/${id}`,{method:'PATCH',body:JSON.stringify(data)}),
  remove: id => api(`/content/${id}`,{method:'DELETE'})
};
export const metricsApi = { get: () => api('/metrics') };
export const logsApi = { list: filters => api(`/logs${filters ? `?${new URLSearchParams(filters)}` : ''}`) };
export const settingsApi = { get:()=>api('/settings'), update:data=>api('/settings',{method:'PATCH',body:JSON.stringify(data)}) };
export const maintenanceApi = { status:()=>api('/maintenance/status'), unlock:data=>api('/maintenance/unlock',{method:'POST',body:JSON.stringify(data)}) };
export const invoicesApi = { list:filters=>api(`/invoices${filters?`?${new URLSearchParams(filters)}`:''}`),mine:()=>api('/invoices/mine'),mineOne:id=>api(`/invoices/mine/${id}`),create:data=>api('/invoices',{method:'POST',body:JSON.stringify(data)}),retry:id=>api(`/invoices/${id}/retry`,{method:'POST'}),cancel:id=>api(`/invoices/${id}/cancel`,{method:'PATCH'}),cancelRecurrence:id=>api(`/invoices/recurrences/${id}/cancel`,{method:'PATCH'}) };
export const dashboardApi = { admin:()=>api('/dashboard/admin'), client:()=>api('/client-dashboard') };
export const notificationsApi = { mine:()=>api('/notifications/mine'),read:id=>api(`/notifications/mine/${id}/read`,{method:'PATCH'}),readAll:()=>api('/notifications/mine/read-all',{method:'PATCH'}) };
export const clientSettingsApi = { get:()=>api('/client-settings'),update:data=>api('/client-settings',{method:'PATCH',body:JSON.stringify(data)}) };
