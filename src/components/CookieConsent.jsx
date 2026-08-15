import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';

const STORAGE_KEY='fivesystem_cookie_consent';

export default function CookieConsent(){
  const[visible,setVisible]=useState(false);
  useEffect(()=>{setVisible(!localStorage.getItem(STORAGE_KEY))},[]);
  function choose(value){localStorage.setItem(STORAGE_KEY,value);setVisible(false)}
  if(!visible)return null;
  return <section className="cookie-consent" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
    <div className="cookie-icon" aria-hidden="true">◉</div>
    <div className="cookie-copy"><span>PRIVACIDADE E COOKIES</span><h2 id="cookie-title">Você aceita nossos termos?</h2><p>Usamos somente armazenamento local para lembrar preferências e demonstrar recursos do frontend. Consulte nossa <Link to="/privacidade">Política de Privacidade</Link> e os <Link to="/termos">Termos de Uso</Link>.</p></div>
    <div className="cookie-actions"><button className="btn btn-secondary" onClick={()=>choose('denied')}>Não</button><button className="btn btn-primary" onClick={()=>choose('accepted')}>Sim, aceito</button></div>
  </section>
}
