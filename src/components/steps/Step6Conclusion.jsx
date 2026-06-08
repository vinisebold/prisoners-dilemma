import { useState } from 'react';

export default function Step6Conclusion() {
  const [exited, setExited] = useState(false);

  if (exited) {
    return (
      <div className="step6-end" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', animation: 'crt-flicker 0.15s infinite', textAlign: 'center' }}>
        <h1 className="retro-h1" style={{ color: 'var(--crt-green)', textShadow: '0 0 10px var(--crt-green-glow)', marginBottom: '12px', fontSize: '2rem' }}>
          TESTE ENCERRADO
        </h1>

        <div style={{ width: '60%', height: '1px', background: 'linear-gradient(to right, transparent, var(--crt-green-dim), transparent)', margin: '8px 0' }} />

        <p className="retro-p" style={{ fontSize: '0.9rem', color: '#ccddcc', lineHeight: '1.6', maxWidth: '90%' }}>
          O Governo Federal agradece sua participação no Programa de Ressocialização.
        </p>

        <p className="retro-p" style={{ fontSize: '0.85rem', color: '#aabbcc', lineHeight: '1.5', maxWidth: '90%' }}>
          Suas decisões ao longo deste simulado contribuíram para o desenvolvimento de novas teorias sobre confiança, silêncio mútuo e tomada de decisão em ambientes de pressão.
        </p>

        <p className="retro-p" style={{ fontSize: '0.85rem', color: 'var(--crt-amber)', textShadow: '0 0 4px var(--crt-amber-glow)', lineHeight: '1.5', maxWidth: '90%' }}>
          Você cooperou até o fim. Obrigado por jogar.
        </p>

        <div style={{ width: '60%', height: '1px', background: 'linear-gradient(to right, transparent, var(--crt-green-dim), transparent)', margin: '12px 0' }} />

        <div style={{ fontSize: '0.65rem', color: '#666', letterSpacing: '2px' }}>
          <span style={{ display: 'inline-block', animation: 'sec-blink 1s infinite', color: 'var(--crt-green)', marginRight: '4px' }}>_</span>
          TRANSMISSÃO FINALIZADA
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', animation: 'crt-flicker 0.15s infinite' }}>
      <h1 className="retro-h1" style={{ color: 'var(--crt-amber)', textShadow: '0 0 6px var(--crt-amber-glow)', marginBottom: '4px' }}>Conclusões</h1>
      <p className="retro-p" style={{ textAlign: 'center', color: '#aab', margin: '0 0 8px 0' }}>
        O silêncio mútuo é uma solução matemática ideal sob três pilares fundamentais:
      </p>

      <div className="crt-conclusion-grid">
        <div className="crt-conclusion-card">
          <div className="crt-conclusion-title">1. Repetição (Futuro)</div>
          <div className="crt-conclusion-desc">Relações continuadas no tempo reduzem a vantagem de confessar sistematicamente.</div>
        </div>

        <div className="crt-conclusion-card amber">
          <div className="crt-conclusion-title">2. Soma Não-Zero</div>
          <div className="crt-conclusion-desc">O silêncio mútuo gera mais valor conjunto do que a confissão mútua.</div>
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
          onClick={() => setExited(true)}
          style={{ padding: '6px 18px', fontSize: '0.8rem' }}
        >
          Sair do Teste
        </button>
      </div>
    </div>
  );
}
