import {Link} from 'react-router-dom';

const services=[
  ['⌘','Sistemas sob medida','Plataformas robustas e escaláveis, construídas em torno do seu processo real.'],
  ['↗','Experiências digitais','Interfaces precisas que tornam produtos complexos mais simples de usar.'],
  ['◎','Automação inteligente','Integrações e fluxos que reduzem tarefas manuais e liberam o seu time.'],
  ['◇','E-commerce','Operações digitais preparadas para vender, integrar e crescer.'],
  ['◫','Portais e dashboards','Dados importantes organizados para decisões mais rápidas.'],
  ['∿','Evolução contínua','Tecnologia acompanhada de perto, com melhoria constante.'],
];

export default function Home(){return <>
  <section className="hero"><div className="container hero-grid">
    <div className="hero-copy"><span className="eyebrow">Tecnologia com direção</span><h1 className="display">Sistemas que fazem seu negócio <em>avançar.</em></h1><p>Projetamos experiências digitais e soluções sob medida para empresas que querem operar melhor, escalar com segurança e criar valor de verdade.</p><div className="hero-actions"><Link className="btn btn-primary" to="/contato">Fale com um especialista →</Link><Link className="btn btn-secondary" to="/projetos">Conheça nossos projetos</Link></div><div className="trust-row"><span><i/>Estratégia antes do código</span><span><i/>Tecnologia escalável</span><span><i/>Parceria de longo prazo</span></div></div>
    <div className="hero-visual" aria-hidden="true"><div className="orbit"/><div className="orb"/><div className="visual-card card-project"><small>Projeto em evolução</small><strong>FiveCommerce</strong><div className="mini-line"/></div><div className="visual-card card-uptime"><small>Disponibilidade</small><strong>99,98%</strong></div></div>
  </div></section>
  <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">O que construímos</span><h2 className="display">Tecnologia que resolve. Estrutura que permanece.</h2></div><p>Da estratégia ao produto em produção, combinamos visão de negócio, design e engenharia.</p></div><div className="service-grid">{services.map((service,index)=><article className="service-card" key={service[1]}><span className="service-num">0{index+1}</span><span className="service-icon">{service[0]}</span><h3>{service[1]}</h3><p>{service[2]}</p></article>)}</div></div></section>
  <section className="brand-signature-section"><div className="container"><div className="brand-signature-copy"><div><span className="eyebrow">Identidade FiveSystem</span><h2 className="display">Mais que um sistema, uma nova experiência.</h2></div><p>Tecnologia, confiança e performance são os pilares que orientam cada produto que criamos.</p></div><div className="brand-signature-frame"><img src="/brand/fivesystem-signature.png" alt="Identidade visual FiveSystem: tecnologia, confiança e performance" loading="lazy"/></div></div></section>
  <section className="section projects"><div className="container"><div className="section-head"><div><span className="eyebrow">Projetos</span><h2 className="display">Produtos digitais feitos para durar.</h2></div></div><div className="project-grid"><article className="project-card"><div className="project-graphic"/><div className="project-info"><span className="tag">Plataforma B2B</span><h3>Operação centralizada</h3><p>Gestão e automações em um único ecossistema.</p></div></article><article className="project-card small"><div className="project-graphic"/><div className="project-info"><span className="tag">E-commerce</span><h3>Comércio sem atrito</h3><p>Uma jornada de compra inteligente e integrada.</p></div></article></div></div></section>
  <section className="cta"><div className="container"><div className="cta-box"><h2 className="display">Seu próximo sistema pode começar com uma boa conversa.</h2><Link className="btn" to="/contato">Começar um projeto →</Link></div></div></section>
</>}
