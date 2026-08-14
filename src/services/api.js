const API_URL=import.meta.env.VITE_API_URL||'http://localhost:3001/api';
export async function api(path,options={}){const response=await fetch(`${API_URL}${path}`,{credentials:'include',...options,headers:{'Content-Type':'application/json',...options.headers}});if(!response.ok)throw new Error('Não foi possível concluir a solicitação.');return response.json()}
export const authApi={me:()=>api('/auth/me'),login:data=>api('/auth/login',{method:'POST',body:JSON.stringify(data)}),logout:()=>api('/auth/logout',{method:'POST'})};
export const projectsApi={list:()=>api('/projects')};export const ordersApi={list:()=>api('/orders')};export const ticketsApi={list:()=>api('/tickets')};export const usersApi={list:()=>api('/users')};
