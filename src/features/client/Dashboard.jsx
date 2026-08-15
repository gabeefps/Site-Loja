import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { FormPanel, PortalPage } from '../../components/PortalUI';
import ClientOrdersPage from './OrdersPage';
import SupportPage from './SupportPage';
import ProfilePage from './ProfilePage';
import ClientProjectsPage from './ProjectsPage';
import ClientInvoicesPage from './InvoicesPage';
import ClientHomePage from './HomePage';
import NotificationsPage from './NotificationsPage';
import ClientSettingsPage from './SettingsPage';

const configs = {
  home: { header:{eyebrow:'MINHA CONTA',title:'Olá, Cliente.',description:'Acompanhe tudo o que está acontecendo com sua conta.'}, stats:[['Projetos ativos','03','2 em desenvolvimento'],['Solicitações abertas','02','1 aguardando resposta'],['Próxima entrega','18 ago','Portal institucional'],['Faturas pendentes','01','Vence em 5 dias']], panel:{title:'Projetos recentes',columns:['Projeto','Etapa','Status'],rows:[['Portal institucional','Desenvolvimento','Ativo'],['Sistema de pedidos','Planejamento','Em análise'],['Automação comercial','Homologação','Revisão']]}, secondary:{title:'Atividade recente',columns:['Evento','Quando'],rows:[['Novo arquivo recebido','Hoje'],['Ticket #024 respondido','Ontem'],['Fatura disponibilizada','08 ago']]} },
  projetos:{header:{eyebrow:'PROJETOS',title:'Meus projetos',description:'Acompanhe etapas, prazos e entregas.',action:'Solicitar projeto'},stats:[['Total','05'],['Em andamento','03'],['Em revisão','01'],['Concluídos','01']],panel:{title:'Todos os projetos',columns:['Projeto','Progresso','Status'],rows:[['Portal institucional','72%','Ativo'],['Sistema de pedidos','34%','Ativo'],['Automação comercial','88%','Revisão'],['Landing campanha','100%','Concluído']]}},
  pedidos:{header:{eyebrow:'SOLICITAÇÕES',title:'Pedidos e orçamentos',description:'Consulte propostas e faça novas solicitações.',action:'Novo pedido'},stats:[['Em análise','02'],['Aprovados','04'],['Aguardando você','01'],['Total','07']],panel:{title:'Solicitações',columns:['Código','Serviço','Status'],rows:[['#1048','Integração de API','Em análise'],['#1032','Manutenção mensal','Aprovado'],['#1019','Novo dashboard','Aguardando']]}},
  suporte:{header:{eyebrow:'SUPORTE',title:'Central de atendimento',description:'Abra e acompanhe seus chamados.',action:'Abrir ticket'},stats:[['Abertos','02'],['Em atendimento','01'],['Resolvidos','18'],['Tempo médio','2h']],panel:{title:'Meus tickets',columns:['Ticket','Assunto','Status'],rows:[['#024','Ajuste no relatório','Respondido'],['#021','Acesso de usuário','Em atendimento'],['#018','Integração Discord','Resolvido']]}},
  faturas:{header:{eyebrow:'FINANCEIRO',title:'Faturas e pagamentos',description:'Histórico financeiro e documentos para download.'},stats:[['Em aberto','R$ 1.280'],['Pago no mês','R$ 3.450'],['Próximo vencimento','18 ago'],['Total anual','R$ 18,2k']],panel:{title:'Faturas',columns:['Documento','Vencimento','Status'],rows:[['FAT-0826','18/08/2026','Pendente'],['FAT-0726','18/07/2026','Pago'],['FAT-0626','18/06/2026','Pago']]}},
  notificacoes:{header:{eyebrow:'ATUALIZAÇÕES',title:'Notificações',description:'Avisos importantes sobre seus projetos e sua conta.'},panel:{title:'Mais recentes',columns:['Notificação','Data','Status'],rows:[['Seu projeto recebeu uma atualização','Hoje, 10:42','Nova'],['Resposta no ticket #024','Ontem, 16:20','Lida'],['Fatura de agosto disponível','08 ago','Lida']]}},
};

function ClientSettings({ profile = false }) { return <><div className="portal-head"><div><small>{profile?'CONTA':'PREFERÊNCIAS'}</small><h1 className="display">{profile?'Meu perfil':'Configurações'}</h1><p>{profile?'Mantenha seus dados pessoais atualizados.':'Personalize segurança e comunicações.'}</p></div></div><FormPanel title={profile?'Informações pessoais':'Preferências da conta'} fields={profile?[['Nome','Cliente FiveSystem'],['E-mail','cliente@fivesystem.com.br','email'],['Telefone','(11) 99999-9999']]:[['E-mail de notificações','cliente@fivesystem.com.br','email'],['Nova senha','','password'],['Confirmar nova senha','','password']]}/></> }

export default function ClientDashboard(){return <DashboardLayout><Routes>
  <Route index element={<ClientHomePage/>}/><Route path="perfil" element={<ProfilePage/>}/>
  <Route path="projetos" element={<ClientProjectsPage/>}/>
  <Route path="pedidos" element={<ClientOrdersPage/>}/>
  <Route path="suporte" element={<SupportPage/>}/>
  <Route path="faturas" element={<ClientInvoicesPage/>}/>
  <Route path="notificacoes" element={<NotificationsPage/>}/>
  {Object.entries(configs).filter(([key])=>!['home','projetos','pedidos','suporte','faturas','notificacoes'].includes(key)).map(([path,config])=><Route key={path} path={path} element={<PortalPage config={config}/>}/>)}
  <Route path="configuracoes" element={<ClientSettingsPage/>}/><Route path="*" element={<ClientHomePage/>}/>
</Routes></DashboardLayout>}
