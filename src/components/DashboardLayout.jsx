import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { authApi } from '../services/api';
import { clearAuthentication } from '../services/authSession';

const clientItems = [
  ['Visão geral', '', '⌂'], ['Perfil', 'perfil', '◉'], ['Projetos', 'projetos', '◇'],
  ['Pedidos', 'pedidos', '▤'], ['Suporte', 'suporte', '◌'], ['Faturas', 'faturas', '▣'],
  ['Notificações', 'notificacoes', '●'], ['Configurações', 'configuracoes', '⚙']
];
const adminItems = [
  ['Faturas', 'faturas', '▣'],
  ['Visão geral', '', '⌂'], ['Usuários', 'usuarios', '◉'], ['Clientes', 'clientes', '◎'],
  ['Projetos', 'projetos', '◇'], ['Serviços', 'servicos', '◆'], ['Pedidos', 'pedidos', '▤'],
  ['Tickets', 'tickets', '◌'], ['Conteúdo', 'conteudo', '▦'], ['Métricas', 'metricas', '◫'],
  ['Logs', 'logs', '≡'], ['Configurações', 'configuracoes', '⚙']
];

export default function DashboardLayout({ admin = false, children }) {
  const root = admin ? '/admin' : '/cliente';
  const items = admin ? adminItems : clientItems;
  const navigate = useNavigate();
  async function logout() {
    try { await authApi.logout(); } finally { clearAuthentication(); navigate('/'); }
  }
  return <div className="dash">
    <aside className="sidebar">
      <Logo/>
      <div className="side-label">{admin ? 'Administração' : 'Minha conta'}</div>
      <nav>{items.map(([label, path, icon]) => <NavLink end={!path} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`} to={path ? `${root}/${path}` : root} key={path}><b>{icon}</b><span>{label}</span></NavLink>)}</nav>
      <button className="side-logout" onClick={logout}>↗ <span>Sair</span></button>
    </aside>
    <main className="dash-main">
      <nav className="dash-mobile-nav">{items.map(([label, path]) => <NavLink end={!path} to={path ? `${root}/${path}` : root} key={path}>{label}</NavLink>)}</nav>
      {children}
    </main>
  </div>;
}
