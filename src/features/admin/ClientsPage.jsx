import { useEffect, useState } from 'react';
import { PageHeader, StatGrid } from '../../components/PortalUI';
import { clientsApi } from '../../services/api';

const emptyClient = { name:'', company:'', email:'', phone:'', document:'', plan:'Sob medida', status:'onboarding', notes:'' };
export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({ active:0, newThisMonth:0, onboarding:0, inactive:0 });
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [form, setForm] = useState(emptyClient);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  async function load(filters) {
    setLoading(true); setError('');
    try { const data = await clientsApi.list(filters); setClients(data.clients); setStats(data.stats); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!modal && !removeTarget) return;
    const close = event => { if (event.key === 'Escape') { setModal(false); setRemoveTarget(null); } };
    document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close);
  }, [modal, removeTarget]);
  const update = event => setForm(current => ({ ...current, [event.target.name]:event.target.value }));
  const openCreate = () => { setEditing(null); setForm(emptyClient); setError(''); setModal(true); };
  const openEdit = client => { setEditing(client); setForm({ ...emptyClient, ...client }); setError(''); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); setForm(emptyClient); setError(''); };
  async function submit(event) {
    event.preventDefault(); setSaving(true); setError('');
    try { const { client } = editing ? await clientsApi.update(editing.id, form) : await clientsApi.create(form); setClients(current => editing ? current.map(item => item.id === client.id ? client : item) : [client, ...current]); closeModal(); await load(search ? { search } : undefined); }
    catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  }
  async function removeClient() {
    setSaving(true); setError('');
    try { await clientsApi.remove(removeTarget.id); setRemoveTarget(null); await load(search ? { search } : undefined); }
    catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  }
  const statusLabel = { active:'Ativo', onboarding:'Onboarding', inactive:'Inativo' };
  return <>
    <PageHeader eyebrow="RELACIONAMENTO" title="Clientes" description="Contas de cliente entram aqui automaticamente; complete apenas os dados comerciais." action="Novo cliente avulso" onAction={openCreate}/>
    <StatGrid items={[["Ativos",String(stats.active).padStart(2,'0')],["Novos no mês",String(stats.newThisMonth).padStart(2,'0')],["Em onboarding",String(stats.onboarding).padStart(2,'0')],["Inativos",String(stats.inactive).padStart(2,'0')]]}/>
    <div className="portal-single"><section className="panel portal-panel users-panel"><div className="clients-toolbar"><div><h2>Base de clientes</h2><span>{clients.length} registros exibidos</span></div><form onSubmit={event => { event.preventDefault(); load(search ? { search } : undefined); }}><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar cliente, empresa ou documento"/><button>Buscar</button></form></div>
      {error && !modal && !removeTarget && <p className="auth-error" role="alert">{error}</p>}
      {loading ? <div className="users-loading">Carregando clientes...</div> : <div className="users-table"><div className="clients-row users-head"><span>Cliente</span><span>Contato</span><span>Plano</span><span>Status</span><span>Ações</span></div>{clients.map(client => <div className="clients-row" key={client.id}><span className="user-identity"><b>{client.company || client.name}</b><small>{client.company ? client.name : client.document || 'Pessoa física'}</small></span><span className="user-identity"><b>{client.email}</b><small>{client.phone || 'Sem telefone'}</small></span><span>{client.plan}</span><span><i className={`user-status ${client.status}`}>{statusLabel[client.status]}</i></span><span className="user-actions"><button onClick={() => openEdit(client)}>Editar</button><button className="danger" onClick={() => { setError(''); setRemoveTarget(client); }}>Remover</button></span></div>)}</div>}
    </section></div>
    {modal && <div className="user-modal-backdrop" onMouseDown={event => event.target === event.currentTarget && closeModal()}><section className="user-modal client-modal" role="dialog" aria-modal="true"><button className="user-modal-close" onClick={closeModal}>×</button><span className="login-context">{editing?'EDITAR CLIENTE':'NOVO CLIENTE'}</span><h2 className="display">{editing?'Editar cadastro':'Cadastrar cliente'}</h2><p>Informações comerciais e de contato do cliente.</p><form onSubmit={submit}><div className="client-modal-grid"><label><span>NOME DO CONTATO</span><input autoFocus required name="name" value={form.name} onChange={update}/></label><label><span>EMPRESA</span><input name="company" value={form.company} onChange={update}/></label><label><span>E-MAIL</span><input required type="email" name="email" value={form.email} onChange={update}/></label><label><span>TELEFONE</span><input name="phone" value={form.phone} onChange={update}/></label><label><span>CPF / CNPJ</span><input name="document" value={form.document} onChange={update}/></label><label><span>PLANO / SERVIÇO</span><input name="plan" value={form.plan} onChange={update}/></label><label><span>STATUS</span><select name="status" value={form.status} onChange={update}><option value="onboarding">Onboarding</option><option value="active">Ativo</option><option value="inactive">Inativo</option></select></label><label className="client-notes"><span>OBSERVAÇÕES</span><textarea name="notes" value={form.notes} onChange={update} rows="4"/></label></div>{error && <p className="auth-error">{error}</p>}<div className="user-modal-actions"><button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button><button className="btn btn-primary" disabled={saving}>{saving?'Salvando...':editing?'Salvar alterações':'Cadastrar cliente'}</button></div></form></section></div>}
    {removeTarget && <div className="user-modal-backdrop"><section className="user-modal confirm-user-delete" role="alertdialog" aria-modal="true"><button className="user-modal-close" onClick={() => setRemoveTarget(null)}>×</button><span className="login-context danger-text">AÇÃO IRREVERSÍVEL</span><h2 className="display">Remover cliente?</h2><p>O cadastro de <strong>{removeTarget.company || removeTarget.name}</strong> será removido.</p>{error && <p className="auth-error">{error}</p>}<div className="user-modal-actions"><button className="btn btn-secondary" onClick={() => setRemoveTarget(null)}>Cancelar</button><button className="btn btn-danger" disabled={saving} onClick={removeClient}>{saving?'Removendo...':'Remover cliente'}</button></div></section></div>}
  </>;
}
