export default function Step6Conclusion({ onRestart }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', animation: 'crt-flicker 0.15s infinite' }}>
      <h1 className="retro-h1" style={{ color: 'var(--crt-amber)', textShadow: '0 0 6px var(--crt-amber-glow)', marginBottom: '4px' }}>Conclusões</h1>
      <p className="retro-p" style={{ textAlign: 'center', color: '#aab', margin: '0 0 8px 0' }}>
        A cooperação é uma solução matemática ideal sob três pilares fundamentais:
      </p>

      <div className="crt-conclusion-grid">
        <div className="crt-conclusion-card">
          <div className="crt-conclusion-title">1. Repetição (Futuro)</div>
          <div className="crt-conclusion-desc">Relações continuadas no tempo inviabilizam a traição sistêmica.</div>
        </div>

        <div className="crt-conclusion-card amber">
          <div className="crt-conclusion-title">2. Soma Não-Zero</div>
          <div className="crt-conclusion-desc">A cooperação mútua gera mais valor conjunto do que a traição mútua.</div>
        </div>

        <div className="crt-conclusion-card blue">
          <div className="crt-conclusion-title">3. Perdão (Tolerância)</div>
          <div className="crt-conclusion-desc">Capacidade de tolerar erros (ruído) previne espirais destrutivas de vingança.</div>
        </div>
      </div>

      <div className="crt-alert" style={{ borderStyle: 'solid', borderColor: 'var(--crt-green)', fontSize: '0.78rem', textAlign: 'center', margin: '4px 0 8px 0', padding: '6px' }}>
        Consolidação e fórmulas detalhadas salvas na <strong>Prancheta (Esquerda)</strong>.
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          className="retro-btn btn-next"
          onClick={onRestart}
          style={{ padding: '6px 16px', fontSize: '0.8rem' }}
        >
          Reiniciar Simulação
        </button>
      </div>
    </div>
  );
}
