import {Link,useNavigate,useSearchParams} from 'react-router-dom';
import Logo from '../../components/Logo';

export default function Auth({mode='login'}){
  const navigate=useNavigate();
  const[params]=useSearchParams();
  const isAdmin=params.get('acesso')==='admin';
  const isRegister=mode==='register';

  function submit(event){
    event.preventDefault();
    if(isRegister){navigate('/login?acesso=cliente');return}
    localStorage.setItem('fivesystem_user',JSON.stringify({name:'Gabriel',role:isAdmin?'admin':'client'}));navigate(isAdmin?'/admin':'/cliente');
  }

  return <main className="auth-page">
    <aside className="auth-aside"><Logo/><blockquote>“Boas experiências começam com uma relação de confiança.”<small>FiveSystem · Tecnologia com direção</small></blockquote></aside>
    <section className="auth-main"><div className="auth-card">
      <Link className="back-link" to="/">← Voltar ao site</Link>
      <span className="login-context">{isRegister?'CADASTRO DE CLIENTE':isAdmin?'ACESSO ADMINISTRATIVO':'ÁREA DO CLIENTE'}</span>
      <h1 className="display">{isRegister?'Crie sua conta.':'Bem-vindo de volta.'}</h1>
      <p>{isRegister?'Preencha seus dados para solicitar seu acesso.':'Entre para acessar seu ambiente FiveSystem.'}</p>
      <form onSubmit={submit}>{isRegister&&<div className="field"><label>NOME COMPLETO</label><input required placeholder="Seu nome"/></div>}<div className="field"><label>E-MAIL</label><input required type="email" placeholder="voce@empresa.com"/></div><div className="field"><label>SENHA</label><input required type="password" placeholder="Sua senha"/></div>{isRegister&&<div className="field"><label>CONFIRMAR SENHA</label><input required type="password" placeholder="Repita sua senha"/></div>}<button className="btn btn-primary">{isRegister?'Solicitar cadastro':'Entrar'} →</button></form>
      {!isAdmin&&<p className="auth-bottom">{isRegister?<>Já possui acesso? <Link to="/login?acesso=cliente">Entrar</Link></>:<>Ainda não possui conta? <Link to="/cadastro">Criar conta</Link></>}</p>}
      <p className="frontend-note auth-demo-note">{isRegister?'Este cadastro é apenas uma demonstração visual e ainda não salva informações.':'Este acesso é apenas uma demonstração do frontend. Nenhuma credencial será validada neste momento.'}</p>
    </div></section>
  </main>
}
