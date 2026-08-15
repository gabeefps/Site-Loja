import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/PortalUI';
import { clientSettingsApi } from '../../services/api';

const defaults={notifyProjects:true,notifyOrders:true,notifyTickets:true,notifyInvoices:true,emailNotifications:false,emailDigest:'instant',timezone:'America/Sao_Paulo'};
const options=[
  ['notifyProjects','Projetos','Atualizações de progresso, etapas e conclusão.','◇'],
  ['notifyOrders','Pedidos e propostas','Mudanças de status e propostas aguardando sua resposta.','▤'],
  ['notifyTickets','Tickets de suporte','Respostas da equipe e atualizações nos chamados.','◌'],
  ['notifyInvoices','Faturas e pagamentos','Novas cobranças, vencimentos e pagamentos confirmados.','$'],
];

export default function ClientSettingsPage(){
  const[form,setForm]=useState(defaults),[saved,setSaved]=useState(defaults),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState(''),[success,setSuccess]=useState('');
  useEffect(()=>{clientSettingsApi.get().then(({settings})=>{const clean={...settings,emailNotifications:false};setForm(clean);setSaved(clean)}).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[]);
  const dirty=JSON.stringify(form)!==JSON.stringify(saved);
  function change(key,value){setSuccess('');setForm(current=>({...current,[key]:value}))}
  async function submit(){setSaving(true);setError('');try{const{settings}=await clientSettingsApi.update({...form,emailNotifications:false});setForm(settings);setSaved(settings);setSuccess('Preferências salvas com sucesso.')}catch(e){setError(e.message)}finally{setSaving(false)}}
  if(loading)return <><PageHeader eyebrow="PREFERÊNCIAS" title="Configurações" description="Carregando suas preferências."/><div className="users-loading">Carregando configurações...</div></>;
  return <>
    <PageHeader eyebrow="PREFERÊNCIAS" title="Configurações" description="Escolha quais atualizações deseja acompanhar dentro da sua conta."/>
    <section className="panel portal-panel client-settings-panel">
      <div className="panel-title"><div><h2>Notificações no painel</h2><span>Escolha quais atividades devem aparecer na sua central</span></div></div>
      <div className="client-settings-switches">{options.map(([key,title,text,icon])=><label key={key}><i>{icon}</i><span><b>{title}</b><small>{text}</small></span><input type="checkbox" checked={form[key]} onChange={event=>change(key,event.target.checked)}/><em/></label>)}</div>
    </section>
    <section className="panel portal-panel client-settings-panel client-region-settings">
      <div className="panel-title"><div><h2>Região e horário</h2><span>Datas e horários exibidos na plataforma</span></div></div>
      <div className="client-settings-grid">
        <label className="settings-select"><span>FUSO HORÁRIO</span><select value={form.timezone} onChange={event=>change('timezone',event.target.value)}><option value="America/Sao_Paulo">Brasília</option><option value="America/Manaus">Manaus</option><option value="America/Recife">Recife</option><option value="America/Fortaleza">Fortaleza</option></select></label>
        <div className="settings-info"><b>Idioma</b><span>Português (Brasil)</span><small>O idioma padrão da FiveSystem está definido para português.</small></div>
      </div>
    </section>
    {error&&<p className="auth-error">{error}</p>}{success&&<p className="settings-success">{success}</p>}
    {dirty&&<div className="client-settings-save"><span>Você possui alterações que ainda não foram salvas.</span><button onClick={()=>setForm(saved)}>Descartar</button><button onClick={submit} disabled={saving}>{saving?'Salvando...':'Salvar alterações'}</button></div>}
  </>;
}
