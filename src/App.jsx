import {Routes,Route} from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';
import CookieConsent from './components/CookieConsent';
import Home from './features/landing/Home';
import PublicPage from './features/landing/PublicPage';
import LegalPage from './features/landing/LegalPage';
import Auth from './features/auth/Auth';
import ClientDashboard from './features/client/Dashboard';
import AdminDashboard from './features/admin/Dashboard';

const pages={
  servicos:{eyebrow:'Soluções',title:'Tecnologia na medida do seu desafio.',description:'Soluções conectadas ao seu negócio.',items:[{title:'Sistemas sob medida',text:'Aplicações construídas para seus fluxos.'},{title:'Automação',text:'Processos conectados para eliminar retrabalho.'},{title:'Produtos digitais',text:'Estratégia, experiência e engenharia.'}]},
  projetos:{eyebrow:'Projetos',title:'Resultados digitais com fundamento.',description:'Desafios transformados em produtos confiáveis.',items:[{title:'FiveCommerce',text:'Ecossistema de vendas integrado.'},{title:'FlowOps',text:'Painel operacional para equipes.'},{title:'ClientHub',text:'Portal completo de relacionamento.'}]},
  sobre:{eyebrow:'Sobre',title:'Tecnologia com visão de negócio.',description:'Estratégia, design e engenharia para produtos que duram.',items:[{title:'Proximidade',text:'Trabalhamos lado a lado com você.'},{title:'Clareza',text:'Decisões transparentes e objetivas.'},{title:'Consistência',text:'Qualidade técnica em cada etapa.'}]},
  contato:{eyebrow:'Contato',title:'Conte o que você quer construir.',description:'Nosso time retornará com os próximos passos.',items:[{title:'Projetos',text:'novosprojetos@fivesystem.com.br'},{title:'Suporte',text:'suporte@fivesystem.com.br'},{title:'Atendimento',text:'Segunda a sexta, das 9h às 18h.'}]}
};

const Public=({children})=><PublicLayout>{children}</PublicLayout>;

export default function App(){return <><Routes>
  <Route path="/" element={<Public><Home/></Public>}/>
  {Object.entries(pages).map(([path,data])=><Route key={path} path={`/${path}`} element={<Public><PublicPage {...data}/></Public>}/>)}
  <Route path="/privacidade" element={<Public><LegalPage type="privacidade"/></Public>}/>
  <Route path="/termos" element={<Public><LegalPage type="termos"/></Public>}/>
  <Route path="/login" element={<Auth/>}/>
  <Route path="/cadastro" element={<Auth mode="register"/>}/>
  <Route path="/cliente/*" element={<ProtectedRoute roles={['client','staff','admin','superadmin']}><ClientDashboard/></ProtectedRoute>}/>
  <Route path="/admin/*" element={<ProtectedRoute roles={['admin','superadmin']}><AdminDashboard/></ProtectedRoute>}/>
  <Route path="*" element={<Public><PublicPage eyebrow="404" title="Página não encontrada" description="O endereço informado não existe." items={[]}/></Public>}/>
</Routes><CookieConsent/></>}
