export function PageHeader({ eyebrow, title, description, action, onAction }) {
  return <div className="portal-head"><div><small>{eyebrow}</small><h1 className="display">{title}</h1><p>{description}</p></div>{action && <button className="portal-action" onClick={onAction}>＋ {action}</button>}</div>;
}

export function StatGrid({ items }) {
  return <div className="stats">{items.map(([label, value, detail]) => <div className="stat" key={label}><small>{label}</small><strong>{value}</strong>{detail && <em>{detail}</em>}</div>)}</div>;
}

export function DataPanel({ title, columns = [], rows = [], aside }) {
  return <section className="panel portal-panel"><div className="panel-title"><h2>{title}</h2><button aria-label="Mais opções">•••</button></div>
    {rows.length ? <div className="portal-table"><div className="portal-table-head">{columns.map(x => <span key={x}>{x}</span>)}</div>{rows.map((row, index) => <div className="portal-table-row" key={index}>{row.map((cell, cellIndex) => <span key={cellIndex} className={cellIndex === row.length - 1 ? 'table-status' : ''}>{cell}</span>)}</div>)}</div> : <EmptyState/>}
    {aside}
  </section>;
}

export function EmptyState({ title = 'Nada por aqui ainda', text = 'Novos registros aparecerão aqui.' }) {
  return <div className="empty-state"><b>◇</b><strong>{title}</strong><span>{text}</span></div>;
}

export function FormPanel({ title, fields, button = 'Salvar alterações' }) {
  return <section className="panel portal-form"><h2>{title}</h2><div className="portal-fields">{fields.map(([label, value, type = 'text']) => <label key={label}><span>{label}</span><input type={type} defaultValue={value}/></label>)}</div><button className="portal-action">{button}</button></section>;
}

export function PortalPage({ config }) {
  return <><PageHeader {...config.header}/>{config.stats && <StatGrid items={config.stats}/>}<div className={config.secondary ? 'panel-grid' : 'portal-single'}><DataPanel {...config.panel}/>{config.secondary && <DataPanel {...config.secondary}/>}</div></>;
}
