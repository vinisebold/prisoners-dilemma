export default function Step2Repeated({ roundsPlayed, playerScore, botScore, history }) {
  const maxRounds = 5;
  const isFinished = roundsPlayed >= maxRounds;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', animation: 'crt-flicker 0.15s infinite' }}>
      <h1 className="retro-h1">Dilema Iterado</h1>
      <p className="retro-p" style={{ textAlign: 'center', color: '#aab', margin: '2px 0 8px 0' }}>
        As decisões se acumulam por <strong>5 rodadas</strong> contra um oponente oculto.
      </p>

      {/* Placar em Tempo Real no CRT */}
      <div className="crt-score-board">
        <div className="crt-score-pill">
          <div className="crt-score-name">Sua Pena (Anos)</div>
          <div className="crt-score-val">{playerScore}</div>
        </div>
        <div className="crt-score-pill">
          <div className="crt-score-name">Pena do Oponente</div>
          <div className="crt-score-val amber">{botScore}</div>
        </div>
      </div>

      {/* Histórico Visual de Rodadas */}
      <div style={{ margin: '6px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', marginBottom: '4px' }}>Histórico das Jogadas</div>
        <div className="crt-round-dots">
          {Array.from({ length: maxRounds }).map((_, idx) => {
            const round = history[idx];
            if (!round) {
              return <div key={idx} className="crt-dot" style={{ borderColor: '#333', color: '#444' }}>{idx + 1}</div>;
            }
            const isPlayerCooperate = round.playerChoice === 'cooperate';
            const isBotCooperate = round.botChoice === 'cooperate';
            return (
              <div 
                key={idx} 
                className={`crt-dot ${isPlayerCooperate ? 'cooperate' : 'defect'}`}
                title={`Você: ${isPlayerCooperate ? 'C' : 'D'} | Bot: ${isBotCooperate ? 'C' : 'D'}`}
              >
                {isPlayerCooperate ? 'C' : 'D'}
                <span 
                  style={{
                    position: 'absolute',
                    bottom: '-12px',
                    fontSize: '8px',
                    color: isBotCooperate ? 'var(--crt-green)' : 'var(--crt-red)'
                  }}
                >
                  {isBotCooperate ? 'C' : 'D'}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: '0.6rem', color: '#666', marginTop: '12px' }}>
          Legenda: S = Silêncio, C = Confessar (Superior: Você | Inferior: Oponente)
        </div>
      </div>

      {!isFinished ? (
        <div className="crt-alert" style={{ borderStyle: 'dashed', textAlign: 'center', margin: '8px 0 0 0' }}>
          RODADA {roundsPlayed + 1} / {maxRounds} — Insira sua decisão no painel físico!
        </div>
      ) : (
        <div style={{ marginTop: '4px' }}>
          <div className="crt-alert" style={{ borderColor: 'var(--crt-amber)', background: 'rgba(255, 176, 0, 0.03)', color: 'var(--crt-amber)', margin: '4px 0', textAlign: 'center' }}>
            <strong>OPONENTE: COPYCAT (OLHO POR OLHO)</strong>
          </div>
          <p className="retro-p" style={{ fontSize: '0.78rem', color: '#9a9', textAlign: 'center', margin: '0' }}>
            Ele copiou exatamente seu depoimento anterior. Cooperação sustentada por ameaça de retaliação.
          </p>
        </div>
      )}
    </div>
  );
}
