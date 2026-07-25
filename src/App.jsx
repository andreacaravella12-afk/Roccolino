const prenotazioni = [
  { ora: '19:30', cliente: 'Rossi', persone: 4, tavolo: 'F1-T2' },
  { ora: '20:00', cliente: 'Bianchi', persone: 2, tavolo: 'Parete SX-2' },
  { ora: '20:30', cliente: 'Verdi', persone: 6, tavolo: 'F5-T2' }
];

const tavoli = [
  ['F1-T1', 2], ['F1-T2', 4], ['F1-T3', 2], ['F1-T4', 4], ['F1-T5', 6],
  ['F2-T1', 6], ['F2-T2 SX', 2], ['F2-T2 DX', 2],
  ['F3-T1', 3], ['F3-T2', 2], ['F3-T3', 4], ['F3-T4', 6]
];

function App() {
  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">RISTORANTE PIZZERIA</p>
          <h1>ROCCOLINO</h1>
          <p>Gestione interna prenotazioni, tavoli e targhe ZTL.</p>
        </div>
        <button className="primary">+ Nuova prenotazione</button>
      </header>

      <section className="stats">
        <article><strong>3</strong><span>Prenotazioni oggi</span></article>
        <article><strong>12</strong><span>Coperti prenotati</span></article>
        <article><strong>2</strong><span>Targhe ZTL</span></article>
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>Prenotazioni di oggi</h2>
          <button>Vedi tutte</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Ora</th><th>Cliente</th><th>Persone</th><th>Tavolo</th></tr></thead>
            <tbody>
              {prenotazioni.map((p) => (
                <tr key={`${p.ora}-${p.cliente}`}>
                  <td>{p.ora}</td><td>{p.cliente}</td><td>{p.persone}</td><td>{p.tavolo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>Mappa tavoli</h2>
          <span className="legend">Verde = libero</span>
        </div>
        <div className="tables-grid">
          {tavoli.map(([nome, posti]) => (
            <button className="table-card" key={nome}>
              <strong>{nome}</strong>
              <span>{posti} posti</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel ztl">
        <div>
          <h2>Accessi ZTL</h2>
          <p>Registra e controlla le targhe dei clienti.</p>
        </div>
        <button className="secondary">Gestisci targhe</button>
      </section>
    </main>
  );
}

export default App;
