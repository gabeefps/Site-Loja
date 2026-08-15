import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import Logo from './Logo';

const links=[['Início','/'],['Serviços','/servicos'],['Projetos','/projetos'],['Sobre','/sobre'],['FAQ','/#faq'],['Contato','/contato']];

export default function Header(){
  const[menuOpen,setMenuOpen]=useState(false);
  const[accessOpen,setAccessOpen]=useState(false);

  useEffect(()=>{
    if(!accessOpen)return;
    const close=event=>event.key==='Escape'&&setAccessOpen(false);
    document.addEventListener('keydown',close);
    document.body.style.overflow='hidden';
    return()=>{document.removeEventListener('keydown',close);document.body.style.overflow=''};
  },[accessOpen]);

  const openAccess=()=>{setMenuOpen(false);setAccessOpen(true)};

  return <>
    <header className="site-header"><div className="container nav-wrap">
      <Logo/>
      <nav className="nav-links">{links.map(([label,path])=><Link key={label} to={path}>{label}</Link>)}</nav>
      <div className="nav-actions"><button className="btn btn-primary" onClick={openAccess}>Entrar <span className="arrow">→</span></button></div>
      <button className="menu-toggle" aria-label="Abrir menu" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?'×':'☰'}</button>
      <div className={`mobile-menu ${menuOpen?'open':''}`}>{links.map(([label,path])=><Link key={label} to={path} onClick={()=>setMenuOpen(false)}>{label}</Link>)}<div className="mobile-actions"><button className="btn btn-primary" onClick={openAccess}>Entrar</button></div></div>
    </div></header>

    {accessOpen&&<div className="access-modal-backdrop" role="presentation" onMouseDown={event=>event.target===event.currentTarget&&setAccessOpen(false)}>
      <section className="access-modal" role="dialog" aria-modal="true" aria-labelledby="access-title">
        <button className="modal-close" aria-label="Fechar" onClick={()=>setAccessOpen(false)}>×</button>
        <span className="eyebrow">Acesso FiveSystem</span>
        <h2 className="display" id="access-title">Como deseja entrar?</h2>
        <p>Escolha o ambiente correspondente ao seu acesso.</p>
        <div className="modal-options">
          <Link className="modal-option primary" to="/login?acesso=cliente" onClick={()=>setAccessOpen(false)}><span className="access-icon">C</span><span><strong>Área do Cliente</strong><small>Acompanhe projetos, solicitações e suporte.</small></span><b>→</b></Link>
          <Link className="modal-option" to="/login?acesso=admin" onClick={()=>setAccessOpen(false)}><span className="access-icon">A</span><span><strong>Painel Administrativo</strong><small>Exclusivo para equipe autorizada.</small></span><b>→</b></Link>
        </div>
        <small className="frontend-note">Demonstração visual — a autenticação real será conectada ao backend futuramente.</small>
      </section>
    </div>}
  </>
}
