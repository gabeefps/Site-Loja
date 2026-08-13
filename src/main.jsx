import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard, BarChart3, Package, ShoppingCart, Users, Wallet, Settings,
  Bell, Search, Plus, Crown, TicketPercent, Bot, Activity, CreditCard, Target,
  TrendingUp, ArrowUpRight, Star, ShieldCheck, CalendarDays, Download, Filter,
  MoreVertical, CheckCircle2, Clock3, XCircle, Sparkles, Zap, MessageSquareText,
  UserRound, Boxes, Tags, Gauge, Server, Lock, Palette, LifeBuoy, FileText,
  ChevronRight, Menu, X, Eye, Send, BadgeCheck, Pencil, Trash2, Save, Power, AlertTriangle, Minus, Maximize2
} from "lucide-react";
import "./style.css";

const sales = [
  { day: "Seg", value: 740, orders: 18 },
  { day: "Ter", value: 980, orders: 24 },
  { day: "Qua", value: 1280, orders: 31 },
  { day: "Qui", value: 1090, orders: 27 },
  { day: "Sex", value: 1640, orders: 39 },
  { day: "Sáb", value: 2120, orders: 52 },
  { day: "Dom", value: 1560, orders: 35 }
];

const monthly = [
  { month: "Jan", value: 4200 }, { month: "Fev", value: 5100 }, { month: "Mar", value: 6100 },
  { month: "Abr", value: 7800 }, { month: "Mai", value: 9100 }, { month: "Jun", value: 12450 }
];

const products = [
  { name: "VIP Diamante", category: "VIP", price: "R$ 89,90", sales: 148, status: "Ativo", badge: "Mais vendido" },
  { name: "VIP Ouro", category: "VIP", price: "R$ 49,90", sales: 123, status: "Ativo", badge: "Popular" },
  { name: "Carro Importado", category: "Veículos", price: "R$ 34,90", sales: 78, status: "Ativo", badge: "Alta procura" },
  { name: "Pacote Inicial", category: "Pacotes", price: "R$ 19,90", sales: 214, status: "Ativo", badge: "Entrada" },
  { name: "500 Gemas", category: "Moedas", price: "R$ 14,90", sales: 62, status: "Pausado", badge: "Estoque baixo" }
];

const customers = [
  { name: "Gabriel", tag: "@gabrieltrindadek1", spent: "R$ 1.240,70", orders: 18, tier: "Diamante" },
  { name: "Marcos RP", tag: "@marcosrp", spent: "R$ 820,30", orders: 12, tier: "Ouro" },
  { name: "Luna", tag: "@lunarp", spent: "R$ 610,00", orders: 9, tier: "Prata" },
  { name: "Pedro Dev", tag: "@pedrodev", spent: "R$ 489,90", orders: 7, tier: "Bronze" }
];

const activities = [
  { icon: CheckCircle2, title: "Pagamento aprovado", desc: "VIP Diamante entregue para @gabrieltrindadek1", time: "agora" },
  { icon: ShoppingCart, title: "Novo pedido", desc: "Pacote Inicial comprado via Discord", time: "4 min" },
  { icon: TicketPercent, title: "Cupom usado", desc: "Cupom DISCORD20 aplicado em uma compra", time: "11 min" },
  { icon: Bot, title: "Bot sincronizado", desc: "Cargos e produtos atualizados no servidor", time: "28 min" },
  { icon: XCircle, title: "Pagamento cancelado", desc: "Pedido #1048 expirou sem confirmação", time: "1 h" }
];

const activityIcons = {
  success: CheckCircle2,
  order: ShoppingCart,
  sync: Bot,
  coupon: TicketPercent,
  warning: Clock3,
  cancelled: XCircle,
  info: Activity
};

const tickets = [
  { id: "#2041", user: "Gabriel", subject: "Produto não chegou", priority: "Alta", status: "Aberto" },
  { id: "#2040", user: "Luna", subject: "Troca de produto", priority: "Média", status: "Em análise" },
  { id: "#2039", user: "Marcos", subject: "Dúvida sobre VIP", priority: "Baixa", status: "Resolvido" }
];

const heat = [
  [22, 30, 18, 28, 35, 52, 41],
  [18, 24, 32, 25, 44, 60, 49],
  [12, 20, 29, 31, 48, 67, 55],
  [8, 16, 22, 26, 39, 58, 36]
];

function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map(csvEscape).join(";")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportAnalyticsCsv(data) {
  const rows = [["Tipo", "Nome", "Valor", "Pedidos/Vendas"]];
  (data?.monthly || []).forEach((item) => rows.push(["Mensal", item.month, Number(item.value || 0).toFixed(2), item.orders || 0]));
  (data?.categories || []).forEach((item) => rows.push(["Categoria", item.category, Number(item.revenue || 0).toFixed(2), item.sales || 0]));
  const k = data?.kpis || {};
  rows.push(["KPI", "Receita", Number(k.revenue || 0).toFixed(2), ""]);
  rows.push(["KPI", "Clientes", k.customers || 0, ""]);
  rows.push(["KPI", "Ticket médio", Number(k.averageTicket || 0).toFixed(2), ""]);
  downloadCsv("analytics-simplificado.csv", rows);
}

function exportFinanceCsv(data) {
  const rows = [["Tipo", "Título", "Valor", "Data"]];
  const s = data?.summary || {};
  rows.push(["Resumo", "Receita bruta", Number(s.grossRevenue || 0).toFixed(2), ""]);
  rows.push(["Resumo", "Lucro líquido", Number(s.netProfit || 0).toFixed(2), ""]);
  rows.push(["Resumo", "Pendente", Number(s.pendingRevenue || 0).toFixed(2), ""]);
  rows.push(["Resumo", "Cancelado", Number(s.cancelledRevenue || 0).toFixed(2), ""]);
  rows.push(["Resumo", "Despesas", Number(s.expenses || 0).toFixed(2), ""]);
  rows.push(["Resumo", "Taxas", Number(s.fees || 0).toFixed(2), ""]);
  rows.push(["Resumo", "Reembolsos", Number(s.refunds || 0).toFixed(2), ""]);
  (data?.transactions || []).forEach((item) => rows.push([item.type, item.title, Number(item.amount || 0).toFixed(2), formatDate(item.createdAt)]));
  downloadCsv("financeiro-simplificado.csv", rows);
}

function useApiStatus() {
  const [online, setOnline] = useState(false);
  const [checking, setChecking] = useState(true);
  async function check() {
    try {
      const res = await fetch(`${API_URL}/api/status`);
      setOnline(res.ok);
    } catch {
      setOnline(false);
    } finally {
      setChecking(false);
    }
  }
  useEffect(() => {
    check();
    const timer = setInterval(check, 10000);
    return () => clearInterval(timer);
  }, []);
  return { online, checking };
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const originalFetch = window.fetch.bind(window);
window.fetch = (resource, options = {}) => originalFetch(resource, {
  ...options,
  credentials: typeof resource === "string" && resource.startsWith(API_URL) ? "include" : options.credentials
});

function AuthGate() {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const authResult = new URLSearchParams(window.location.search).get("auth");

  async function verify() {
    setStatus("loading");
    try {
      const response = await fetch(`${API_URL}/api/auth/me`);
      const data = await response.json();
      if (!response.ok || !data.authenticated) throw new Error();
      setUser(data.user);
      setStatus("authorized");
      if (authResult) window.history.replaceState({}, "", window.location.pathname);
    } catch {
      setStatus(authResult === "denied" ? "denied" : authResult === "error" ? "error" : "login");
    }
  }

  useEffect(() => { verify(); }, []);

  if (status === "authorized") return <App authUser={user} />;
  return <main className="authScreen"><section className="authCard">
    <div className="authLogo"><ShieldCheck size={34}/></div>
    <span className="authEyebrow">ÁREA RESTRITA</span>
    <h1>{status === "denied" ? "Cargo necessário" : status === "error" ? "Não foi possível entrar" : "Painel administrativo"}</h1>
    <p>{status === "loading" ? "Verificando sua sessão com segurança..." : status === "denied" ? "Sua conta está no servidor, mas não possui um dos cargos autorizados. Após receber o cargo, tente novamente." : status === "error" ? "O Discord não concluiu a autenticação. Tente novamente." : "Entre com o Discord. Seu acesso será liberado somente se você tiver um dos cargos permitidos no servidor."}</p>
    {status === "loading" ? <div className="authLoader"/> : <a className="discordLogin" href={`${API_URL}/api/auth/login`}><MessageSquareText size={20}/> {status === "login" ? "Entrar com Discord" : "Tentar novamente"}</a>}
    <small><Lock size={13}/> A verificação é feita diretamente pelo Discord.</small>
  </section></main>;
}

function useDashboardData() {
  const [data, setData] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(requestCategories);

  useEffect(() => {
    fetch(`${API_URL}/api/dashboard`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setApiOnline(true);
      })
      .catch(() => {
        setData(null);
        setApiOnline(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, apiOnline, loading };
}


function useAnalyticsData() {
  const [data, setData] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/analytics`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setApiOnline(true);
      })
      .catch(() => {
        setData(null);
        setApiOnline(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, apiOnline, loading };
}




function useDiscordData() {
  const [data, setData] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/discord/overview`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao carregar Discord");
      setData(json);
      setApiOnline(true);
    } catch (err) {
      setData(null);
      setApiOnline(false);
      setError(err.message || "Backend Discord offline");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function request(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Erro ao executar ação no Discord");
    await load();
    return json;
  }

  return {
    data, apiOnline, loading, error, reload: load,
    createRole: (payload) => request("/api/discord/roles", { method: "POST", body: JSON.stringify(payload) }),
    updateRole: (id, payload) => request(`/api/discord/roles/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    deleteRole: (id) => request(`/api/discord/roles/${id}`, { method: "DELETE" }),
    addRole: (memberId, roleId) => request(`/api/discord/members/${memberId}/roles/${roleId}`, { method: "PUT" }),
    removeRole: (memberId, roleId) => request(`/api/discord/members/${memberId}/roles/${roleId}`, { method: "DELETE" }),
    updateMember: (memberId, payload) => request(`/api/discord/members/${memberId}`, { method: "PATCH", body: JSON.stringify(payload) })
  };
}


function useEmbedsData() {
  const emptyEmbed = {
    title: "",
    description: "",
    color: "#a70000",
    url: "",
    authorName: "",
    authorIcon: "",
    thumbnail: "",
    image: "",
    footerText: "",
    footerIcon: "",
    fields: []
  };
  const [channels, setChannels] = useState([]);
  const [history, setHistory] = useState([]);
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [channelsRes, historyRes] = await Promise.all([
        fetch(`${API_URL}/api/embeds/channels`),
        fetch(`${API_URL}/api/embeds/history`)
      ]);
      const channelsJson = await channelsRes.json();
      const historyJson = await historyRes.json();
      if (!channelsRes.ok) throw new Error(channelsJson.error || "Falha ao carregar canais pelo bot");
      setChannels(channelsJson.channels || []);
      setHistory(historyJson.history || []);
      setApiOnline(true);
    } catch (err) {
      setChannels([]);
      setHistory([]);
      setApiOnline(false);
      setError(err.message || "Bot/backend offline");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function sendEmbed(payload) {
    const res = await fetch(`${API_URL}/api/embeds/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Erro ao enviar embed");
    await load();
    return json;
  }

  return { emptyEmbed, channels, history, apiOnline, loading, error, reload: load, sendEmbed };
}

function useNotificationsData() {
  const [data, setData] = useState({ notifications: [], summary: null });
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/notifications`);
      if (!res.ok) throw new Error("Falha ao buscar notificações");
      const json = await res.json();
      setData({ notifications: json.notifications || [], summary: json.summary || null });
      setApiOnline(true);
    } catch (error) {
      setData({ notifications: [], summary: null });
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function markAllRead() {
    const res = await fetch(`${API_URL}/api/notifications/read-all`, { method: "PATCH" });
    if (!res.ok) throw new Error("Falha ao marcar notificações");
    await load();
  }

  return { ...data, apiOnline, loading, reload: load, markAllRead };
}

function useBotSettingsData() {
  const [data, setData] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bot-settings`);
      if (!res.ok) throw new Error("Falha ao buscar configurações do bot");
      const json = await res.json();
      setData(json);
      setApiOnline(true);
    } catch (error) {
      setData(null);
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function saveSettings(settings) {
    const res = await fetch(`${API_URL}/api/bot-settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error("Falha ao salvar configurações");
    await load();
  }

  async function createEmbed(embed) {
    const res = await fetch(`${API_URL}/api/bot-settings/embeds`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed)
    });
    if (!res.ok) throw new Error("Falha ao criar embed");
    await load();
  }

  async function deleteEmbed(id) {
    const res = await fetch(`${API_URL}/api/bot-settings/embeds/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Falha ao remover embed");
    await load();
  }

  async function sendVerificationEmbed() {
    const res = await fetch(`${API_URL}/api/bot-settings/send-verification`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    const json = await res.json().catch(()=>({}));
    if (!res.ok) throw new Error(json.error || "Falha ao enviar embed de verificação");
    return json;
  }

  return { data, apiOnline, loading, load, saveSettings, createEmbed, deleteEmbed, sendVerificationEmbed };
}

function useFinanceData() {
  const [data, setData] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/finance`);
      if (!res.ok) throw new Error("Falha ao buscar financeiro");
      const json = await res.json();
      setData(json);
      setApiOnline(true);
    } catch (error) {
      setData(null);
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return { data, apiOnline, loading, reload: load };
}


function useCustomersData() {
  const [data, setData] = useState({ customers: [], summary: null });
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load(search = "") {
    setLoading(true);
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await fetch(`${API_URL}/api/customers${query}`);
      if (!res.ok) throw new Error("Falha ao buscar clientes");
      const json = await res.json();
      setData({
        customers: json.customers || [],
        summary: json.summary || null
      });
      setApiOnline(true);
    } catch (error) {
      setData({ customers: [], summary: null });
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return { ...data, apiOnline, loading, reload: load };
}

function useProductsData() {
  const [items, setItems] = useState([]);
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (!res.ok) throw new Error("Falha ao buscar produtos");
      const json = await res.json();
      setItems(json.products || []);
      setApiOnline(true);
    } catch (error) {
      setItems([]);
      setCategories(requestCategories);
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return { items, apiOnline, loading, reload: load };
}


function useStoreRequestsData() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(requestCategories);
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/store-requests`);
      if (!res.ok) throw new Error("Falha ao buscar solicitações");
      const json = await res.json();
      setItems(json.requests || []);
      setCategories(json.categories || requestCategories);
      setApiOnline(true);
    } catch (error) {
      setItems([]);
      setCategories(requestCategories);
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(dbId, status) {
    const res = await fetch(`${API_URL}/api/store-requests/${dbId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Falha ao atualizar status");
    await load();
  }

  async function sendReply(dbId, message, status) {
    const res = await fetch(`${API_URL}/api/store-requests/${dbId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, status })
    });
    if (!res.ok) throw new Error("Falha ao enviar resposta");
    await load();
  }

  return { items, categories, apiOnline, loading, reload: load, updateStatus, sendReply };
}


function useTicketsManager() {
  const [config, setConfig] = useState({ settings: {}, categories: [], channels: [], discordCategories: [], roles: [] });
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(silent = false) {
    if (!silent) setLoading(true);
    try {
      const [configRes, ticketsRes] = await Promise.all([
        fetch(`${API_URL}/api/tickets/config`),
        fetch(`${API_URL}/api/tickets`)
      ]);
      const configJson = await configRes.json();
      const ticketsJson = await ticketsRes.json();
      if (!configRes.ok) throw new Error(configJson.error || "Falha ao carregar configuração de tickets");
      if (!ticketsRes.ok) throw new Error(ticketsJson.error || "Falha ao carregar tickets");
      setConfig(configJson);
      setTickets(ticketsJson.tickets || []);
      setApiOnline(true);
      setError("");
    } catch (err) {
      if (!silent) {
        setApiOnline(false);
        setError(err.message || "Backend/bot offline");
      }
    } finally { if (!silent) setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function refreshMessages(ticketId) {
    if (!ticketId) return;
    const res = await fetch(`${API_URL}/api/tickets/${ticketId}/messages`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Falha ao carregar mensagens");
    setMessages(json.messages || []);
  }

  async function loadMessages(ticketId) {
    setSelectedId(ticketId);
    await refreshMessages(ticketId);
  }

  async function saveSettings(settings) {
    const res = await fetch(`${API_URL}/api/tickets/settings`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(settings) });
    if (!res.ok) throw new Error("Falha ao salvar configurações");
    await load();
  }

  async function saveCategory(category) {
    const method = category.id ? "PATCH" : "POST";
    const url = category.id ? `${API_URL}/api/tickets/categories/${category.id}` : `${API_URL}/api/tickets/categories`;
    const res = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(category) });
    const json = await res.json().catch(()=>({}));
    if (!res.ok) throw new Error(json.error || "Falha ao salvar categoria");
    await load();
  }

  async function deleteCategory(id) {
    const res = await fetch(`${API_URL}/api/tickets/categories/${id}`, { method:"DELETE" });
    if (!res.ok) throw new Error("Falha ao remover categoria");
    await load();
  }

  async function sendPanel(payload) {
    const res = await fetch(`${API_URL}/api/tickets/panel/send`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
    const json = await res.json().catch(()=>({}));
    if (!res.ok) throw new Error(json.error || "Falha ao enviar painel");
    await load();
    return json;
  }

  async function replyTicket(id, message) {
    const res = await fetch(`${API_URL}/api/tickets/${id}/reply`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({message}) });
    const json = await res.json().catch(()=>({}));
    if (!res.ok) throw new Error(json.error || "Falha ao responder ticket");
    await loadMessages(id);
  }

  async function closeTicket(id, reason) {
    const res = await fetch(`${API_URL}/api/tickets/${id}/close`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({reason}) });
    const json = await res.json().catch(()=>({}));
    if (!res.ok) throw new Error(json.error || "Falha ao fechar ticket");
    await load();
  }

  return { config, tickets, selectedId, messages, apiOnline, loading, error, reload:load, loadMessages, refreshMessages, saveSettings, saveCategory, deleteCategory, sendPanel, replyTicket, closeTicket };
}


function useRequestPanelManager() {
  const [config, setConfig] = useState({ settings:{}, categories:[], channels:[] });
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/request-panels/config`);
      const json = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(json.error || "Falha ao carregar embeds de pedidos");
      setConfig(json);
      setApiOnline(true);
    } catch (err) {
      setApiOnline(false);
      setError(err.message || "Backend/bot offline");
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); }, []);

  async function saveSettings(settings) {
    const res = await fetch(`${API_URL}/api/request-panels/settings`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(settings) });
    const json = await res.json().catch(()=>({}));
    if (!res.ok) throw new Error(json.error || "Falha ao salvar configuração");
    await load();
  }

  async function saveCategory(category) {
    const url = category.id ? `${API_URL}/api/request-panels/categories/${category.id}` : `${API_URL}/api/request-panels/categories`;
    const res = await fetch(url, { method: category.id ? "PATCH" : "POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(category) });
    const json = await res.json().catch(()=>({}));
    if (!res.ok) throw new Error(json.error || "Falha ao salvar categoria");
    await load();
  }

  async function deleteCategory(id) {
    const res = await fetch(`${API_URL}/api/request-panels/categories/${id}`, { method:"DELETE" });
    const json = await res.json().catch(()=>({}));
    if (!res.ok) throw new Error(json.error || "Falha ao apagar categoria");
    await load();
  }

  async function sendPanel(payload) {
    const res = await fetch(`${API_URL}/api/request-panels/panel/send`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
    const json = await res.json().catch(()=>({}));
    if (!res.ok) throw new Error(json.error || "Falha ao enviar painel de pedidos");
    await load();
    return json;
  }

  return { config, apiOnline, loading, error, reload:load, saveSettings, saveCategory, deleteCategory, sendPanel };
}

function App({ authUser }) {
  const [active, setActive] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const apiStatus = useApiStatus();

  const menu = [
    ["Dashboard", LayoutDashboard], ["Analytics", BarChart3], ["Produtos", Package],
    ["Pedidos", ShoppingCart], ["Config Pedidos", FileText], ["Clientes", Users], ["Financeiro", Wallet],
    ["Tickets", MessageSquareText], ["Config Tickets", Settings], ["Embeds", FileText], ["Discord", Bot], ["Notificações", Bell],
    ["Configurações", Settings]
  ];

  const Page = {
    Dashboard, Analytics, Produtos, Pedidos, "Config Pedidos": RequestPanelConfig, Clientes, Financeiro, Tickets,
    "Config Tickets": TicketConfig, Embeds, Discord, Notificacoes, Configuracoes
  }[active.replace("ç", "c").replace("õ", "o")] || Dashboard;

  return (
    <main className="app">
      <aside className={menuOpen ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <div className="brandMark">DS</div>
          <div><strong>Discord Store</strong><span>Painel administrativo</span></div>
          <button className="iconButton mobileClose" onClick={() => setMenuOpen(false)}><X size={18} /></button>
        </div>

        <nav>
          {menu.map(([name, Icon]) => (
            <button key={name} onClick={() => { setActive(name); setMenuOpen(false); }} className={active === name ? "active" : ""}>
              <Icon size={19} /><span>{name}</span>
            </button>
          ))}
        </nav>

        <div className={apiStatus.online ? "apiStatusCard online" : "apiStatusCard offline"}>
          <Server size={22} />
          <strong>API {apiStatus.online ? "online" : apiStatus.checking ? "verificando" : "offline"}</strong>
          <p>{apiStatus.online ? "Backend conectado e pronto para dados reais." : "Inicie o backend para carregar os dados reais."}</p>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <button className="iconButton menuButton" onClick={() => setMenuOpen(true)}><Menu size={21} /></button>
          <div className="titleBlock"><span>Administração</span><h1>{active}</h1></div>
          <div className="authUser">{authUser?.avatar ? <img src={authUser.avatar} alt=""/> : <UserRound size={20}/>}<span>{authUser?.username}</span><button onClick={async()=>{await fetch(`${API_URL}/api/auth/logout`,{method:"POST"});window.location.reload();}}>Sair</button></div>

        </header>
        <Page />
      </section>
    </main>
  );
}

function Dashboard() {
  const { data, apiOnline, loading } = useDashboardData();
  const overview = data?.overview || { revenue: 12450, orders: 384, customers: 1284, averageTicket: 32.42, monthlyGoal: 17300 };
  const chartSales = data?.sales?.length ? data.sales : sales;
  const goalPercent = Math.min(100, Math.round((overview.revenue / overview.monthlyGoal) * 100));

  return <>
    <section className="hero">
      <div>
        <span className="pill"><Zap size={15}/> {apiOnline ? "API conectada" : "API offline"}</span>
        <h2>Visão geral da operação</h2>
        <p>{apiOnline ? "Dados carregados do backend." : "Backend offline. Inicie a API para carregar os dados reais."}</p>
      </div>
      <div className="heroMetric"><span>Meta mensal</span><strong>{goalPercent}%</strong><small>{money(overview.revenue)} / {money(overview.monthlyGoal)}</small><div className="progress"><i style={{width:`${goalPercent}%`}} /></div></div>
    </section>

    <div className="statsGrid">
      <Stat icon={Wallet} title="Faturamento" value={money(overview.revenue)} change="API" />
      <Stat icon={ShoppingCart} title="Pedidos" value={String(overview.orders)} change="API" />
      <Stat icon={Users} title="Clientes" value={String(overview.customers)} change="API" />
      <Stat icon={CreditCard} title="Ticket médio" value={money(overview.averageTicket)} change="API" />
    </div>

    <div className="mainGrid">
      <Panel title="Vendas dos últimos 7 dias" desc="Faturamento diário carregado do backend quando disponível."><LineChart data={chartSales} /></Panel>
      <Panel title="Produtos mais vendidos" desc="Ranking por quantidade de vendas."><TopProducts items={data?.topProducts} loading={loading} apiOnline={apiOnline} /></Panel>
      <Panel title="Atividades recentes" desc="Eventos recentes carregados do backend."><ActivityFeed items={data?.activities} loading={loading} apiOnline={apiOnline} /></Panel>
      <Panel title="Top compradores" desc="Clientes que mais compraram."><CustomerRank items={data?.topCustomers} loading={loading} apiOnline={apiOnline} /></Panel>
    </div>
  </>;
}

function Analytics() {
  const { data, apiOnline, loading } = useAnalyticsData();
  const monthlyData = data?.monthly?.length ? data.monthly : [];
  const heatmapData = data?.heatmap?.length ? data.heatmap : [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];

  return <>
    <section className="hero compactHero">
      <div>
        <span className="pill"><BarChart3 size={15}/> {apiOnline ? "Analytics conectado" : "Analytics visual"}</span>
        <h2>Análise de desempenho</h2>
        <p>{apiOnline ? "Gráficos, categorias, mapa de calor e KPIs vindos do backend." : "Backend offline. Inicie a API para carregar os dados reais."}</p>
        <button className="ghost exportInline" onClick={() => exportAnalyticsCsv(data)} disabled={!apiOnline || loading}><Download size={16}/> Exportar planilha</button>
      </div>
      <div className="heroMetric"><span>Receita analisada</span><strong>{money(data?.kpis?.revenue ?? 0)}</strong><small>{data?.kpis?.customers ?? 0} clientes monitorados</small></div>
    </section>

    <div className="mainGrid analytics">
      <Panel title="Crescimento mensal" desc="Receita acumulada por mês vinda da API.">{loading ? <EmptyState loading={loading} apiOnline={apiOnline} /> : <BarChart data={monthlyData} />}</Panel>
      <Panel title="Mapa de calor" desc="Períodos com maior volume de compra."><Heatmap data={heatmapData} /></Panel>
      <Panel title="Categorias" desc="Participação por tipo de produto."><Donut data={data?.categories} apiOnline={apiOnline} loading={loading} /></Panel>
      <Panel title="Indicadores" desc="Comparativo rápido do mês."><Kpis data={data?.kpis} apiOnline={apiOnline} loading={loading} /></Panel>
    </div>
  </>;
}

const emptyProduct = { name: "", category: "VIP", price: "", stock: "0", badge: "", description: "", active: true, roles: [] };
const emptyRole = { role_id: "", role_name: "", duration_days: "30" };


function useOrdersData() {
  const [data, setData] = useState({ orders: [], products: [], customers: [], summary: null });
  const [apiOnline, setApiOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders`);
      if (!res.ok) throw new Error("Falha ao buscar pedidos");
      const json = await res.json();
      setData({
        orders: json.orders || [],
        products: json.products || [],
        customers: json.customers || [],
        summary: json.summary || null
      });
      setApiOnline(true);
    } catch (error) {
      setData({ orders: [], products: [], customers: [], summary: null });
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return { ...data, apiOnline, loading, reload: load };
}

function Produtos() {
  const { items, apiOnline, loading, reload } = useProductsData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const visibleProducts = (apiOnline ? items : []).filter((item) => {
    const text = `${item.name} ${item.category} ${item.badge}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  function openCreate() {
    setEditing(null);
    setForm(emptyProduct);
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm({
      name: product.name || "",
      category: product.category || "VIP",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? 0),
      badge: product.badge || "",
      description: product.description || "",
      active: Boolean(product.active),
      roles: Array.isArray(product.roles) ? product.roles.map((role) => ({
        role_id: role.role_id || "",
        role_name: role.role_name || "",
        duration_days: String(role.duration_days || 30)
      })) : []
    });
    setModalOpen(true);
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveProduct(event) {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(String(form.price).replace(",", ".")),
      stock: Number(form.stock || 0),
      active: form.active ? 1 : 0,
      roles: (form.roles || [])
        .map((role) => ({
          role_id: String(role.role_id || "").trim(),
          role_name: String(role.role_name || "").trim(),
          duration_days: Number(role.duration_days || 0)
        }))
        .filter((role) => role.role_id && role.duration_days > 0)
    };

    try {
      const url = editing ? `${API_URL}/api/products/${editing.id}` : `${API_URL}/api/products`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Erro ao salvar produto");
      setModalOpen(false);
      await reload();
    } catch (error) {
      alert("Não foi possível salvar. Veja se o backend está ligado e o banco foi importado.");
    } finally {
      setSaving(false);
    }
  }

  function removeProduct(product) {
    setDeleteTarget(product);
  }

  async function confirmDeleteProduct() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Erro ao remover produto");
      setDeleteTarget(null);
      await reload();
    } catch (error) {
      alert(error.message || "Não foi possível remover o produto.");
    } finally {
      setDeleting(false);
    }
  }

  async function toggleProduct(product) {
    try {
      const res = await fetch(`${API_URL}/api/products/${product.id}/toggle`, { method: "PATCH" });
      if (!res.ok) throw new Error("Erro ao alterar status");
      await reload();
    } catch (error) {
      alert("Não foi possível alterar o status do produto.");
    }
  }

  function addRoleRule() {
    setForm((current) => ({ ...current, roles: [...(current.roles || []), { ...emptyRole }] }));
  }

  function updateRoleRule(index, field, value) {
    setForm((current) => ({
      ...current,
      roles: (current.roles || []).map((role, i) => i === index ? { ...role, [field]: value } : role)
    }));
  }

  function removeRoleRule(index) {
    setForm((current) => ({
      ...current,
      roles: (current.roles || []).filter((_, i) => i !== index)
    }));
  }

  return <>
    <Panel title="Catálogo de produtos" desc={apiOnline ? "Produtos carregados do MySQL com CRUD completo." : "Backend offline. Inicie a API para gerenciar produtos reais."}>
      <div className="toolbar productsToolbar">
        <label className="searchBox inlineSearch"><Search size={16}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar produto..." /></label>
        <button className="ghost small" onClick={reload}><Filter size={16}/> Atualizar</button>
        <button className="primary small" onClick={openCreate}><Plus size={16}/> Produto</button>
      </div>

      {!apiOnline || loading || !visibleProducts.length ? (
        <EmptyState loading={loading} apiOnline={apiOnline} text={search ? "Nenhum produto encontrado nessa busca." : "Nenhum produto cadastrado ainda."} />
      ) : (
        <>
          <div className="productGrid">{visibleProducts.map(p => <article className="productCard" key={p.id}>
            <div className="productCardTop"><div className="productIcon"><Package size={24}/></div><span className="tag">{p.badge || p.category}</span></div>
            <h3>{p.name}</h3>
            <p>{p.description || p.category}</p>
            <strong>{money(Number(p.price || 0))}</strong>
            <div className="row"><span>{p.sales || 0} vendas • Estoque {p.stock ?? 0}</span><em className={p.active ? "ok" : "warn"}>{p.active ? "Ativo" : "Pausado"}</em></div>
            <div className="rolePreview">{(p.roles || []).length ? `${p.roles.length} cargo(s) configurado(s)` : "Sem cargo automático"}</div>
            <div className="cardActions">
              <button className="ghost small" onClick={() => openEdit(p)}><Pencil size={15}/> Editar</button>
              <button className="ghost small" onClick={() => toggleProduct(p)}><Power size={15}/> {p.active ? "Pausar" : "Ativar"}</button>
              <button className="danger small" onClick={() => removeProduct(p)}><Trash2 size={15}/> Remover</button>
            </div>
          </article>)}</div>

          <div className="tableWrap productsTable"><table><thead><tr><th>ID</th><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Cargos</th><th>Status</th><th>Ações</th></tr></thead><tbody>{visibleProducts.map((p) => <tr key={`row-${p.id}`}><td>#{p.id}</td><td>{p.name}</td><td>{p.category}</td><td>{money(Number(p.price || 0))}</td><td>{p.stock ?? 0}</td><td>{(p.roles || []).length}</td><td><span className="statusBadge">{p.active ? "Ativo" : "Pausado"}</span></td><td><button className="ghost miniButton" onClick={() => openEdit(p)}>Gerenciar</button></td></tr>)}</tbody></table></div>
        </>
      )}
    </Panel>

    {modalOpen && <div className="modalOverlay" onMouseDown={(e) => { if (e.target.className === "modalOverlay") setModalOpen(false); }}>
      <form className="modal" onSubmit={saveProduct}>
        <div className="modalHeader"><div><span>Produtos</span><h3>{editing ? "Gerenciar produto" : "Adicionar produto"}</h3></div><button type="button" className="iconButton" onClick={() => setModalOpen(false)}><X size={18}/></button></div>
        <div className="formGrid">
          <label>Nome<input required value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="VIP Diamante" /></label>
          <label>Categoria<input required value={form.category} onChange={(e) => updateForm("category", e.target.value)} placeholder="VIP" /></label>
          <label>Preço<input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => updateForm("price", e.target.value)} placeholder="89.90" /></label>
          <label>Estoque<input type="number" min="0" value={form.stock} onChange={(e) => updateForm("stock", e.target.value)} placeholder="100" /></label>
          <label>Selo<input value={form.badge} onChange={(e) => updateForm("badge", e.target.value)} placeholder="Mais vendido" /></label>
          <label>Status<select value={form.active ? "1" : "0"} onChange={(e) => updateForm("active", e.target.value === "1")}><option value="1">Ativo</option><option value="0">Pausado</option></select></label>
          <label className="fullField">Descrição<textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Descrição curta do produto" /></label>
        </div>

        <div className="rolesEditor">
          <div className="rolesEditorHeader">
            <div><strong>Cargos entregues pelo bot</strong><p>Configure um ou mais cargos para serem adicionados ao aprovar a compra.</p></div>
            <button type="button" className="ghost small" onClick={addRoleRule}><Plus size={15}/> Add cargo</button>
          </div>
          {!(form.roles || []).length && <div className="emptySmall">Nenhum cargo configurado para este produto.</div>}
          {(form.roles || []).map((role, index) => <div className="roleRule" key={index}>
            <label>ID do cargo<input value={role.role_id} onChange={(e) => updateRoleRule(index, "role_id", e.target.value)} placeholder="Role ID do Discord" /></label>
            <label>Nome interno<input value={role.role_name} onChange={(e) => updateRoleRule(index, "role_name", e.target.value)} placeholder="VIP Ouro" /></label>
            <label>Dias<input type="number" min="1" value={role.duration_days} onChange={(e) => updateRoleRule(index, "duration_days", e.target.value)} placeholder="30" /></label>
            <button type="button" className="danger small" onClick={() => removeRoleRule(index)}><Trash2 size={15}/></button>
          </div>)}
        </div>

        <div className="modalActions"><button type="button" className="ghost" onClick={() => setModalOpen(false)}>Cancelar</button><button className="primary" disabled={saving}><Save size={17}/> {saving ? "Salvando..." : "Salvar produto"}</button></div>
      </form>
    </div>}

    {deleteTarget && <div className="modalOverlay" onMouseDown={(e) => { if (e.target.className === "modalOverlay" && !deleting) setDeleteTarget(null); }}>
      <div className="confirmModal">
        <div className="confirmIcon"><AlertTriangle size={30}/></div>
        <h3>Remover produto?</h3>
        <p>Você está prestes a remover <strong>{deleteTarget.name}</strong> do catálogo. Se ele tiver pedidos antigos, o histórico será mantido e o produto ficará oculto da lista.</p>
        <div className="modalActions confirmActions">
          <button type="button" className="ghost" disabled={deleting} onClick={() => setDeleteTarget(null)}>Cancelar</button>
          <button type="button" className="danger confirmDanger" disabled={deleting} onClick={confirmDeleteProduct}><Trash2 size={17}/> {deleting ? "Removendo..." : "Remover produto"}</button>
        </div>
      </div>
    </div>}
  </>;
}

const storeRequests = [
  {
    id: "#REQ-2041",
    title: "Adicionar VIP Diamante na loja",
    message: "Queria um VIP acima do Ouro com mais benefícios, tag exclusiva e prioridade no suporte.",
    user: "Gabriel",
    tag: "@gabrieltrindadek1",
    initials: "GA",
    category: "Produto",
    votes: 48,
    origin: "#pedidos-loja",
    status: "Novo",
    date: "Hoje às 18:42"
  },
  {
    id: "#REQ-2040",
    title: "Cupom de fim de semana",
    message: "Seria bom ter cupom automático todo sábado para incentivar mais compras na loja.",
    user: "Pedro",
    tag: "@pedrodev",
    initials: "PE",
    category: "Promoção",
    votes: 31,
    origin: "#sugestoes",
    status: "Em análise",
    date: "Hoje às 17:20"
  },
  {
    id: "#REQ-2039",
    title: "Compra aprovada mas produto não chegou",
    message: "Fiz uma compra pelo Discord, o pagamento apareceu como aprovado, mas o cargo ainda não foi entregue.",
    user: "Marcos",
    tag: "@marcosrp",
    initials: "MA",
    category: "Problema na compra",
    votes: 12,
    origin: "#suporte-loja",
    status: "Aceito",
    date: "Ontem às 22:10"
  },
  {
    id: "#REQ-2038",
    title: "Pedido de reembolso",
    message: "Comprei o produto errado e gostaria de solicitar reembolso ou troca por outro produto.",
    user: "Luna",
    tag: "@lunarp",
    initials: "LU",
    category: "Reembolso",
    votes: 3,
    origin: "#reembolsos",
    status: "Recusado",
    date: "Ontem às 16:03"
  },
  {
    id: "#REQ-2037",
    title: "Dúvida sobre renovação de VIP",
    message: "Queria saber se o VIP renova automaticamente ou preciso comprar novamente quando vencer.",
    user: "Rafael",
    tag: "@rafaelrp",
    initials: "RA",
    category: "Dúvida",
    votes: 8,
    origin: "#duvidas",
    status: "Concluído",
    date: "13/06 às 20:14"
  }
];

const requestCategories = ["Todos", "Pedido", "Sugestão", "Produto", "Promoção", "Problema na compra", "Reembolso", "Dúvida"];
const requestStatuses = ["Novo", "Em análise", "Aceito", "Recusado", "Concluído"];

function Pedidos() {
  const { items: requests, categories: dynamicRequestCategories, apiOnline, loading, updateStatus, sendReply } = useStoreRequestsData();
  const [selectedId, setSelectedId] = useState(null);
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = requests.filter((item) => {
    const term = search.trim().toLowerCase();
    const matchCategory = category === "Todos" || item.category === category;
    const matchSearch = !term || String(item.title || "").toLowerCase().includes(term) || String(item.message || "").toLowerCase().includes(term) || String(item.user || "").toLowerCase().includes(term) || String(item.id || "").toLowerCase().includes(term);
    return matchCategory && matchSearch;
  });

  const selected = requests.find((item) => item.id === selectedId) || filtered[0] || requests[0];

  useEffect(() => {
    if (!selectedId && requests.length) setSelectedId(requests[0].id);
  }, [requests, selectedId]);

  async function updateSelectedStatus(status) {
    if (!selected?.dbId) return;
    setSaving(true);
    try {
      await updateStatus(selected.dbId, status);
    } catch (error) {
      alert("Não foi possível alterar o status. Confira se o backend está ligado.");
    } finally {
      setSaving(false);
    }
  }

  async function quickAction(status) {
    if (!selected?.dbId) return;
    const message = reply.trim() || (status === "Aceito" ? "Sua solicitação foi aprovada e será encaminhada para a equipe da loja." : status === "Recusado" ? "Sua solicitação foi analisada, mas não poderá ser aprovada no momento." : "Sua solicitação foi atualizada pela equipe da loja.");
    setSaving(true);
    try {
      await sendReply(selected.dbId, message, status);
      setReply("");
    } catch (error) {
      alert("Não foi possível registrar a resposta. Confira se o backend está ligado.");
    } finally {
      setSaving(false);
    }
  }

  return <div className="requestsPage">
    <div className="pageTop">
      <div><span>Administração</span><h1>Pedidos</h1></div>
      <div className="topActions"><label className="searchBox"><Search size={17}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Pesquisar..." /></label><button className="primary" disabled title="Novos pedidos entram pelo bot"><Plus size={17}/> Novo</button></div>
    </div>

    <div className="requestsGrid">
      <section className="requestsListPanel">
        <div className="requestsHeader"><div><h3>Central da Loja</h3><p>{apiOnline ? "Solicitações puxadas da tabela store_requests do MySQL." : "Backend offline. Ligue a API para puxar do banco."}</p></div><button className="ghost small"><Filter size={16}/> Filtros</button></div>
        <div className="categoryPills">{dynamicRequestCategories.map((item)=><button key={item} className={category === item ? "active" : ""} onClick={()=>setCategory(item)}>{item}</button>)}</div>
        <div className="requestCards">
          {loading && <div className="emptyRequests"><MessageSquareText size={30}/><strong>Carregando pedidos...</strong><p>Buscando dados no MySQL.</p></div>}
          {!loading && filtered.map((item)=><button key={item.id} className={`requestCard ${selected?.id === item.id ? "selected" : ""}`} onClick={()=>setSelectedId(item.id)}>
            <div className="requestCardTop"><span>{item.id}</span><strong className={`requestStatus status-${slugStatus(item.status)}`}>{item.status}</strong></div>
            <h3>{item.title}</h3>
            <p>{item.message}</p>
            <div className="requestMeta"><span><UserRound size={14}/>{item.user}</span><span><Star size={14}/>{item.votes}</span><span><Tags size={14}/>{item.category}</span></div>
          </button>)}
          {!loading && !filtered.length && <div className="emptyRequests"><MessageSquareText size={30}/><strong>Nenhum pedido encontrado</strong><p>{apiOnline ? "Tente outra categoria ou termo de busca." : "Backend offline ou tabela vazia."}</p></div>}
        </div>
      </section>

      {selected && <section className="requestDetailsPanel">
        <div className="detailTitle"><div><h3>{selected.title}</h3><p>{selected.id} • enviado via {selected.origin}</p></div><strong className={`requestStatus status-${slugStatus(selected.status)}`}>{selected.status}</strong></div>
        <div className="clientBox"><div className="clientAvatar">{selected.initials}</div><div><strong>{selected.user}</strong><p>{selected.tag}</p></div></div>
        <div className="clientMessage"><span>Mensagem do cliente</span><p>{selected.message}</p></div>
        <div className="infoGrid">
          <InfoCard icon={Tags} label="Categoria" value={selected.category}/>
          <InfoCard icon={Star} label="Votos" value={`${selected.votes} aprovações`}/>
          <InfoCard icon={CalendarDays} label="Data" value={selected.date}/>
          <InfoCard icon={Bot} label="Origem" value={selected.origin}/>
        </div>
        <div className="statusBlock"><h3>Alterar status</h3><div className="statusButtons">{requestStatuses.map((status)=><button key={status} disabled={saving} className={`statusOption status-${slugStatus(status)} ${selected.status === status ? "active" : ""}`} onClick={()=>updateSelectedStatus(status)}>{status}</button>)}</div></div>
        <div className="replyBlock"><h3>Responder no Discord</h3><textarea value={reply} onChange={(e)=>setReply(e.target.value)} placeholder="Escreva uma resposta para o cliente no Discord..." /></div>
        <div className="detailActions"><button className="ghost" disabled={saving} onClick={()=>quickAction("Recusado")}><XCircle size={17}/> Recusar</button><button className="ghost" disabled={saving} onClick={()=>quickAction("Em análise")}><Send size={17}/> Responder</button><button className="primary" disabled={saving} onClick={()=>quickAction("Aceito")}><CheckCircle2 size={17}/> Aprovar solicitação</button></div>
      </section>}
    </div>
  </div>;
}

function slugStatus(status) {
  return status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

function InfoCard({ icon: Icon, label, value }) {
  return <div className="infoCard"><Icon size={18}/><div><strong>{label}</strong><p>{value}</p></div></div>;
}

function Clientes() {
  const { customers: dbCustomers, summary, apiOnline, loading, reload } = useCustomersData();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const selected = dbCustomers.find((item) => item.id === selectedId) || dbCustomers[0];

  function submitSearch(event) {
    event.preventDefault();
    reload(search);
  }

  return <>
    <section className="hero compactHero">
      <div>
        <span className="pill"><Users size={15}/> {apiOnline ? "Clientes conectados ao DB" : "Backend offline"}</span>
        <h2>Clientes por compras</h2>
        <p>Essa página não cria conta de cliente. Ela apenas lê o histórico de compras da tabela de pedidos e mostra quem mais comprou.</p>
      </div>
      <div className="heroMetric">
        <span>Receita dos clientes</span>
        <strong>{money(summary?.totalRevenue ?? 0)}</strong>
        <small>{summary?.customersWithOrders ?? 0} clientes com compras • {summary?.totalOrders ?? 0} pedidos</small>
      </div>
    </section>

    <div className="toolbar">
      <form className="searchBox inlineSearch" onSubmit={submitSearch}>
        <Search size={18}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Buscar cliente, tag ou ID..." />
      </form>
      <button className="ghost" onClick={()=>reload(search)}><Filter size={17}/> Atualizar</button>
    </div>

    <div className="clientsLayout">
      <Panel title="Ranking de compradores" desc="Ordenado pelo total pago em compras aprovadas.">
        {!dbCustomers.length ? <EmptyState loading={loading} apiOnline={apiOnline} text="Nenhuma compra encontrada na tabela de pedidos." /> :
          <div className="rankList">{dbCustomers.map((client) => (
            <button className={`clientRank ${selected?.id === client.id ? "active" : ""}`} key={client.id} onClick={()=>setSelectedId(client.id)}>
              <span>#{client.rank}</span>
              <div className="avatar miniAvatar">{client.initials}</div>
              <div>
                <strong>{client.name}</strong>
                <p>{client.discordTag || "Sem tag"} • {client.totalOrders} pedidos</p>
              </div>
              <b>{money(client.totalSpent)}</b>
            </button>
          ))}</div>
        }
      </Panel>

      <Panel title="Histórico de compras" desc="Compras carregadas da tabela orders/pedidos.">
        {!selected ? <EmptyState loading={loading} apiOnline={apiOnline} text="Selecione um cliente para ver o histórico." /> :
          <div className="clientDetail">
            <div className="clientHeader">
              <div className="avatar">{selected.initials}</div>
              <div>
                <h3>{selected.name}</h3>
                <p>{selected.discordTag || "Sem tag do Discord"}</p>
              </div>
              <span className="tier"><Crown size={15}/>{selected.tier}</span>
            </div>

            <div className="clientStats">
              <Mini label="Total gasto" value={money(selected.totalSpent)} />
              <Mini label="Pedidos" value={String(selected.totalOrders)} />
              <Mini label="Pagos" value={String(selected.paidOrders)} />
              <Mini label="Pendentes" value={String(selected.pendingOrders)} />
            </div>

            <div className="tableWrap">
              <table>
                <thead><tr><th>Pedido</th><th>Produto</th><th>Categoria</th><th>Valor</th><th>Status</th><th>Data</th></tr></thead>
                <tbody>
                  {selected.purchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td>#{purchase.id}</td>
                      <td>{purchase.productName}</td>
                      <td>{purchase.productCategory}</td>
                      <td>{money(purchase.amount)}</td>
                      <td><span className="statusBadge">{purchase.statusLabel}</span></td>
                      <td>{formatDate(purchase.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        }
      </Panel>
    </div>
  </>;
}

function Financeiro() {
  const { data, apiOnline, loading } = useFinanceData();
  const summary = data?.summary;
  const cashflow = data?.cashflow || [];
  const transactions = data?.transactions || [];
  const breakdown = data?.breakdown || [];

  if (!apiOnline || loading) {
    return <Panel title="Financeiro" desc="Entradas, saídas, taxas, reembolsos e lucro líquido.">
      <EmptyState loading={loading} apiOnline={apiOnline} text="Nenhum dado financeiro encontrado." />
    </Panel>;
  }

  return <>
    <section className="pageActionsHero">
      <div>
        <span className="pill"><Wallet size={15}/> Financeiro conectado</span>
        <h2>Financeiro</h2>
        <p>Exportação simplificada em CSV com resumo e movimentações recentes.</p>
      </div>
      <button className="ghost" onClick={() => exportFinanceCsv(data)}><Download size={16}/> Exportar planilha</button>
    </section>
    <div className="mainGrid">
    <Panel title="Fluxo financeiro" desc="Saldo diário calculado pelo backend com dados do MySQL.">
      <LineChart data={cashflow}/>
    </Panel>

    <Panel title="Resumo financeiro" desc="Números principais vindos do banco de dados.">
      <div className="financeCards">
        <Mini label="Receita bruta" value={money(summary?.grossRevenue || 0)}/>
        <Mini label="Lucro líquido" value={money(summary?.netProfit || 0)}/>
        <Mini label="Pendente" value={money(summary?.pendingRevenue || 0)}/>
        <Mini label="Cancelado" value={money(summary?.cancelledRevenue || 0)}/>
        <Mini label="Despesas" value={money(summary?.expenses || 0)}/>
        <Mini label="Taxas" value={money(summary?.fees || 0)}/>
        <Mini label="Reembolsos" value={money(summary?.refunds || 0)}/>
        <Mini label="Ticket médio" value={money(summary?.averageTicket || 0)}/>
      </div>
    </Panel>

    <Panel title="Detalhamento" desc="Separação de entradas, despesas, taxas e reembolsos.">
      <div className="rankList">
        {breakdown.map((item) => <div className="rank" key={item.label}>
          <span>R$</span>
          <div><strong>{item.label}</strong><p>{money(item.value || 0)}</p></div>
          <Wallet size={17}/>
        </div>)}
      </div>
    </Panel>

    <Panel title="Movimentações recentes" desc="Últimos lançamentos da tabela finance_transactions.">
      {transactions.length ? <DataTable
        headers={["Tipo", "Título", "Valor", "Data"]}
        rows={transactions.map((item) => [
          item.type === "income" ? "Entrada" : item.type === "expense" ? "Despesa" : item.type === "fee" ? "Taxa" : "Reembolso",
          item.title,
          money(item.amount || 0),
          formatDate(item.createdAt)
        ])}
      /> : <EmptyState loading={loading} apiOnline={apiOnline} text="Nenhuma movimentação financeira registrada." />}
    </Panel>
    </div>
  </>;
}


function Embeds() {
  const { emptyEmbed, channels, history, apiOnline, loading, error, sendEmbed } = useEmbedsData();
  const [channelId, setChannelId] = useState("");
  const [content, setContent] = useState("");
  const [embed, setEmbed] = useState(emptyEmbed);
  const [sending, setSending] = useState(false);
  const selectedChannel = channels.find((channel) => channel.id === channelId);

  function updateEmbed(field, value) {
    setEmbed((current) => ({ ...current, [field]: value }));
  }

  function addField() {
    setEmbed((current) => ({ ...current, fields: [...(current.fields || []), { name: "", value: "", inline: false }] }));
  }

  function updateField(index, field, value) {
    setEmbed((current) => ({
      ...current,
      fields: current.fields.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item)
    }));
  }

  function removeField(index) {
    setEmbed((current) => ({ ...current, fields: current.fields.filter((_, itemIndex) => itemIndex !== index) }));
  }

  async function handleSend(event) {
    event.preventDefault();
    setSending(true);
    try {
      await sendEmbed({ channel_id: channelId, channel_name: selectedChannel?.name, content, embed });
      alert("Embed enviada com sucesso.");
    } catch (err) {
      alert(err.message || "Erro ao enviar embed.");
    } finally {
      setSending(false);
    }
  }

  return <div className="embedBuilderPage">
    <div className="pageTop">
      <div>
        <span className="pill"><FileText size={16}/> Message Builder</span>
        <h2>Criador de embeds</h2>
        <p className="muted">Monte mensagens igual builder de embed e envie direto no Discord usando o bot de vendas.</p>
      </div>
      <button className="ghost" onClick={()=>setEmbed(emptyEmbed)}><X size={16}/> Limpar embed</button>
    </div>

    <div className="embedBuilderGrid">
      <Panel title="Editor" desc="Configure o canal, mensagem normal e todos os dados da embed.">
        <form className="premiumForm" onSubmit={handleSend}>
          {!apiOnline && <div className="emptyState">{loading ? "Carregando canais do bot..." : (error || "Bot/backend offline.")}</div>}
          <div className="formRow">
            <label>Canal<select value={channelId} onChange={(e)=>setChannelId(e.target.value)} required>
              <option value="">Selecione um canal...</option>
              {channels.map((channel)=><option key={channel.id} value={channel.id}>#{channel.name}</option>)}
            </select></label>
            <label>Cor da embed<input type="color" value={embed.color || "#a70000"} onChange={(e)=>updateEmbed("color", e.target.value)} /></label>
          </div>
          <label>Mensagem fora da embed<textarea value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Texto opcional que aparece acima da embed." /></label>
          <div className="formRow">
            <label>Título<input value={embed.title} onChange={(e)=>updateEmbed("title", e.target.value)} placeholder="Título da embed" /></label>
            <label>URL do título<input value={embed.url} onChange={(e)=>updateEmbed("url", e.target.value)} placeholder="https://..." /></label>
          </div>
          <label>Descrição<textarea value={embed.description} onChange={(e)=>updateEmbed("description", e.target.value)} placeholder="Descrição principal da embed." /></label>
          <div className="formRow">
            <label>Autor<input value={embed.authorName} onChange={(e)=>updateEmbed("authorName", e.target.value)} placeholder="Nome do autor" /></label>
            <label>Ícone do autor<input value={embed.authorIcon} onChange={(e)=>updateEmbed("authorIcon", e.target.value)} placeholder="URL da imagem" /></label>
          </div>
          <div className="formRow">
            <label>Thumbnail<input value={embed.thumbnail} onChange={(e)=>updateEmbed("thumbnail", e.target.value)} placeholder="URL thumbnail" /></label>
            <label>Imagem grande<input value={embed.image} onChange={(e)=>updateEmbed("image", e.target.value)} placeholder="URL imagem" /></label>
          </div>
          <div className="formRow">
            <label>Rodapé<input value={embed.footerText} onChange={(e)=>updateEmbed("footerText", e.target.value)} placeholder="Texto do rodapé" /></label>
            <label>Ícone do rodapé<input value={embed.footerIcon} onChange={(e)=>updateEmbed("footerIcon", e.target.value)} placeholder="URL da imagem" /></label>
          </div>

          <div className="fieldEditor">
            <div className="rolesEditorHeader">
              <div><strong>Campos da embed</strong><p>Adicione linhas extras como preço, regras, entrega, etc.</p></div>
              <button type="button" className="ghost small" onClick={addField}><Plus size={15}/> Adicionar campo</button>
            </div>
            {(embed.fields || []).length === 0 && <div className="emptySmall">Nenhum campo adicional.</div>}
            {(embed.fields || []).map((field, index)=><div className="embedFieldRow" key={index}>
              <input value={field.name} onChange={(e)=>updateField(index, "name", e.target.value)} placeholder="Nome do campo" />
              <input value={field.value} onChange={(e)=>updateField(index, "value", e.target.value)} placeholder="Valor do campo" />
              <label className="checkLine"><input type="checkbox" checked={field.inline} onChange={(e)=>updateField(index, "inline", e.target.checked)} /> Inline</label>
              <button type="button" className="iconButton danger" onClick={()=>removeField(index)}><Trash2 size={15}/></button>
            </div>)}
          </div>
          <button className="primary" disabled={sending || !apiOnline}><Send size={16}/> {sending ? "Enviando..." : "Enviar embed"}</button>
        </form>
      </Panel>

      <div className="embedSide">
        <Panel title="Prévia Discord" desc="A prévia é visual. O envio real é feito pelo bot.">
          <DiscordEmbedPreview content={content} embed={embed} channel={selectedChannel} />
        </Panel>
        <Panel title="Últimas enviadas" desc="Histórico salvo no banco.">
          <div className="embedList">
            {history.length === 0 && <EmptyState loading={loading} apiOnline={apiOnline} text="Nenhuma embed enviada ainda." />}
            {history.map((item)=><div className="embedItem" key={item.id}>
              <div><strong>{item.embed?.title || "Embed sem título"}</strong><p>#{item.channel_name || item.channel_id} • {formatDate(item.created_at)}</p><small>Mensagem: {item.message_id || "-"}</small></div>
            </div>)}
          </div>
        </Panel>
      </div>
    </div>
  </div>;
}

function DiscordEmbedPreview({ content, embed, channel }) {
  const visibleFields = (embed.fields || []).filter((field) => field.name || field.value);
  return <div className="discordPreviewCard">
    <div className="discordChannel">#{channel?.name || "canal-selecionado"}</div>
    <div className="discordMessage">
      <div className="discordAvatar">DS</div>
      <div className="discordBody">
        <div className="discordAuthorLine"><strong>Discord Store</strong><span>BOT</span><small>agora</small></div>
        {content && <p className="discordContent">{content}</p>}
        <div className="discordEmbed" style={{ borderLeftColor: embed.color || "#a70000" }}>
          <div className="discordEmbedText">
            {embed.authorName && <div className="embedAuthor">{embed.authorIcon && <img src={embed.authorIcon}/>}<span>{embed.authorName}</span></div>}
            {embed.title && <h3>{embed.title}</h3>}
            {embed.description && <p>{embed.description}</p>}
            {visibleFields.length > 0 && <div className="previewFields">{visibleFields.map((field, index)=><div className={field.inline ? "previewField inline" : "previewField"} key={index}><strong>{field.name || "Campo"}</strong><span>{field.value || "Valor"}</span></div>)}</div>}
            {embed.image && <img className="previewImage" src={embed.image}/>} 
            {embed.footerText && <div className="previewFooter">{embed.footerIcon && <img src={embed.footerIcon}/>}<span>{embed.footerText}</span></div>}
          </div>
          {embed.thumbnail && <img className="previewThumb" src={embed.thumbnail}/>} 
        </div>
      </div>
    </div>
  </div>;
}


function RequestPanelConfig() {
  const rp = useRequestPanelManager();
  const { config, apiOnline, loading, error } = rp;
  const [settings, setSettings] = useState(config.settings || {});
  const [category, setCategory] = useState({ name:"", description:"", emoji:"📝", active:true });
  const [panel, setPanel] = useState({ channel_id:"", title:"", description:"", color:"#a70000" });

  useEffect(()=>{
    setSettings(config.settings || {});
    setPanel((p)=>({ ...p, title: config.settings?.panel_title || "", description: config.settings?.panel_description || "", color: config.settings?.panel_color || "#a70000" }));
  }, [config.settings]);

  async function handleSettings(e){ e.preventDefault(); try { await rp.saveSettings(settings); alert("Configurações salvas."); } catch(err){ alert(err.message); } }
  async function handleCategory(e){ e.preventDefault(); try { await rp.saveCategory(category); setCategory({ name:"", description:"", emoji:"📝", active:true }); } catch(err){ alert(err.message); } }
  async function handlePanel(e){ e.preventDefault(); try { await rp.sendPanel(panel); alert("Embed de pedidos enviada no Discord."); } catch(err){ alert(err.message); } }

  return <div className="ticketsPage">
    <div className="pageTop">
      <div><span className="pill"><FileText size={16}/> Embeds de Pedidos</span><h2>Configuração da Central de Pedidos</h2><p className="muted">Funciona igual o painel de ticket, mas sem criar canal. O usuário escolhe uma categoria, preenche o modal e a solicitação aparece na página Pedidos.</p></div>
      <button className="ghost" onClick={()=>rp.reload()}><Activity size={16}/> Atualizar</button>
    </div>
    {!apiOnline && <div className="emptyState">{loading ? "Carregando configuração..." : (error || "Backend/bot offline.")}</div>}
    <div className="mainGrid ticketsConfigGrid">
      <Panel title="Configuração geral" desc="Título, descrição e cor da embed que será enviada no Discord.">
        <form className="premiumForm" onSubmit={handleSettings}>
          <div className="formRow">
            <label>Título padrão<input value={settings.panel_title || ""} onChange={(e)=>setSettings({...settings, panel_title:e.target.value})}/></label>
            <label>Cor<input type="color" value={settings.panel_color || "#a70000"} onChange={(e)=>setSettings({...settings, panel_color:e.target.value})}/></label>
          </div>
          <label>Descrição padrão<textarea value={settings.panel_description || ""} onChange={(e)=>setSettings({...settings, panel_description:e.target.value})}/></label>
          <label>Canal público para aparecer todos os pedidos
            <select value={settings.public_channel_id || ""} onChange={(e)=>{ const ch=(config.channels||[]).find(c=>c.id===e.target.value); setSettings({...settings, public_channel_id:e.target.value, public_channel_name:ch?.name || ""}); }}>
              <option value="">Não publicar em canal público</option>
              {(config.channels||[]).map(c=><option key={c.id} value={c.id}>#{c.name}</option>)}
            </select>
          </label>
          <p className="muted">Quando alguém enviar um pedido/sugestão pelo Discord, ele também será postado nesse canal com botões de avaliação e status.</p>
          <button className="primary"><Save size={16}/> Salvar configuração</button>
        </form>
      </Panel>

      <Panel title="Enviar embed de pedidos" desc="Essa mensagem terá o menu de categorias para o usuário enviar pedido, sugestão, reembolso ou dúvida.">
        <form className="premiumForm" onSubmit={handlePanel}>
          <label>Canal onde a embed será enviada<select value={panel.channel_id} onChange={(e)=>setPanel({...panel, channel_id:e.target.value})} required><option value="">Selecione...</option>{(config.channels||[]).map(c=><option key={c.id} value={c.id}>#{c.name}</option>)}</select></label>
          <input value={panel.title} onChange={(e)=>setPanel({...panel, title:e.target.value})} placeholder="Título da embed" />
          <textarea value={panel.description} onChange={(e)=>setPanel({...panel, description:e.target.value})} placeholder="Descrição da embed" />
          <button className="primary"><Send size={16}/> Enviar painel de pedidos</button>
        </form>
      </Panel>

      <Panel title="Categorias de pedidos" desc="Essas categorias aparecem no menu da embed e também na página Pedidos.">
        <form className="premiumForm" onSubmit={handleCategory}>
          <div className="formRow"><label>Nome<input value={category.name} onChange={(e)=>setCategory({...category, name:e.target.value})} placeholder="Sugestão" required/></label><label>Emoji<input value={category.emoji} onChange={(e)=>setCategory({...category, emoji:e.target.value})}/></label></div>
          <input value={category.description} onChange={(e)=>setCategory({...category, description:e.target.value})} placeholder="Descrição curta" />
          <button className="primary"><Plus size={16}/> Adicionar categoria</button>
        </form>
        <div className="embedList">{(config.categories||[]).map(c=><div className="embedHistory" key={c.id}><div><strong>{c.emoji} {c.name}</strong><p>{c.description || "Sem descrição"}</p></div><button className="iconButton danger" onClick={()=>rp.deleteCategory(c.id)}><Trash2 size={15}/></button></div>)}</div>
      </Panel>
    </div>
  </div>;
}

function TicketConfig() {
  const tk = useTicketsManager();
  const { config, apiOnline, loading, error } = tk;
  const [settings, setSettings] = useState(config.settings || {});
  const [category, setCategory] = useState({ name: "", description: "", emoji: "🎫", discord_category_id: "", staff_role_id: "", active: true });
  const [panel, setPanel] = useState({ channel_id: "", title: "", description: "", color: "#a70000" });

  useEffect(()=>{ setSettings(config.settings || {}); setPanel((p)=>({ ...p, title: config.settings?.panel_title || "", description: config.settings?.panel_description || "", color: config.settings?.panel_color || "#a70000" })); }, [config.settings]);

  async function handleSettings(e){ e.preventDefault(); try { await tk.saveSettings(settings); alert("Configurações salvas."); } catch(err){ alert(err.message); } }
  async function handleCategory(e){ e.preventDefault(); try { await tk.saveCategory(category); setCategory({ name:"", description:"", emoji:"🎫", discord_category_id:"", staff_role_id:"", active:true }); } catch(err){ alert(err.message); } }
  async function handlePanel(e){ e.preventDefault(); try { await tk.sendPanel(panel); alert("Painel de ticket enviado no Discord."); } catch(err){ alert(err.message); } }

  return <div className="ticketsPage">
    <div className="pageTop">
      <div><span className="pill"><Settings size={16}/> Configuração de Tickets</span><h2>Configuração dos tickets</h2><p className="muted">Configure categorias, cargos staff, categoria Discord, logs e envie a embed do painel.</p></div>
      <button className="ghost" onClick={()=>tk.reload()}><Activity size={16}/> Atualizar</button>
    </div>
    {!apiOnline && <div className="emptyState">{loading ? "Carregando configuração..." : (error || "Backend/bot offline.")}</div>}
    <div className="mainGrid ticketsConfigGrid">
      <Panel title="Configuração geral" desc="Cargo staff padrão e aparência da embed de ticket.">
        <form className="premiumForm" onSubmit={handleSettings}>
          <div className="formRow">
            <label>Título padrão<input value={settings.panel_title || ""} onChange={(e)=>setSettings({...settings, panel_title:e.target.value})}/></label>
            <label>Cor<input type="color" value={settings.panel_color || "#a70000"} onChange={(e)=>setSettings({...settings, panel_color:e.target.value})}/></label>
          </div>
          <label>Descrição padrão<textarea value={settings.panel_description || ""} onChange={(e)=>setSettings({...settings, panel_description:e.target.value})}/></label>
          <div className="formRow">
            <label>Cargo staff padrão<select value={settings.staff_role_id || ""} onChange={(e)=>setSettings({...settings, staff_role_id:e.target.value})}><option value="">Sem cargo padrão</option>{(config.roles||[]).map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
            <label>Canal de logs<select value={settings.log_channel_id || ""} onChange={(e)=>setSettings({...settings, log_channel_id:e.target.value})}><option value="">Sem logs</option>{(config.channels||[]).map(c=><option key={c.id} value={c.id}>#{c.name}</option>)}</select></label>
          </div>
          <button className="primary"><Save size={16}/> Salvar configuração</button>
        </form>
      </Panel>

      <Panel title="Enviar embed de abertura" desc="Essa mensagem terá o menu de categorias para o usuário abrir o ticket.">
        <form className="premiumForm" onSubmit={handlePanel}>
          <label>Canal onde a embed será enviada<select value={panel.channel_id} onChange={(e)=>setPanel({...panel, channel_id:e.target.value})} required><option value="">Selecione...</option>{(config.channels||[]).map(c=><option key={c.id} value={c.id}>#{c.name}</option>)}</select></label>
          <input value={panel.title} onChange={(e)=>setPanel({...panel, title:e.target.value})} placeholder="Título da embed" />
          <textarea value={panel.description} onChange={(e)=>setPanel({...panel, description:e.target.value})} placeholder="Descrição da embed" />
          <button className="primary"><Send size={16}/> Enviar painel</button>
        </form>
      </Panel>

      <Panel title="Categorias de ticket" desc="Cada categoria pode criar o canal em uma categoria diferente do Discord e ter cargo staff próprio.">
        <form className="premiumForm" onSubmit={handleCategory}>
          <div className="formRow"><label>Nome<input value={category.name} onChange={(e)=>setCategory({...category, name:e.target.value})} placeholder="Suporte" required/></label><label>Emoji<input value={category.emoji} onChange={(e)=>setCategory({...category, emoji:e.target.value})}/></label></div>
          <input value={category.description} onChange={(e)=>setCategory({...category, description:e.target.value})} placeholder="Descrição curta" />
          <div className="formRow">
            <label>Categoria Discord<select value={category.discord_category_id} onChange={(e)=>setCategory({...category, discord_category_id:e.target.value})}><option value="">Sem categoria</option>{(config.discordCategories||[]).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <label>Cargo staff desta categoria<select value={category.staff_role_id} onChange={(e)=>setCategory({...category, staff_role_id:e.target.value})}><option value="">Usar padrão</option>{(config.roles||[]).map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
          </div>
          <button className="primary"><Plus size={16}/> Adicionar categoria</button>
        </form>
        <div className="embedList">{(config.categories||[]).map(c=><div className="embedHistory" key={c.id}><div><strong>{c.emoji} {c.name}</strong><p>{c.description || "Sem descrição"}</p></div><button className="iconButton danger" onClick={()=>tk.deleteCategory(c.id)}><Trash2 size={15}/></button></div>)}</div>
      </Panel>
    </div>
  </div>;
}

function Tickets() {
  const tk = useTicketsManager();
  const { tickets: ticketRows, selectedId, messages, apiOnline, loading, error } = tk;
  const [reply, setReply] = useState("");
  const [tab, setTab] = useState("abertos");
  const [chatMinimized, setChatMinimized] = useState(false);

  const filteredTickets = ticketRows.filter(t => tab === "todos" || (tab === "abertos" ? t.status !== "closed" : t.status === tab));
  const selected = ticketRows.find(t => t.id === selectedId) || filteredTickets[0];

  useEffect(() => {
    if (selected && selected.id !== selectedId) tk.loadMessages(selected.id).catch(()=>{});
  }, [selected?.id, selectedId]);

  useEffect(() => {
    const timer = setInterval(() => {
      tk.reload(true);
      if (selectedId) tk.refreshMessages(selectedId).catch(()=>{});
    }, 2500);
    return () => clearInterval(timer);
  }, [selectedId]);

  async function handleReply(){ if(!selected || !reply.trim()) return; try { await tk.replyTicket(selected.id, reply); setReply(""); await tk.refreshMessages(selected.id); } catch(err){ alert(err.message); } }
  async function handleClose(){ if(!selected) return; const reason = prompt("Motivo para fechar o ticket:") || "Fechado pelo painel"; try { await tk.closeTicket(selected.id, reason); } catch(err){ alert(err.message); } }

  return <div className="ticketsPage">
    <div className="pageTop">
      <div><span className="pill"><LifeBuoy size={16}/> Tickets Discord</span><h2>Tickets abertos e mensagens</h2><p className="muted">Acompanhe todos os tickets, acesse o chat e responda pelo painel sem precisar recarregar a página.</p></div>
      <button className="ghost" onClick={()=>tk.reload()}><Activity size={16}/> Atualizar</button>
    </div>

    {!apiOnline && <div className="emptyState">{loading ? "Carregando tickets..." : (error || "Backend/bot offline.")}</div>}

    <div className="mainGrid ticketsOnlyGrid">
      <Panel title="Tickets" desc="Separado por abertos, fechados e todos.">
        <div className="categoryPills"><button className={tab==='abertos'?'active':''} onClick={()=>setTab('abertos')}>Abertos</button><button className={tab==='closed'?'active':''} onClick={()=>setTab('closed')}>Fechados</button><button className={tab==='todos'?'active':''} onClick={()=>setTab('todos')}>Todos</button></div>
        <div className="requestCards">
          {filteredTickets.map(t=><button className={`requestCard ${selected?.id===t.id?'selected':''}`} key={t.id} onClick={()=>{ setChatMinimized(false); tk.loadMessages(t.id); }}><div className="requestCardTop"><span>#{t.id}</span><strong className={`requestStatus status-${t.status}`}>{t.status}</strong></div><h3>{t.subject}</h3><p>{t.description}</p><div className="requestMeta"><span><UserRound size={14}/>{t.username}</span><span><Tags size={14}/>{t.category_name}</span></div>{t.assigned_staff_name && <small className="muted">Assumido por {t.assigned_staff_name}</small>}</button>)}
          {!filteredTickets.length && <EmptyState loading={loading} apiOnline={apiOnline} text="Nenhum ticket encontrado." />}
        </div>
      </Panel>
    </div>

    {selected && chatMinimized ? (
      <button className="floatingTicketChat" onClick={()=>setChatMinimized(false)}>
        <MessageSquareText size={18}/>
        <span><strong>Ticket #{selected.id}</strong><small>{messages.length} mensagens • clique para abrir</small></span>
        <Maximize2 size={16}/>
      </button>
    ) : (
      <section className="panel ticketChatPanel">
        <div className="panelHeader">
          <div>
            <h3>{selected ? `Chat do ticket #${selected.id}` : "Mensagens"}</h3>
            <p>Mensagens do canal do Discord salvas em tempo real no banco.</p>
          </div>
          {selected && <button className="iconButton" onClick={()=>setChatMinimized(true)} title="Minimizar chat"><Minus size={18}/></button>}
        </div>
        {!selected ? <EmptyState loading={false} apiOnline={apiOnline} text="Selecione um ticket."/> : <>
          <div className="ticketChatInfo"><span>{selected.username}</span><span>{selected.category_name}</span><span className={`requestStatus status-${selected.status}`}>{selected.status}</span>{selected.assigned_staff_name && <span>Staff: {selected.assigned_staff_name}</span>}</div>
          <div className="ticketMessages">{messages.length === 0 ? <p className="muted">Nenhuma mensagem salva ainda.</p> : messages.map(m=><div className={`ticketMessage ${m.author_type}`} key={m.id}><strong>{m.author_name || m.author_type}</strong><p>{m.message}</p><small>{formatDate(m.created_at)}</small></div>)}</div>
          <div className="replyBlock"><textarea value={reply} onChange={(e)=>setReply(e.target.value)} placeholder="Responder no canal do ticket pelo bot..."/><div className="detailActions"><button className="ghost" onClick={handleClose}><XCircle size={16}/> Fechar pelo painel</button><button className="primary" onClick={handleReply}><Send size={16}/> Enviar resposta</button></div></div>
        </>}
      </section>
    )}
  </div>;
}

function Discord() {
  const discord = useDiscordData();
  const { data, apiOnline, loading, error } = discord;
  const roles = data?.roles || [];
  const members = data?.members || [];
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [roleForm, setRoleForm] = useState({ name: "", color: "#a70000", hoist: false, mentionable: false });
  const [memberRoleId, setMemberRoleId] = useState("");
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    if (selectedRole) setRoleForm({ name: selectedRole.name, color: selectedRole.colorHex || "#000000", hoist: selectedRole.hoist, mentionable: selectedRole.mentionable });
  }, [selectedRole]);

  useEffect(() => {
    if (selectedMember) {
      setNickname(selectedMember.nickname || "");
      setMemberRoleId("");
    }
  }, [selectedMember]);

  async function handleSaveRole(e) {
    e.preventDefault();
    try {
      if (selectedRole) await discord.updateRole(selectedRole.id, roleForm);
      else await discord.createRole(roleForm);
      setSelectedRole(null);
      setRoleForm({ name: "", color: "#a70000", hoist: false, mentionable: false });
    } catch (err) { alert(err.message); }
  }

  async function handleDeleteRole(role) {
    if (role.managed) return alert("Esse cargo é gerenciado pelo Discord/integração e não pode ser removido.");
    if (!confirm(`Remover o cargo ${role.name}?`)) return;
    try { await discord.deleteRole(role.id); } catch (err) { alert(err.message); }
  }

  async function handleAddMemberRole() {
    if (!selectedMember || !memberRoleId) return alert("Selecione um membro e um cargo.");
    try { await discord.addRole(selectedMember.id, memberRoleId); } catch (err) { alert(err.message); }
  }

  async function handleRemoveMemberRole(roleId) {
    if (!selectedMember) return;
    try { await discord.removeRole(selectedMember.id, roleId); } catch (err) { alert(err.message); }
  }

  async function handleNickname() {
    if (!selectedMember) return;
    try { await discord.updateMember(selectedMember.id, { nickname }); } catch (err) { alert(err.message); }
  }

  return <div className="mainGrid discordManage">
    <Panel title="Servidor Discord" desc={apiOnline ? "Dados reais puxados pela API do Discord." : "Configure DISCORD_BOT_TOKEN e DISCORD_GUILD_ID no backend/.env."}>
      {loading ? <EmptyState loading={true} apiOnline={apiOnline} text="Carregando Discord..." /> : apiOnline ? <div className="discordCard">
        {data.guild.icon ? <img className="guildIcon" src={data.guild.icon} /> : <Server size={38}/>}<h3>{data.guild.name}</h3>
        <p>Servidor conectado ao painel.</p>
        <div className="statsInline"><span>{data.guild.memberCount} membros</span><span>{data.guild.onlineCount} online</span><span>{data.summary.roles} cargos</span></div>
      </div> : <div className="empty"><AlertTriangle size={28}/><p>{error || "Backend Discord offline."}</p><button className="ghost small" onClick={discord.reload}>Tentar novamente</button></div>}
    </Panel>

    <Panel title="Gerenciar cargos" desc="Criar, editar e remover cargos do servidor.">
      <form className="settingsForm compactForm" onSubmit={handleSaveRole}>
        <label>Nome do cargo<input value={roleForm.name} onChange={(e)=>setRoleForm({...roleForm, name:e.target.value})} placeholder="VIP Ouro" /></label>
        <label>Cor<input type="color" value={roleForm.color} onChange={(e)=>setRoleForm({...roleForm, color:e.target.value})} /></label>
        <label className="checkLine"><input type="checkbox" checked={roleForm.hoist} onChange={(e)=>setRoleForm({...roleForm, hoist:e.target.checked})}/> Exibir separado</label>
        <label className="checkLine"><input type="checkbox" checked={roleForm.mentionable} onChange={(e)=>setRoleForm({...roleForm, mentionable:e.target.checked})}/> Mencionável</label>
        <button className="primary" disabled={!apiOnline}><Save size={16}/> {selectedRole ? "Salvar cargo" : "Criar cargo"}</button>
        {selectedRole && <button type="button" className="ghost" onClick={()=>{setSelectedRole(null);setRoleForm({ name:"", color:"#a70000", hoist:false, mentionable:false });}}>Cancelar edição</button>}
      </form>
      <div className="roleGrid">
        {roles.map(role => <div className="roleItem" key={role.id}>
          <span className="roleDot" style={{background: role.colorHex}}></span>
          <div><strong>{role.name}</strong><small>{role.id}{role.managed ? " • gerenciado" : ""}</small></div>
          <button className="iconButton" onClick={()=>setSelectedRole(role)}><Pencil size={15}/></button>
          <button className="iconButton danger" disabled={role.managed} onClick={()=>handleDeleteRole(role)}><Trash2 size={15}/></button>
        </div>)}
      </div>
    </Panel>

    <Panel title="Gerenciar membros" desc="Adicionar/remover cargos e alterar apelido.">
      <div className="discordMembers">
        <div className="memberList">
          {members.map(member => <button className={selectedMember?.id === member.id ? "memberRow active" : "memberRow"} key={member.id} onClick={()=>setSelectedMember(member)}>
            <span>{member.username?.slice(0,2).toUpperCase()}</span><div><strong>{member.username}</strong><small>{member.tag}</small></div>
          </button>)}
        </div>
        <div className="memberDetails">
          {selectedMember ? <>
            <h3>{selectedMember.username}</h3><p>{selectedMember.tag}</p>
            <label>Apelido<input value={nickname} onChange={(e)=>setNickname(e.target.value)} placeholder="Apelido no servidor" /></label>
            <button className="ghost small" onClick={handleNickname}>Salvar apelido</button>
            <label>Adicionar cargo<select value={memberRoleId} onChange={(e)=>setMemberRoleId(e.target.value)}><option value="">Selecione um cargo</option>{roles.filter(r=>!r.managed).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
            <button className="primary small" onClick={handleAddMemberRole}>Adicionar cargo</button>
            <div className="memberRoles">{selectedMember.roles.map(roleId => {
              const role = roles.find(r => r.id === roleId);
              if (!role) return null;
              return <span key={roleId} className="rolePill"><span className="roleDot" style={{background: role.colorHex}}></span>{role.name}<button onClick={()=>handleRemoveMemberRole(roleId)}>×</button></span>
            })}</div>
          </> : <EmptyState loading={loading} apiOnline={apiOnline} text="Selecione um membro para gerenciar." />}
        </div>
      </div>
    </Panel>
  </div>;
}

function Notificacoes() {
  const { notifications, summary, apiOnline, loading, reload, markAllRead } = useNotificationsData();

  async function handleReadAll() {
    try {
      await markAllRead();
    } catch (error) {
      alert("Não foi possível marcar as notificações como lidas.");
    }
  }

  return <div className="mainGrid">
    <Panel title="Notificações do site" desc={apiOnline ? "Alertas gerados pelo bot quando uma compra é aberta, aprovada ou reprovada." : "Backend offline. Inicie a API para carregar as notificações reais."}>
      <div className="toolbar productsToolbar">
        <button className="ghost small" onClick={reload}><Filter size={16}/> Atualizar</button>
        <button className="primary small" onClick={handleReadAll} disabled={!apiOnline || !summary?.unread}><CheckCircle2 size={16}/> Marcar lidas</button>
      </div>
      <div className="financeCards">
        <Mini label="Não lidas" value={summary?.unread || 0}/>
        <Mini label="Tickets de compra" value={summary?.checkoutTickets || 0}/>
        <Mini label="Total" value={summary?.total || 0}/>
      </div>
      <ActivityFeed items={notifications} loading={loading} apiOnline={apiOnline} />
    </Panel>
  </div>;
}

function Configuracoes() {
  const { data, apiOnline, loading, saveSettings, createEmbed, deleteEmbed, sendVerificationEmbed } = useBotSettingsData();
  const settings = data?.settings || {};
  const [form, setForm] = useState({});
  const [embedForm, setEmbedForm] = useState({ product_id: "", channel_id: "", title: "", description: "", button_label: "Comprar", active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.settings) setForm(data.settings);
  }, [data]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSettings(form);
      alert("Configurações do bot salvas.");
    } catch (error) {
      alert("Erro ao salvar configurações do bot.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateEmbed(e) {
    e.preventDefault();
    try {
      await createEmbed(embedForm);
      setEmbedForm({ product_id: "", channel_id: "", title: "", description: "", button_label: "Comprar", active: true });
    } catch (error) {
      alert("Erro ao criar embed. Confira produto e canal.");
    }
  }

  return <div className="mainGrid">
    <Panel title="Controle do bot" desc="Gerencie o bot em tempo real pelo painel. O bot lê essas informações no banco/API.">
      {!apiOnline && <EmptyState loading={loading} apiOnline={apiOnline} text="" />}
      {apiOnline && <form className="premiumForm" onSubmit={handleSave}>
        <div className="formRow">
          <label>Nome do bot<input value={form.bot_name || ""} onChange={(e)=>setForm({...form, bot_name:e.target.value})} placeholder="Store Bot" /></label>
          <label>Cor da embed<input value={form.embed_color || "#a70000"} onChange={(e)=>setForm({...form, embed_color:e.target.value})} placeholder="#a70000" /></label>
        </div>
        <div className="formRow">
          <label>ID do servidor<input value={form.guild_id || ""} onChange={(e)=>setForm({...form, guild_id:e.target.value})} placeholder="Guild ID" /></label>
          <label>Cargo staff no checkout<input value={form.staff_role_id || ""} onChange={(e)=>setForm({...form, staff_role_id:e.target.value})} placeholder="Role ID" /></label>
        </div>
        <div className="formRow">
          <label>Cargo que pode aprovar<input value={form.approve_role_id || ""} onChange={(e)=>setForm({...form, approve_role_id:e.target.value})} placeholder="Role ID que aprova pagamentos" /></label>
          <label>Canal de logs/pedidos<input value={form.orders_channel_id || ""} onChange={(e)=>setForm({...form, orders_channel_id:e.target.value})} placeholder="Channel ID" /></label>
        </div>
        <div className="formRow">
          <label>Canal de entrada de membros<input value={form.join_log_channel_id || ""} onChange={(e)=>setForm({...form, join_log_channel_id:e.target.value})} placeholder="Channel ID para boas-vindas" /></label>
          <label>Canal de saída de membros<input value={form.leave_log_channel_id || ""} onChange={(e)=>setForm({...form, leave_log_channel_id:e.target.value})} placeholder="Channel ID para saídas" /></label>
        </div>
        <div className="settingsSectionTitle"><strong>Verificação com Captcha</strong><small>Configure a embed, cargo e logs de verificação do servidor.</small></div>
        <div className="formRow">
          <label>Canal da embed de verificação<input value={form.verification_channel_id || ""} onChange={(e)=>setForm({...form, verification_channel_id:e.target.value})} placeholder="Channel ID onde vai a embed" /></label>
          <label>Cargo de verificado<input value={form.verification_role_id || ""} onChange={(e)=>setForm({...form, verification_role_id:e.target.value})} placeholder="Role ID que será setado" /></label>
        </div>
        <div className="formRow">
          <label>Canal logs de verificação<input value={form.verification_log_channel_id || ""} onChange={(e)=>setForm({...form, verification_log_channel_id:e.target.value})} placeholder="Channel ID de logs" /></label>
          <label>Título da verificação<input value={form.verification_title || ""} onChange={(e)=>setForm({...form, verification_title:e.target.value})} placeholder="Verificação" /></label>
        </div>
        <label>Descrição da verificação<textarea value={form.verification_description || ""} onChange={(e)=>setForm({...form, verification_description:e.target.value})} placeholder="Clique no botão abaixo para iniciar a verificação." /></label>
        <label>Mensagem de sucesso da verificação<input value={form.verification_success_message || ""} onChange={(e)=>setForm({...form, verification_success_message:e.target.value})} placeholder="Você foi verificado com sucesso!" /></label>
        <div className="formRow">
          <label>Categoria dos canais de compra<input value={form.checkout_category_id || ""} onChange={(e)=>setForm({...form, checkout_category_id:e.target.value})} placeholder="Category ID" /></label>
          <label>Forma de pagamento<input value="Pix" readOnly /></label>
        </div>
        <div className="formRow">
          <label>Chave Pix<input value={form.pix_key || ""} onChange={(e)=>setForm({...form, pix_key:e.target.value})} placeholder="email/celular/chave aleatória" /></label>
          <label>Nome Pix<input value={form.pix_name || ""} onChange={(e)=>setForm({...form, pix_name:e.target.value})} placeholder="Nome do recebedor" /></label>
        </div>
        <label>URL do QR Code Pix<input value={form.pix_qr_code_url || ""} onChange={(e)=>setForm({...form, pix_qr_code_url:e.target.value})} placeholder="https://link-da-imagem-do-qrcode.png" /></label>
        <label>Instruções de pagamento<textarea value={form.payment_instructions || ""} onChange={(e)=>setForm({...form, payment_instructions:e.target.value})} placeholder="Ex: faça o Pix, envie o comprovante e aguarde aprovação da equipe." /></label>
        <div className="settingsSectionTitle"><strong>AntiLink</strong><small>Bloqueie links ou convites e libere cargos específicos.</small></div>
        <div className="formRow">
          <label>AntiLink ativo<select value={form.antilink_enabled ? "1" : "0"} onChange={(e)=>setForm({...form, antilink_enabled:e.target.value === "1"})}><option value="0">Desativado</option><option value="1">Ativado</option></select></label>
          <label>Canal logs AntiLink<input value={form.antilink_log_channel_id || ""} onChange={(e)=>setForm({...form, antilink_log_channel_id:e.target.value})} placeholder="Channel ID de logs" /></label>
        </div>
        <label>Links proibidos / palavras bloqueadas<textarea value={form.antilink_blocked_links || ""} onChange={(e)=>setForm({...form, antilink_blocked_links:e.target.value})} placeholder="Um por linha. Ex: discord.gg, bit.ly, convite.com" /></label>
        <label>Cargos que podem enviar link<textarea value={form.antilink_allowed_roles || ""} onChange={(e)=>setForm({...form, antilink_allowed_roles:e.target.value})} placeholder="Role IDs separados por linha ou vírgula" /></label>
        <div className="toggleLine">
          <button type="button" className={form.bot_enabled ? "pill active" : "pill"} onClick={()=>setForm({...form, bot_enabled: !form.bot_enabled})}><Power size={16}/> Bot {form.bot_enabled ? "ativo" : "pausado"}</button>
          <button type="button" className={form.auto_sync ? "pill active" : "pill"} onClick={()=>setForm({...form, auto_sync: !form.auto_sync})}><Bot size={16}/> Auto sync {form.auto_sync ? "ligado" : "desligado"}</button>
          <button type="button" className="pill" onClick={async()=>{ try { await sendVerificationEmbed(); alert("Embed de verificação enviada."); } catch(err){ alert(err.message); } }}>Enviar embed verificação</button>
        </div>
        <button className="primary" disabled={saving}><Save size={16}/> {saving ? "Salvando..." : "Salvar configurações"}</button>
      </form>}
    </Panel>

    <Panel title="Embeds de produtos" desc="Cadastre qual produto o bot deve publicar em cada canal.">
      {apiOnline && <form className="premiumForm" onSubmit={handleCreateEmbed}>
        <div className="formRow">
          <label>Produto<select value={embedForm.product_id} onChange={(e)=>setEmbedForm({...embedForm, product_id:e.target.value})} required>
            <option value="">Selecione...</option>
            {(data?.products || []).map((p)=><option key={p.id} value={p.id}>{p.name} — {money(Number(p.price || 0))}</option>)}
          </select></label>
          <label>ID do canal<input value={embedForm.channel_id} onChange={(e)=>setEmbedForm({...embedForm, channel_id:e.target.value})} placeholder="Ex: 123456789" required /></label>
        </div>
        <label>Título da embed<input value={embedForm.title} onChange={(e)=>setEmbedForm({...embedForm, title:e.target.value})} placeholder="Ex: Comprar VIP Ouro" /></label>
        <label>Descrição<textarea value={embedForm.description} onChange={(e)=>setEmbedForm({...embedForm, description:e.target.value})} placeholder="Texto que vai aparecer na embed do Discord." /></label>
        <div className="formRow">
          <label>Texto do botão<input value={embedForm.button_label} onChange={(e)=>setEmbedForm({...embedForm, button_label:e.target.value})} placeholder="Comprar" /></label>
          <button className="primary"><Send size={16}/> Criar embed</button>
        </div>
      </form>}
      <div className="embedList">
        {(data?.embeds || []).map((embed)=><div className="embedItem" key={embed.id}>
          <div><strong>{embed.title || embed.product_name}</strong><p>{embed.product_name} • Canal {embed.channel_id} • {embed.active ? "Ativa" : "Pausada"}</p><small>Mensagem: {embed.message_id || "ainda não enviada pelo bot"}</small></div>
          <button className="dangerButton" onClick={()=>deleteEmbed(embed.id)}><Trash2 size={16}/> Remover</button>
        </div>)}
      </div>
    </Panel>
  </div>;
}

function Stat({ icon: Icon, title, value, change }) { return <article className="stat"><div className="statIcon"><Icon size={22}/></div><p>{title}</p><h3>{value}</h3><span>{change}</span></article>; }
function Panel({ title, desc, children }) { return <section className="panel"><div className="panelHeader"><div><h3>{title}</h3><p>{desc}</p></div></div>{children}</section>; }
function Mini({label,value}) { return <div className="mini"><span>{label}</span><strong>{value}</strong></div>; }

function LineChart({ data }) {
  const max = Math.max(1, ...data.map(d => Number(d.value || 0)));
  const points = data.map((d,i) => `${(i/(data.length-1))*100},${100-(d.value/max)*82-8}`).join(" ");
  return <div className="chartWrap"><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="lineChart"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgba(255,43,79,.42)"/><stop offset="100%" stopColor="rgba(255,43,79,0)"/></linearGradient></defs><polyline points={`0,100 ${points} 100,100`} fill="url(#fill)" stroke="none"/><polyline points={points} fill="none" stroke="#ff2b4f" strokeWidth="3" vectorEffect="non-scaling-stroke"/></svg><div className="chartLabels">{data.map(d=><span key={d.day}>{d.day}<b>{money(d.value)}</b></span>)}</div></div>;
}

function BarChart({ data }) { const max = Math.max(...data.map(d=>d.value)); return <div className="barChart">{data.map(d => <div className="barItem" key={d.month}><div><i style={{height:`${(d.value/max)*100}%`}} /></div><span>{d.month}</span><b>{money(d.value)}</b></div>)}</div>; }
function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function EmptyState({ loading, apiOnline, text }) {
  if (loading) return <div className="emptyState">Carregando dados do backend...</div>;
  if (!apiOnline) return <div className="emptyState">Backend offline. Inicie a API para carregar dados reais.</div>;
  return <div className="emptyState">{text}</div>;
}

function TopProducts({ items, loading, apiOnline }){
  if (!items?.length) return <EmptyState loading={loading} apiOnline={apiOnline} text="Nenhum produto vendido ainda." />;
  return <div className="rankList">{items.slice(0,5).map((p,i)=><div className="rank" key={p.name}><span>#{i+1}</span><div><strong>{p.name}</strong><p>{p.sales} vendas • {typeof p.revenue === "number" ? money(p.revenue) : money(Number(p.price || 0))}</p></div><ArrowUpRight size={17}/></div>)}</div>;
}
function ActivityFeed({ items, loading, apiOnline }){
  if (!items?.length) return <EmptyState loading={loading} apiOnline={apiOnline} text="Nenhuma atividade recente registrada." />;
  return <div className="feed">{items.map((a, index) => { const Icon = activityIcons[a.type] || Activity; return <div className="feedItem" key={`${a.title}-${index}`}><div className="feedIcon"><Icon size={18}/></div><div><strong>{a.title}</strong><p>{a.desc}</p></div><span>{a.time}</span></div>; })}</div>;
}
function CustomerRank({ items, loading, apiOnline }){
  if (!items?.length) return <EmptyState loading={loading} apiOnline={apiOnline} text="Nenhum comprador encontrado ainda." />;
  return <div className="rankList">{items.map((c,i)=><div className="rank" key={c.tag || c.name}><span>#{i+1}</span><div><strong>{c.name}</strong><p>{typeof c.spent === "number" ? money(c.spent) : c.spent} • {c.orders} pedidos</p></div><Crown size={17}/></div>)}</div>;
}
function Heatmap({ data = heat }){
  const max = Math.max(1, ...data.flat().map(Number));
  return <div className="heatmap">{data.flatMap((row,r)=>row.map((v,c)=><i key={`${r}-${c}`} style={{opacity:.22+(Number(v)/max)*.78}} title={`${v} compras`} />))}</div>;
}
function Donut({ data, apiOnline, loading }){
  if (!data?.length) return <EmptyState loading={loading} apiOnline={apiOnline} text="Nenhuma categoria com venda encontrada." />;
  const total = data.reduce((sum, item) => sum + Number(item.revenue || 0), 0) || 1;
  return <div className="donutBox"><div className="donut"></div><div className="legend">{data.slice(0,4).map((item) => <span key={item.category}><i/> {item.category} {Math.round((Number(item.revenue || 0) / total) * 100)}%</span>)}</div></div>;
}
function Kpis({ data, apiOnline, loading }){
  if (!data) return <EmptyState loading={loading} apiOnline={apiOnline} text="Nenhum indicador encontrado." />;
  return <div className="financeCards"><Mini label="Conversão" value={`${data.conversion}%`}/><Mini label="Retenção" value={`${data.retention}%`}/><Mini label="Cancelamento" value={`${data.refund}%`}/><Mini label="Ticket médio" value={money(data.averageTicket || 0)}/></div>;
}
function DataTable({headers,rows}) { return <div className="tableWrap"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}><span className={j===r.length-1 ? "statusBadge" : ""}>{c}</span></td>)}</tr>)}</tbody></table></div>; }

createRoot(document.getElementById("root")).render(<AuthGate />);
