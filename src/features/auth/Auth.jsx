import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../../components/Logo';
import { authApi } from '../../services/api';
import { markAuthenticated } from '../../services/authSession';

export default function Auth({ mode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const isAdmin = params.get('acesso') === 'admin';
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', remember: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (isRegister && form.password !== form.confirmPassword) return setError('As senhas não são iguais.');
    setLoading(true);
    try {
      const result = isRegister
        ? await authApi.register({ name: form.name, email: form.email, password: form.password })
        : await authApi.login({ email: form.email, password: form.password, remember: form.remember }, isAdmin ? 'admin' : 'client');
      const user = result.user;
      markAuthenticated(isRegister ? false : form.remember);
      const requested = location.state?.from;
      const destination = requested || (['admin', 'superadmin'].includes(user.role) ? '/admin' : '/cliente');
      navigate(destination, { replace: true });
    } catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }

  return <main className="auth-page">
    <aside className="auth-aside"><Logo/><blockquote>“Boas experiências começam com uma relação de confiança.”<small>FiveSystem · Tecnologia com direção</small></blockquote></aside>
    <section className="auth-main"><div className="auth-card">
      <Link className="back-link" to="/">← Voltar ao site</Link>
      <span className="login-context">{isRegister ? 'CADASTRO DE CLIENTE' : isAdmin ? 'ACESSO ADMINISTRATIVO' : 'ÁREA DO CLIENTE'}</span>
      <h1 className="display">{isRegister ? 'Crie sua conta.' : 'Bem-vindo de volta.'}</h1>
      <p>{isRegister ? 'Preencha seus dados para criar seu acesso.' : 'Entre para acessar seu ambiente FiveSystem.'}</p>
      <form onSubmit={submit}>
        {isRegister && <div className="field"><label>NOME COMPLETO</label><input name="name" value={form.name} onChange={update} required autoComplete="name" placeholder="Seu nome"/></div>}
        <div className="field"><label>E-MAIL</label><input name="email" value={form.email} onChange={update} required type="email" autoComplete="email" placeholder="voce@empresa.com"/></div>
        <div className="field"><label>SENHA</label><input name="password" value={form.password} onChange={update} required minLength="8" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder="Sua senha"/></div>
        {isRegister && <div className="field"><label>CONFIRMAR SENHA</label><input name="confirmPassword" value={form.confirmPassword} onChange={update} required minLength="8" type="password" autoComplete="new-password" placeholder="Repita sua senha"/></div>}
        {!isRegister && <label className="remember-login"><input name="remember" type="checkbox" checked={form.remember} onChange={update}/><span>Lembrar meu login neste dispositivo</span></label>}
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Aguarde...' : isRegister ? 'Criar conta' : 'Entrar'} →</button>
      </form>
      {!isAdmin && <p className="auth-bottom">{isRegister ? <>Já possui acesso? <Link to="/login?acesso=cliente">Entrar</Link></> : <>Ainda não possui conta? <Link to="/cadastro">Criar conta</Link></>}</p>}
      {isAdmin && <p className="frontend-note auth-demo-note">O acesso ao painel depende da permissão administrativa registrada no servidor.</p>}
    </div></section>
  </main>;
}
