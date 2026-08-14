import {Link} from 'react-router-dom';
import Logo from './Logo';

const groups=[
  {title:'Navegação',links:[['Início','/'],['Serviços','/servicos'],['Projetos','/projetos'],['Sobre','/sobre']]},
  {title:'Atendimento',links:[['Contato','/contato'],['Área do cliente','/login?acesso=cliente'],['Painel administrativo','/login?acesso=admin']]},
  {title:'Legal',links:[['Privacidade','/privacidade'],['Termos de uso','/termos']]},
];

export default function Footer(){return <footer className="footer">
  <div className="container">
    <div className="footer-callout"><div><span className="footer-kicker">VAMOS CONSTRUIR ALGO?</span><h2 className="display">Transforme sua ideia em um sistema que funciona.</h2></div><Link className="btn btn-primary" to="/contato">Iniciar um projeto <span className="arrow">→</span></Link></div>
    <div className="footer-main">
      <div className="footer-brand"><Logo/><p>Tecnologia, confiança e performance para transformar desafios complexos em experiências digitais simples.</p><a className="footer-email" href="mailto:novosprojetos@fivesystem.com.br"><span>●</span> novosprojetos@fivesystem.com.br</a></div>
      <div className="footer-nav">{groups.map(group=><div className="footer-group" key={group.title}><h4>{group.title}</h4>{group.links.map(([label,path])=><Link key={label} to={path}>{label}<span>↗</span></Link>)}</div>)}</div>
    </div>
    <div className="footer-bottom"><span>© 2026 FiveSystem. Todos os direitos reservados.</span><div className="footer-status"><i/> Sistemas operacionais</div><a href="https://discord.gg/fivesystem" target="_blank" rel="noreferrer">Discord ↗</a></div>
  </div>
</footer>}
