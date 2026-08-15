import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { FormPanel, PageHeader, PortalPage, StatGrid } from '../../components/PortalUI';
import { usersApi } from '../../services/api';
import ClientsPage from './ClientsPage';
import ProjectsPage from './ProjectsPage';
import ServicesPage from './ServicesPage';
import OrdersPage from './OrdersPage';
import TicketsPage from './TicketsPage';
import ContentPage from './ContentPage';
import MetricsPage from './MetricsPage';
import LogsPage from './LogsPage';
import SettingsPage from './SettingsPage';
import InvoicesPage from './InvoicesPage';
import HomePage from './HomePage';

const configs = {
  home:{header:{eyebrow:'OPERAÇÃO',title:'Dashboard administrativo',description:'Visão geral da FiveSystem em tempo real.'},stats:[['Clientes ativos','128','+12 este mês'],['Projetos','24','18 em andamento'],['Tickets abertos','17','4 prioritários'],['Receita mensal','R$ 84k','+8,4% no período']],panel:{title:'Projetos em destaque',columns:['Projeto','Cliente','Status'],rows:[['Portal Commerce','Nexo Ltda.','Em andamento'],['App Operacional','Vértice SA','Em revisão'],['Automação CRM','Orbe Digital','Planejamento']]},secondary:{title:'Atividade',columns:['Evento','Horário'],rows:[['Novo cliente cadastrado','10:42'],['Projeto atualizado','09:18'],['Pagamento confirmado','Ontem']]}},
  usuarios:{header:{eyebrow:'ACESSOS',title:'Gerenciamento de usuários',description:'Controle contas, funções e permissões.',action:'Novo usuário'},stats:[['Usuários','156'],['Clientes','128'],['Equipe','22'],['Bloqueados','06']],panel:{title:'Usuários cadastrados',columns:['Usuário','Papel','Status'],rows:[['Marina Costa','client','Ativo'],['Carlos Lima','staff','Ativo'],['Ana Martins','admin','Ativo'],['João Alves','client','Bloqueado']]}},
  clientes:{header:{eyebrow:'RELACIONAMENTO',title:'Clientes',description:'Contas, contratos e saúde dos clientes.',action:'Novo cliente'},stats:[['Ativos','128'],['Novos no mês','12'],['Em onboarding','08'],['Inativos','14']],panel:{title:'Base de clientes',columns:['Cliente','Projetos','Status'],rows:[['Nexo Ltda.','03','Ativo'],['Vértice SA','02','Ativo'],['Orbe Digital','01','Onboarding'],['Nova Labs','00','Inativo']]}},
  projetos:{header:{eyebrow:'ENTREGAS',title:'Projetos',description:'Planejamento, responsáveis e andamento.',action:'Novo projeto'},stats:[['Total','42'],['Em andamento','18'],['Em revisão','06'],['Concluídos','18']],panel:{title:'Portfólio de projetos',columns:['Projeto','Responsável','Status'],rows:[['Portal Commerce','Lucas Rocha','72%'],['App Operacional','Bianca Melo','56%'],['Automação CRM','Rafael Dias','34%'],['ClientHub','Time Core','100%']]}},
  servicos:{header:{eyebrow:'CATÁLOGO',title:'Serviços',description:'Gerencie as soluções oferecidas pela FiveSystem.',action:'Novo serviço'},stats:[['Publicados','12'],['Rascunhos','03'],['Mais contratado','Sistemas'],['Conversão','18%']],panel:{title:'Catálogo',columns:['Serviço','Categoria','Status'],rows:[['Sistema sob medida','Desenvolvimento','Publicado'],['Automação de processos','Integração','Publicado'],['Consultoria técnica','Estratégia','Rascunho']]}},
  pedidos:{header:{eyebrow:'COMERCIAL',title:'Pedidos e orçamentos',description:'Acompanhe oportunidades e propostas.',action:'Novo orçamento'},stats:[['Em análise','14'],['Aguardando cliente','09'],['Aprovados','31'],['Conversão','42%']],panel:{title:'Pipeline comercial',columns:['Pedido','Cliente','Status'],rows:[['#1048','Nexo Ltda.','Em análise'],['#1047','Orbe Digital','Proposta enviada'],['#1046','Vértice SA','Aprovado'],['#1045','Nova Labs','Negociação']]}},
  tickets:{header:{eyebrow:'ATENDIMENTO',title:'Tickets de suporte',description:'Fila, prioridade e desempenho do suporte.',action:'Novo ticket'},stats:[['Abertos','17'],['Prioritários','04'],['Tempo médio','2h 12m'],['Satisfação','96%']],panel:{title:'Fila de atendimento',columns:['Ticket','Cliente','Status'],rows:[['#024','Nexo Ltda.','Prioritário'],['#023','Vértice SA','Em atendimento'],['#022','Orbe Digital','Aguardando cliente'],['#021','Nova Labs','Novo']]}},
  conteudo:{header:{eyebrow:'SITE',title:'Gerenciamento de conteúdo',description:'Organize textos, projetos e materiais públicos.',action:'Novo conteúdo'},stats:[['Publicados','36'],['Rascunhos','05'],['Agendados','02'],['Atualizados hoje','04']],panel:{title:'Conteúdos recentes',columns:['Conteúdo','Área','Status'],rows:[['Case FiveCommerce','Projetos','Publicado'],['Integrações inteligentes','Serviços','Rascunho'],['FAQ de suporte','Ajuda','Publicado']]}},
  metricas:{header:{eyebrow:'ANÁLISE',title:'Métricas',description:'Indicadores de operação, produto e crescimento.'},stats:[['Visitantes','18,4k','+14%'],['Conversões','327','+8%'],['MRR','R$ 84k','+8,4%'],['Retenção','94%','+2%']],panel:{title:'Desempenho mensal',columns:['Indicador','Atual','Variação'],rows:[['Novos leads','482','+18%'],['Propostas enviadas','68','+11%'],['Projetos fechados','21','+7%'],['Tickets resolvidos','194','+22%']]}},
  logs:{header:{eyebrow:'AUDITORIA',title:'Logs e atividade',description:'Histórico das ações realizadas no sistema.'},panel:{title:'Eventos recentes',columns:['Ação','Responsável','Data'],rows:[['Permissão de usuário alterada','Ana Martins','Hoje, 10:32'],['Projeto #042 atualizado','Lucas Rocha','Hoje, 09:18'],['Cliente bloqueado','Carlos Lima','Ontem, 17:44'],['Conteúdo publicado','Bianca Melo','Ontem, 15:20']]}},
};

function AdminSettings(){return <><div className="portal-head"><div><small>SISTEMA</small><h1 className="display">Configurações</h1><p>Preferências gerais e identidade da plataforma.</p></div></div><FormPanel title="Configurações gerais" fields={[["Nome da empresa","FiveSystem"],["E-mail de suporte","suporte@fivesystem.com.br","email"],["URL pública","https://fivesystem.com.br"]]}/></>}

const emptyUser = { name: '', email: '', password: '', role: 'client', status: 'active' };
function UsersPage() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyUser);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const load = () => usersApi.list().then(data => setUsers(data.users)).catch(error => setError(error.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!modal && !deleteTarget) return;
    const close = event => { if (event.key === 'Escape') { setModal(false); setDeleteTarget(null); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [modal, deleteTarget]);
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const openCreate = () => { setEditing(null); setForm(emptyUser); setError(''); setModal(true); };
  const openEdit = user => { setEditing(user); setForm({ name:user.name, email:user.email, password:'', role:user.role, status:user.status }); setError(''); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); setForm(emptyUser); setError(''); };
  async function submit(event) {
    event.preventDefault(); setError(''); setSaving(true);
    try {
      const payload = editing && !form.password ? { ...form, password: undefined } : form;
      const { user } = editing ? await usersApi.update(editing.id, payload) : await usersApi.create(payload);
      setUsers(current => editing ? current.map(item => item.id === user.id ? user : item) : [user, ...current]);
      closeModal();
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  }
  async function removeUser() {
    if (!deleteTarget) return;
    setError(''); setSaving(true);
    try { await usersApi.remove(deleteTarget.id); setUsers(current => current.filter(item => item.id !== deleteTarget.id)); setDeleteTarget(null); }
    catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  }
  const stats = [
    ['Usuários', String(users.length).padStart(2, '0')],
    ['Clientes', String(users.filter(x => x.role === 'client').length).padStart(2, '0')],
    ['Equipe', String(users.filter(x => ['staff','admin','superadmin'].includes(x.role)).length).padStart(2, '0')],
    ['Bloqueados', String(users.filter(x => x.status === 'blocked').length).padStart(2, '0')]
  ];
  return <>
    <PageHeader eyebrow="ACESSOS" title="Gerenciamento de usuários" description="Controle contas, funções e permissões." action="Novo usuário" onAction={openCreate}/>
    <StatGrid items={stats}/><div className="portal-single"><section className="panel portal-panel users-panel"><div className="panel-title"><h2>Usuários cadastrados</h2><span>{users.length} contas</span></div>
      {loading ? <div className="users-loading">Carregando usuários...</div> : <div className="users-table"><div className="users-row users-head"><span>Usuário</span><span>Papel</span><span>Status</span><span>Ações</span></div>{users.map(user => <div className="users-row" key={user.id}><span className="user-identity"><b>{user.name}</b><small>{user.email}</small></span><span>{user.role}</span><span><i className={`user-status ${user.status}`}>{user.status === 'active' ? 'Ativo' : 'Bloqueado'}</i></span><span className="user-actions"><button onClick={() => openEdit(user)}>Editar</button><button className="danger" onClick={() => { setError(''); setDeleteTarget(user); }}>Remover</button></span></div>)}</div>}
    </section></div>
    {modal && <div className="user-modal-backdrop" onMouseDown={event => event.target === event.currentTarget && setModal(false)}>
      <section className="user-modal" role="dialog" aria-modal="true" aria-labelledby="new-user-title">
        <button className="user-modal-close" onClick={closeModal} aria-label="Fechar">×</button>
        <span className="login-context">{editing ? 'EDITAR ACESSO' : 'NOVO ACESSO'}</span><h2 id="new-user-title" className="display">{editing ? 'Editar usuário' : 'Criar usuário'}</h2><p>{editing ? 'Atualize os dados, o papel ou o status desta conta.' : 'Defina os dados e o nível de acesso da nova conta.'}</p>
        <form onSubmit={submit}>
          <div className="user-modal-grid"><label><span>NOME COMPLETO</span><input autoFocus name="name" value={form.name} onChange={update} required placeholder="Nome do usuário"/></label><label><span>E-MAIL</span><input name="email" type="email" value={form.email} onChange={update} required placeholder="usuario@empresa.com"/></label><label><span>{editing ? 'NOVA SENHA (OPCIONAL)' : 'SENHA TEMPORÁRIA'}</span><input name="password" type="password" minLength="8" value={form.password} onChange={update} required={!editing} placeholder={editing ? 'Deixe vazio para manter a atual' : 'Mínimo de 8 caracteres'}/></label><label><span>FUNÇÃO</span><select name="role" value={form.role} onChange={update}><option value="client">Cliente</option><option value="staff">Equipe</option><option value="admin">Administrador</option></select></label><label><span>STATUS</span><select name="status" value={form.status} onChange={update}><option value="active">Ativo</option><option value="blocked">Bloqueado</option></select></label></div>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <div className="user-modal-actions"><button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button><button className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Criar usuário'}</button></div>
        </form>
      </section>
    </div>}
    {deleteTarget && <div className="user-modal-backdrop" onMouseDown={event => event.target === event.currentTarget && setDeleteTarget(null)}><section className="user-modal confirm-user-delete" role="alertdialog" aria-modal="true"><button className="user-modal-close" onClick={() => setDeleteTarget(null)} aria-label="Fechar">×</button><span className="login-context danger-text">AÇÃO IRREVERSÍVEL</span><h2 className="display">Remover usuário?</h2><p>A conta de <strong>{deleteTarget.name}</strong> será removida permanentemente.</p>{error && <p className="auth-error" role="alert">{error}</p>}<div className="user-modal-actions"><button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancelar</button><button className="btn btn-danger" disabled={saving} onClick={removeUser}>{saving ? 'Removendo...' : 'Remover usuário'}</button></div></section></div>}
  </>;
}

export default function AdminDashboard(){return <DashboardLayout admin><Routes>
  <Route index element={<HomePage/>}/>
  <Route path="usuarios" element={<UsersPage/>}/>
  <Route path="clientes" element={<ClientsPage/>}/>
  <Route path="projetos" element={<ProjectsPage/>}/>
  <Route path="servicos" element={<ServicesPage/>}/>
  <Route path="pedidos" element={<OrdersPage/>}/>
  <Route path="faturas" element={<InvoicesPage/>}/>
  <Route path="tickets" element={<TicketsPage/>}/>
  <Route path="conteudo" element={<ContentPage/>}/>
  <Route path="metricas" element={<MetricsPage/>}/>
  <Route path="logs" element={<LogsPage/>}/>
  {Object.entries(configs).filter(([key])=>!['home','usuarios','clientes','projetos','servicos','pedidos','tickets','conteudo','metricas','logs'].includes(key)).map(([path,config])=><Route key={path} path={path} element={<PortalPage config={config}/>}/>)}
  <Route path="configuracoes" element={<SettingsPage/>}/><Route path="*" element={<PortalPage config={configs.home}/>}/>
</Routes></DashboardLayout>}
