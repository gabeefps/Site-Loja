import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentApi, publicCatalogApi } from '../../services/api';

const fallbackServices=[
  {name:'Sistemas sob medida',shortDescription:'Plataformas robustas e escaláveis, construídas em torno do seu processo real.',category:'Desenvolvimento'},
  {name:'Experiências digitais',shortDescription:'Interfaces precisas que tornam produtos complexos mais simples de usar.',category:'Design'},
  {name:'Automação inteligente',shortDescription:'Integrações e fluxos que reduzem tarefas manuais e liberam o seu time.',category:'Automação'},
  {name:'E-commerce',shortDescription:'Operações digitais preparadas para vender, integrar e crescer.',category:'Comércio digital'},
  {name:'Portais e dashboards',shortDescription:'Dados importantes organizados para decisões mais rápidas.',category:'Dados'},
  {name:'Evolução contínua',shortDescription:'Tecnologia acompanhada de perto, com melhoria constante.',category:'Suporte'}
];
const fallbackProjects=[
  {id:'demo-1',name:'Operação centralizada',description:'Gestão e automações em um único ecossistema.',category:'Plataforma B2B',progress:86},
  {id:'demo-2',name:'Comércio sem atrito',description:'Uma jornada de compra inteligente e integrada.',category:'E-commerce',progress:100}
];
const steps=[
  ['01','Descoberta','Entendemos o negócio, os desafios e o resultado que realmente importa.'],
  ['02','Estratégia','Transformamos necessidades em escopo, prioridades e um plano de execução claro.'],
  ['03','Construção','Design e engenharia trabalham juntos, com evolução visível a cada etapa.'],
  ['04','Entrega e evolução','Publicamos, acompanhamos resultados e mantemos o produto avançando.']
];
const icons=['⌘','↗','◎','◇','◫','∿'];
const fallbackFaqs=[
  {id:'faq-1',title:'Como começo um projeto com a FiveSystem?',content:'Conte o que você precisa na página de contato. Nossa equipe avalia o cenário e retorna com os próximos passos.'},
  {id:'faq-2',title:'Os sistemas são feitos sob medida?',content:'Sim. O escopo, as integrações e a experiência são planejados de acordo com a operação e os objetivos de cada cliente.'},
  {id:'faq-3',title:'A FiveSystem oferece suporte após a entrega?',content:'Sim. Podemos acompanhar o produto, corrigir problemas e desenvolver novas evoluções conforme a necessidade.'}
];

export default function Home(){
  const[services,setServices]=useState(fallbackServices);
  const[projects,setProjects]=useState(fallbackProjects);
  const[content,setContent]=useState([]);
  useEffect(()=>{publicCatalogApi.services().then(data=>data.services.length&&setServices(data.services)).catch(()=>{});publicCatalogApi.projects().then(data=>data.projects.length&&setProjects(data.projects)).catch(()=>{});contentApi.public().then(data=>setContent(data.items||[])).catch(()=>{})},[]);
  const faqs=content.filter(item=>item.type==='faq');
  const highlights=content.filter(item=>['section','announcement','testimonial'].includes(item.type));
  return <>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy"><span className="eyebrow">Tecnologia com direção</span><h1 className="display">Sistemas que fazem seu negócio <em>avançar.</em></h1><p>Projetamos experiências digitais e soluções sob medida para empresas que querem operar melhor, escalar com segurança e criar valor de verdade.</p><div className="hero-actions"><Link className="btn btn-primary" to="/contato">Fale com um especialista →</Link><Link className="btn btn-secondary" to="/projetos">Conheça nossos projetos</Link></div><div className="trust-row"><span><i/>Estratégia antes do código</span><span><i/>Tecnologia escalável</span><span><i/>Parceria de longo prazo</span></div></div>
      <div className="hero-visual" aria-hidden="true"><div className="orbit"/><div className="orb"/><div className="visual-card card-project"><small>Projeto em evolução</small><strong>FiveCommerce</strong><div className="mini-line"/></div><div className="visual-card card-uptime"><small>Disponibilidade</small><strong>99,98%</strong></div></div>
    </div></section>
    <section className="section" id="servicos"><div className="container"><div className="section-head"><div><span className="eyebrow">O que construímos</span><h2 className="display">Tecnologia que resolve. Estrutura que permanece.</h2></div><p>Nosso catálogo é atualizado diretamente pela equipe FiveSystem.</p></div><div className="service-grid">{services.map((service,index)=><article className="service-card" key={service.id||service.name}><span className="service-num">{String(index+1).padStart(2,'0')}</span><span className="service-icon">{icons[index%icons.length]}</span>{service.featured&&<b className="landing-featured">Destaque</b>}<small className="landing-category">{service.category}</small><h3>{service.name}</h3><p>{service.shortDescription}</p>{service.priceFrom>0&&<div className="service-meta"><span>A partir de {Number(service.priceFrom).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span><span>~{service.deliveryDays} dias</span></div>}</article>)}</div></div></section>
    <section className="brand-signature-section"><div className="container"><div className="brand-signature-copy"><div><span className="eyebrow">Identidade FiveSystem</span><h2 className="display">Mais que um sistema, uma nova experiência.</h2></div><p>Tecnologia, confiança e performance são os pilares que orientam cada produto que criamos.</p></div><div className="brand-signature-frame"><img src="/brand/fivesystem-signature.png" alt="Identidade visual FiveSystem: tecnologia, confiança e performance" loading="lazy"/></div></div></section>
    <section className="section projects" id="projetos"><div className="container"><div className="section-head"><div><span className="eyebrow">Projetos</span><h2 className="display">Produtos digitais feitos para durar.</h2></div><p>Projetos adicionados no painel aparecem aqui automaticamente, sem expor informações internas.</p></div><div className="landing-project-grid">{projects.map((project,index)=><article className="project-card landing-project" key={project.id}><div className={`project-graphic graphic-${index%3}`}/><div className="project-progress-public"><i style={{width:`${project.progress}%`}}/></div><div className="project-info"><span className="tag">{project.category}</span><h3>{project.name}</h3><p>{project.description}</p><small>{project.progress}% desenvolvido</small></div></article>)}</div></div></section>
    <section className="section landing-process"><div className="container"><div className="process-intro"><span className="eyebrow">Como trabalhamos</span><h2 className="display">Da ideia ao produto, com clareza em cada passo.</h2><p>Um processo objetivo, colaborativo e visível. Você sabe o que está acontecendo e qual é o próximo movimento.</p></div><div className="process-timeline">{steps.map(([number,title,text],index)=><article className="process-step-card" key={number}><div className="process-marker"><span>{number}</span><i/>{index<steps.length-1&&<b/>}</div><div><small>ETAPA {number}</small><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>
    {highlights.length>0&&<section className="section landing-editorial"><div className="container"><div className="section-head"><div><span className="eyebrow">Novidades FiveSystem</span><h2 className="display">Conteúdo em destaque.</h2></div><p>Informações publicadas pela nossa equipe.</p></div><div className="landing-content-grid">{highlights.map(item=><article className={`landing-content-card ${item.type}`} key={item.id}><small>{item.type==='announcement'?'COMUNICADO':item.type==='testimonial'?'DEPOIMENTO':'DESTAQUE'}</small><h3>{item.title}</h3>{item.subtitle&&<strong>{item.subtitle}</strong>}<p>{item.content}</p>{item.buttonLabel&&item.buttonUrl&&<a className="content-link" href={item.buttonUrl}>{item.buttonLabel} →</a>}</article>)}</div></div></section>}
    <section className="section landing-faq" id="faq"><div className="container"><div className="section-head"><div><span className="eyebrow">Dúvidas frequentes</span><h2 className="display">Respostas diretas para começar.</h2></div><p>Se ainda precisar de ajuda, fale com a nossa equipe.</p></div><div className="faq-list">{(faqs.length?faqs:fallbackFaqs).map((item,index)=><details className="faq-item" key={item.id} open={index===0}><summary><span>{String(index+1).padStart(2,'0')}</span>{item.title}<i>+</i></summary><p>{item.content}</p></details>)}</div></div></section>
    <section className="cta"><div className="container"><div className="cta-box"><h2 className="display">Seu próximo sistema pode começar com uma boa conversa.</h2><Link className="btn" to="/contato">Começar um projeto →</Link></div></div></section>
  </>;
}
