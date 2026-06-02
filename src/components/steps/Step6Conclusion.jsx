import React from 'react';

export default function Step6Conclusion({ onRestart }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', animation: 'crt-flicker 0.15s infinite' }}>
      <h1 className="retro-h1" style={{ color: 'var(--crt-amber)', textShadow: '0 0 6px var(--crt-amber-glow)' }}>Relatório Final</h1>
      
      <p className="retro-p">
        Parabéns! Você completou a simulação do Dilema do Prisioneiro.
      </p>

      <div className="crt-alert" style={{ borderStyle: 'solid', borderColor: 'var(--crt-green)', fontSize: '0.85rem' }}>
        <strong>SISTEMA CONCLUÍDO:</strong> As conclusões matemáticas, as equações de valor esperado e as regras para o florescimento da confiança foram consolidadas e estão disponíveis para leitura na <strong>Prancheta (Esquerda)</strong>.
      </div>

      <p className="retro-p" style={{ fontSize: '0.85rem', color: '#aab', marginTop: '10px' }}>
        A probabilidade e a teoria dos jogos nos mostram que a cooperação não é apenas uma escolha moral, mas uma solução matemática ideal sob relações duradouras e sistemas de perdão a erros de comunicação.
      </p>

      <div style={{ marginTop: '14px', textAlign: 'center' }}>
        <button 
          className="retro-btn btn-next"
          onClick={onRestart}
          style={{ padding: '8px 20px', fontSize: '0.9rem' }}
        >
          Reiniciar Investigação
        </button>
      </div>
    </div>
  );
}
