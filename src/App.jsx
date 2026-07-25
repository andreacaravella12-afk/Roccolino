import { useMemo, useState } from 'react';

const TAVOLI = [
  ['F1-T1', 2], ['F1-T2', 4], ['F1-T3', 2], ['F1-T4', 4], ['F1-T5', 6],
  ['F2-T1', 6], ['F2-T2 SX', 2], ['F2-T2 DX', 2],
  ['F3-T1', 3], ['F3-T2', 2], ['F3-T3', 4], ['F3-T4', 6],
  ['F4-T1', 6], ['F4-T2', 6], ['F4-T3', 2], ['F4-T4', 9],
  ['F5-T1', 2], ['F5-T2', 6], ['F5-T3', 6],
  ['PARETE SX-1', 3], ['PARETE SX-2', 2], ['PARETE SX-3', 2], ['PARETE SX-4', 4], ['PARETE SX-5', 2],
  ['PARETE DX-1', 5], ['PARETE DX-2', 2]
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readPrenotazioni() {
  const salvate = readStorage('roccolino-prenotazioni', []);
  const pulite = salvate.filter((p) => !(
    (p.id === 1 && p.cliente === 'Rossi') ||
    (p.id === 2 && p.cliente === 'Bianchi')
  ));

  if (pulite.length !== salvate.length) {
    localStorage.setItem('roccolino-prenotazioni', JSON.stringify(pulite));
  }

  return pulite;
}

function App() {
  const [prenotazioni, setPrenotazioni] = useState(readPrenotazioni);
  const [targhe, setTarghe] = useState(() => readStorage('roccolino-targhe', []));
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ data: new Date().toISOString().slice(0, 10), ora: '19:30', cliente: '', telefono: '', persone: 2, tavolo: '', note: '' });
  const [targaForm, setTargaForm] = useState({ targa: '', cliente: '', data: new Date().toISOString().slice(0, 10) });

  const oggi = new Date().toISOString().slice(0, 10);
  const prenotazioniOggi = prenotazioni.filter((p) => p.data === oggi).sort((a, b) => a.ora.localeCompare(b.ora));
  const occupati = new Set(prenotazioniOggi.map((p) => p.tavolo));
  const coperti = prenotazioniOggi.reduce((totale, p) => totale + Number(p.persone), 0);

  const tavoliDisponibili = useMemo(
    () => TAVOLI.filter(([nome, posti]) => !occupati.has(nome) && posti >= Number(form.persone)),
    [form.persone, prenotazioniOggi.length]
  );

  function salvaPrenotazioni(next) {
    setPrenotazioni(next);
    localStorage.setItem('roccolino-prenotazioni', JSON.stringify(next));
  }

  function salvaTarghe(next) {
    setTarghe(next);
    localStorage.setItem('roccolino-targhe', JSON.stringify(next));
  }

  function apriPrenotazione(tavolo = '') {
    setForm({ data: oggi, ora: '19:30', cliente: '', telefono: '', persone: 2, tavolo, note: '' });
    setModal('prenotazione');
  }

  function aggiungiPrenotazione(event) {
    event.preventDefault();
    if (!form.cliente.trim() || !form.tavolo) return;
    salvaPrenotazioni([...prenotazioni, { ...form, id: Date.now(), persone: Number(form.persone) }]);
    setModal(null);
  }

  function eliminaPrenotazione(id) {
    salvaPrenotazioni(prenotazioni.filter((p) => p.id !== id));
  }

  function aggiungiTarga(event) {
    event.preventDefault();
    if (!targaForm.targa.trim()) return;
    salvaTarghe([...targhe, { ...targaForm, id: Date.now(), targa: targaForm.targa.toUpperCase().replace(/\s/g, '') }]);
    setTargaForm({ targa: '', cliente: '', data: oggi });
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">RISTORANTE PIZZERIA</p>
          <h1>ROCCOLINO</h1>
          <p>Gestione interna prenotazioni, tavoli e targhe ZTL.</p>
        </div>
        <button className="primary" onClick={() => apriPrenotazione()}>+ Nuova prenotazione</button>
      </header>

      <section className="stats">
        <article><strong>{prenotazioniOggi.length}</strong><span>Prenotazioni oggi</span></article>
        <article><strong>{coperti}</strong><span>Coperti prenotati</span></article>
        <article><strong>{targhe.filter((t) => t.data === oggi).length}</strong><span>Targhe ZTL oggi</span></article>
      </section>

      <section className="panel">
        <div className="panel-title"><h2>Prenotazioni di oggi</h2><span>{new Date().toLocaleDateString('it-IT')}</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Ora</th><th>Cliente</th><th>Persone</th><th>Tavolo</th><th></th></tr></thead>
            <tbody>
              {prenotazioniOggi.length === 0 && <tr><td colSpan="5">Nessuna prenotazione inserita.</td></tr>}
              {prenotazioniOggi.map((p) => (
                <tr key={p.id}>
                  <td>{p.ora}</td><td><strong>{p.cliente}</strong><small>{p.telefono}</small></td><td>{p.persone}</td><td>{p.tavolo}</td>
                  <td><button className="danger-link" onClick={() => eliminaPrenotazione(p.id)}>Elimina</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-title"><h2>Mappa tavoli</h2><span className="legend">Verde libero · Rosso occupato</span></div>
        <div className="tables-grid">
          {TAVOLI.map(([nome, posti]) => {
            const occupato = occupati.has(nome);
            return <button className={`table-card ${occupato ? 'occupied' : ''}`} key={nome} onClick={() => !occupato && apriPrenotazione(nome)} disabled={occupato}>
              <strong>{nome}</strong><span>{posti} posti</span><em>{occupato ? 'Occupato' : 'Prenota'}</em>
            </button>;
          })}
        </div>
      </section>

      <section className="panel">
        <div className="panel-title"><div><h2>Accessi ZTL</h2><p>Registra le targhe dei clienti.</p></div><button className="secondary" onClick={() => setModal('ztl')}>Gestisci targhe</button></div>
        {targhe.filter((t) => t.data === oggi).map((t) => <div className="plate-row" key={t.id}><strong>{t.targa}</strong><span>{t.cliente || 'Cliente non indicato'}</span><button onClick={() => salvaTarghe(targhe.filter((x) => x.id !== t.id))}>Rimuovi</button></div>)}
      </section>

      {modal === 'prenotazione' && <div className="modal-backdrop" onMouseDown={() => setModal(null)}>
        <form className="modal" onSubmit={aggiungiPrenotazione} onMouseDown={(e) => e.stopPropagation()}>
          <div className="panel-title"><h2>Nuova prenotazione</h2><button type="button" onClick={() => setModal(null)}>✕</button></div>
          <div className="form-grid">
            <label>Data<input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} required /></label>
            <label>Ora<input type="time" value={form.ora} onChange={(e) => setForm({ ...form, ora: e.target.value })} required /></label>
            <label>Cliente<input value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} placeholder="Nome e cognome" required /></label>
            <label>Telefono<input type="tel" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="Numero di telefono" /></label>
            <label>Persone<input type="number" min="1" max="20" value={form.persone} onChange={(e) => setForm({ ...form, persone: e.target.value, tavolo: '' })} required /></label>
            <label>Tavolo<select value={form.tavolo} onChange={(e) => setForm({ ...form, tavolo: e.target.value })} required><option value="">Seleziona</option>{tavoliDisponibili.map(([nome, posti]) => <option key={nome} value={nome}>{nome} · {posti} posti</option>)}</select></label>
            <label className="full">Note<textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Seggiolone, allergie, compleanno..." /></label>
          </div>
          <button className="secondary submit" type="submit">Salva prenotazione</button>
        </form>
      </div>}

      {modal === 'ztl' && <div className="modal-backdrop" onMouseDown={() => setModal(null)}>
        <form className="modal" onSubmit={aggiungiTarga} onMouseDown={(e) => e.stopPropagation()}>
          <div className="panel-title"><h2>Nuova targa ZTL</h2><button type="button" onClick={() => setModal(null)}>✕</button></div>
          <div className="form-grid">
            <label>Targa<input value={targaForm.targa} onChange={(e) => setTargaForm({ ...targaForm, targa: e.target.value })} placeholder="AB123CD" required /></label>
            <label>Cliente<input value={targaForm.cliente} onChange={(e) => setTargaForm({ ...targaForm, cliente: e.target.value })} /></label>
            <label>Data<input type="date" value={targaForm.data} onChange={(e) => setTargaForm({ ...targaForm, data: e.target.value })} required /></label>
          </div>
          <button className="secondary submit" type="submit">Registra targa</button>
        </form>
      </div>}
    </main>
  );
}

export default App;
