import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, StatGrid } from '../../components/PortalUI';
import { dashboardApi } from '../../services/api';

const money = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dateTime = value => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
const statusNames = { planning: 'Planejamento', in_progress: 'Em andamento', review: 'Em revisão', completed: 'Concluído', requested: 'Solicitado', analysis: 'Em análise', quoted: 'Proposta enviada', approved: 'Aprovado', rejected: 'Recusado', cancelled: 'Cancelado' };
const actionNames = { create: 'criou', update: 'editou', delete: 'removeu' };
const resourceNames = { users: 'usuários', clients: 'clientes', projects: 'projetos', services: 'serviços', orders: 'pedidos', tickets: 'tickets', content: 'conteúdo', settings: 'configurações', invoices: 'faturas' };

function EmptyDashboard({ title, text }) {
  return <div className="empty-state"><strong>{title}</strong><span>{text}</span></div>;
}

export default function AdminHomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi.admin().then(setData).catch(err => setError(err.message));
  }, []);

  const maxMonthlyValue = useMemo(() => Math.max(1, ...(data?.monthly || []).map(item => item.value)), [data]);

  if (!data) return <>
    <PageHeader eyebrow="OPERAÇÃO" title="Dashboard administrativo" description="Visão geral da FiveSystem em tempo real." />
    {error ? <p className="auth-error">Não foi possível carregar a visão geral: {error}</p> : <div className="users-loading">Organizando os indicadores...</div>}
  </>;

  const stats = data.stats || {};
  const counts = data.counts || {};
  const projects = data.recentProjects || [];
  const orders = data.recentOrders || [];
  const activity = data.activity || [];
  const monthly = data.monthly || [];

  return <>
    <PageHeader eyebrow="OPERAÇÃO" title="Dashboard administrativo" description="O que precisa da sua atenção agora, com dados atualizados do sistema." />
    <StatGrid items={[
      ['Clientes ativos', stats.activeClients || 0, `+${stats.newClients || 0} neste mês`],
      ['Projetos em andamento', stats.activeProjects || 0, `${stats.averageProgress || 0}% de progresso médio`],
      ['Tickets abertos', stats.openTickets || 0, `${stats.priorityTickets || 0} prioritários`],
      ['Valor recebido', money(stats.received), `${money(stats.receivable)} a receber`],
    ]} />

    <div className="admin-alert-grid">
      <Link to="/admin/pedidos"><small>COMERCIAL</small><strong>{counts.pendingOrders || 0}</strong><span>pedidos aguardando análise</span><b>Ver pedidos →</b></Link>
      <Link to="/admin/faturas"><small>FINANCEIRO</small><strong>{counts.overdueInvoices || 0}</strong><span>faturas vencidas</span><b>Ver faturas →</b></Link>
      <Link to="/admin/tickets"><small>SUPORTE</small><strong>{stats.priorityTickets || 0}</strong><span>tickets de alta prioridade</span><b>Ver suporte →</b></Link>
      <Link to="/admin/clientes"><small>RELACIONAMENTO</small><strong>{counts.onboarding || 0}</strong><span>clientes em onboarding</span><b>Ver clientes →</b></Link>
    </div>

    <div className="admin-home-grid">
      <section className="panel portal-panel admin-project-overview">
        <div className="panel-title"><div><h2>Projetos recentes</h2><span>Acompanhamento das entregas</span></div><Link to="/admin/projetos">Ver todos</Link></div>
        {projects.length ? projects.map(project => <div className="admin-project-line" key={project.id}>
          <span className="user-identity"><b>{project.name}</b><small>{project.client}</small></span>
          <div><span>{statusNames[project.status] || project.status}</span><b>{project.progress}%</b><i><em style={{ width: `${project.progress}%` }} /></i></div>
        </div>) : <EmptyDashboard title="Nenhum projeto cadastrado" text="Os projetos recentes aparecerão aqui." />}
      </section>

      <section className="panel portal-panel admin-finance-chart">
        <div className="panel-title"><div><h2>Recebimentos</h2><span>Últimos seis meses</span></div><Link to="/admin/faturas">Financeiro</Link></div>
        {monthly.length ? <div className="mini-finance-bars">{monthly.map(item => <div key={item.period}><span>{money(item.value)}</span><i style={{ height: `${Math.max(8, item.value / maxMonthlyValue * 100)}%` }} /><b>{item.period.slice(5)}/{item.period.slice(2, 4)}</b></div>)}</div> : <EmptyDashboard title="Sem pagamentos confirmados" text="Os recebimentos aparecerão aqui." />}
      </section>
    </div>

    <div className="admin-home-grid lower">
      <section className="panel portal-panel">
        <div className="panel-title"><div><h2>Pedidos recentes</h2><span>Movimentação comercial</span></div><Link to="/admin/pedidos">Ver todos</Link></div>
        {orders.length ? <div className="admin-order-list">{orders.map(order => <div key={order.id}>
          <span className="user-identity"><b>{order.code} · {order.title}</b><small>{order.client}</small></span>
          <strong>{order.estimated_value ? money(order.estimated_value) : 'A definir'}</strong>
          <i className={`user-status ${order.status}`}>{statusNames[order.status] || order.status}</i>
        </div>)}</div> : <EmptyDashboard title="Nenhum pedido cadastrado" text="Os pedidos recentes aparecerão aqui." />}
      </section>

      <section className="panel portal-panel">
        <div className="panel-title"><div><h2>Atividade recente</h2><span>Auditoria do sistema</span></div><Link to="/admin/logs">Ver logs</Link></div>
        {activity.length ? <div className="admin-activity-list">{activity.map(item => <div key={item.id}><i /><span><b>{item.actor_name || 'Sistema'} {actionNames[item.action] || item.action} {resourceNames[item.resource] || item.resource}</b><small>{dateTime(item.created_at)}</small></span></div>)}</div> : <EmptyDashboard title="Nenhuma atividade recente" text="As alterações administrativas aparecerão aqui." />}
      </section>
    </div>
  </>;
}
