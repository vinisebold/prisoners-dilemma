import React from 'react';

export default function Step6Conclusion({ onRestart }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, animation: 'crt-flicker 0.15s infinite' }}>
      <h1 className="retro-h1" style={{ color: 'var(--crt-amber)', textShadow: '0 0 6px var(--crt-amber-glow)' }}>Conclusão Científica</h1>
      <p className="retro-p">
        Este simulador ilustra como a **matemática** e a **probabilidade** ditam o comportamento social e a evolução da cooperação.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', flex: 1, marginTop: '8px' }}>
        {/* Bloco 1: Teoria dos Jogos & Dominância */}
        <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--crt-green-dim)', padding: '12px', borderRadius: '6px' }}>
          <h2 className="retro-h2" style={{ fontSize: '1.1rem', marginBottom: '6px' }}>1. Esperança Matemática</h2>
          <p className="retro-p" style={{ fontSize: '0.8rem', color: '#aab', lineHeight: '1.3' }}>
            Em uma única rodada, o ato de <strong>Delatar</strong> domina racionalmente. No entanto, no dilema iterado, se a probabilidade de um novo encontro (fator de desconto $\delta$) for suficientemente alta:
          </p>
          <div style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.85rem', 
            color: 'var(--crt-amber)', 
            background: '#111', 
            padding: '6px', 
            borderRadius: '4px',
            textAlign: 'center',
            margin: '6px 0'
          }}>
            V(Cooperação Mútua) &gt; V(Traição)
          </div>
          <p className="retro-p" style={{ fontSize: '0.8rem', color: '#aab', lineHeight: '1.3', margin: 0 }}>
            A cooperação torna-se matematicamente estável porque os custos das punições futuras superam o ganho imediato da traição.
          </p>
        </div>

        {/* Bloco 2: Ruído e Cadeia de Markov */}
        <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--crt-green-dim)', padding: '12px', borderRadius: '6px' }}>
          <h2 className="retro-h2" style={{ fontSize: '1.1rem', marginBottom: '6px' }}>2. O Fator de Ruído (Erro)</h2>
          <p className="retro-p" style={{ fontSize: '0.8rem', color: '#aab', lineHeight: '1.3' }}>
            A introdução de uma probabilidade $p$ de erro (ruído) transforma o jogo em um processo probabilístico dinâmico (Cadeia de Markov).
          </p>
          <p className="retro-p" style={{ fontSize: '0.8rem', color: '#aab', lineHeight: '1.3', margin: 0 }}>
            Sob ruído, a estratégia <em>Copycat</em> entra em ciclos destrutivos de retaliação. A probabilidade exige **algoritmos com tolerância ao erro** (como <em>Copykitten</em>), que mantêm a estabilidade perdoando desvios únicos aleatórios.
          </p>
        </div>

        {/* Bloco 3: Chaves da Cooperação */}
        <div style={{ 
          background: 'rgba(17,119,17,0.05)', 
          border: '1px solid var(--crt-green)', 
          padding: '12px', 
          borderRadius: '6px',
          gridColumn: '1 / -1'
        }}>
          <h2 className="retro-h2" style={{ fontSize: '1.2rem', color: 'var(--crt-green)', marginBottom: '4px' }}>Requisitos Matemáticos para a Confiança</h2>
          <ul style={{ fontSize: '0.8rem', color: '#fff', marginLeft: '20px', lineHeight: '1.4' }}>
            <li>
              <strong>Sombra do Futuro:</strong> Relacionamentos repetidos e frequentes (sem número fixo de rodadas conhecido, para evitar traições retroativas).
            </li>
            <li>
              <strong>Soma Não-Zero:</strong> A cooperação mútua deve gerar mais benefício do que a traição mútua.
            </li>
            <li>
              <strong>Comunicação e Tolerância:</strong> Em ambientes com ruído probabilístico elevado, estratégias tolerantes ao erro são essenciais para evitar a extinção da cooperação.
            </li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <button 
          className="retro-btn btn-next"
          onClick={onRestart}
          style={{ padding: '10px 24px', fontSize: '0.95rem' }}
        >
          Reiniciar do Começo
        </button>
      </div>
    </div>
  );
}
