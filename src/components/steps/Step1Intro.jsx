import React from 'react';

export default function Step1Intro({ playState, playerChoice, botChoice, onPlay }) {
  
  // Matriz de Payoffs clássica (anos de prisão: menor é melhor)
  // [Jogador, Oponente]
  const payoffs = {
    CC: [1, 1], // Cooperar, Cooperar
    CD: [5, 0], // Cooperar, Delatar (Jogador leva a pior)
    DC: [0, 5], // Delatar, Cooperar (Jogador sai livre)
    DD: [3, 3]  // Delatar, Delatar
  };

  const getHighlightClass = (cellType) => {
    if (playState !== 'played') return '';
    const key = (playerChoice === 'cooperate' ? 'C' : 'D') + (botChoice === 'cooperate' ? 'C' : 'D');
    return key === cellType ? 'payoff-cell highlight' : 'payoff-cell';
  };

  return (
    <div className="intro-grid" style={{ animation: 'crt-flicker 0.15s infinite' }}>
      <div className="intro-text-column">
        <h1 className="retro-h1">O Dilema Básico</h1>
        <p className="retro-p">
          Você e seu comparsa foram presos. O Investigador colocou vocês em salas separadas e fez a mesma proposta:
        </p>
        <p className="retro-p" style={{ color: 'var(--crt-amber)' }}>
          "Você pode se manter em <strong>Silêncio (Cooperar)</strong> ou <strong>Trair (Delatar)</strong> seu parceiro. Suas penas dependem do que ambos decidirem."
        </p>
        
        {playState === 'waiting' ? (
          <div className="crt-alert" style={{ borderStyle: 'dashed' }}>
            <strong>[SISTEMA ATIVO]</strong> Use os botões <strong>COOPERAR</strong> ou <strong>DELATAR</strong> no painel físico abaixo para fazer sua escolha piloto.
          </div>
        ) : (
          <div style={{ marginTop: '16px' }}>
            <h2 className="retro-h2" style={{ color: playerChoice === 'cooperate' ? 'var(--crt-green)' : 'var(--crt-red)' }}>
              SUA DECISÃO: {playerChoice === 'cooperate' ? 'COOPERAR' : 'DELATAR'}
            </h2>
            <h2 className="retro-h2" style={{ color: 'var(--crt-red)' }}>
              DECISÃO DO BOT: DELATAR
            </h2>
            
            <div className="crt-alert" style={{ borderColor: 'var(--crt-red)', background: 'rgba(255, 51, 51, 0.05)', color: 'var(--crt-red)' }}>
              <strong>RESULTADO:</strong> {playerChoice === 'cooperate' ? 'Você cooperou e foi traído! Recebeu 5 ANOS de prisão. O bot saiu livre (0 anos).' : 'Ambos delataram! Receberam 3 ANOS de prisão cada.'}
            </div>

            <p className="retro-p" style={{ fontSize: '0.9rem', color: '#8b8' }}>
              <strong>Nota Matemática:</strong> Não importa o que o outro faça, <em>Delatar</em> sempre resulta em menos anos de prisão para você individualmente (0 &lt; 1 e 3 &lt; 5). Em teoria dos jogos, Delatar é a <strong>estratégia dominante</strong>. Quando ambos escolhem isso, alcançam o <strong>Equilíbrio de Nash</strong>.
            </p>
            <p className="retro-p" style={{ fontSize: '0.9rem', color: 'var(--crt-amber)' }}>
              Pressione o botão <strong>AVANÇAR</strong> no painel para ver o que muda quando o jogo é repetido.
            </p>
          </div>
        )}
      </div>

      <div className="intro-matrix-column">
        <div style={{ fontSize: '0.8rem', color: '#6a6', marginBottom: '4px', textTransform: 'uppercase' }}>Matriz de Penas (Anos)</div>
        <div className="payoff-grid">
          {/* Cabeçalho */}
          <div className="payoff-cell header">BOT →<br/>VOCÊ ↓</div>
          <div className="payoff-cell header">Cooperar<br/>(Silêncio)</div>
          <div className="payoff-cell header">Delatar<br/>(Trair)</div>

          {/* Cooperar */}
          <div className="payoff-cell header">Cooperar</div>
          <div className={getHighlightClass('CC') || 'payoff-cell'}>
            <strong>Ambos cooperam</strong>
            <span style={{ fontSize: '1.2rem', color: 'var(--crt-green)' }}>1 / 1</span>
            <span>ano de prisão</span>
          </div>
          <div className={getHighlightClass('CD') || 'payoff-cell'}>
            <strong>Você cooperou, Bot delatou</strong>
            <span style={{ fontSize: '1.2rem', color: 'var(--crt-red)' }}>5 / 0</span>
            <span>anos</span>
          </div>

          {/* Delatar */}
          <div className="payoff-cell header">Delatar</div>
          <div className={getHighlightClass('DC') || 'payoff-cell'}>
            <strong>Você delatou, Bot cooperou</strong>
            <span style={{ fontSize: '1.2rem', color: 'var(--crt-green)' }}>0 / 5</span>
            <span>anos</span>
          </div>
          <div className={getHighlightClass('DD') || 'payoff-cell'}>
            <strong>Ambos delatam</strong>
            <span style={{ fontSize: '1.2rem', color: 'var(--crt-red)' }}>3 / 3</span>
            <span>anos</span>
          </div>
        </div>
        <div style={{ fontSize: '0.65rem', color: '#686', marginTop: '6px', textAlign: 'center' }}>
          *Valores representam: [Seu tempo / Tempo do Bot]<br/>
          Meta: Minimizar os anos de prisão!
        </div>
      </div>
    </div>
  );
}
