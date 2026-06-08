import { sound } from '../../utils/sound';
import { BOT_DOSSIERS } from '../../utils/dossiers';

export default function Step3Strategies({
  selectedBot,
  onBotChange,
  roundsPlayed,
  playerScore,
  botScore,
  history,
  onResetMatch
}) {
  const maxRounds = 5;
  const isFinished = roundsPlayed >= maxRounds;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', animation: 'crt-flicker 0.15s infinite' }}>
      <h1 className="retro-h1">Galeria de Estratégias</h1>
      
      {/* Seleção do Oponente */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '4px 0 10px 0', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Oponente:</span>
          <select 
            value={selectedBot}
            onChange={(e) => {
              sound.playClick();
              onBotChange(e.target.value);
            }}
            className="retro-select"
            disabled={roundsPlayed > 0 && !isFinished}
            style={{ padding: '4px 8px', fontSize: '0.8rem' }}
          >
            {Object.keys(BOT_DOSSIERS).map(key => (
              <option key={key} value={key}>{BOT_DOSSIERS[key].name}</option>
            ))}
          </select>
        </div>

        <button 
          className="retro-btn btn-action" 
          onClick={onResetMatch}
          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
        >
          Reiniciar
        </button>
      </div>

      {/* Placar em Tempo Real */}
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
      <div style={{ margin: '4px 0', textAlign: 'center' }}>
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
        <div className="crt-alert" style={{ borderStyle: 'dashed', borderColor: 'var(--crt-green-dim)', background: 'rgba(0, 255, 100, 0.02)', color: 'var(--crt-green)', fontSize: '0.8rem', textAlign: 'center', margin: '6px 0 0 0' }}>
          RODADA {roundsPlayed + 1} / {maxRounds} — Detalhes do perfil carregados no <strong>Dossiê (Esquerda)</strong>.
        </div>
      ) : (
        <div className="crt-alert" style={{ borderColor: 'var(--crt-amber)', background: 'rgba(255, 176, 0, 0.03)', color: 'var(--crt-amber)', fontSize: '0.8rem', textAlign: 'center', margin: '6px 0 0 0' }}>
          <strong>PARTIDA CONCLUÍDA!</strong> Analise a lógica de retaliação e tente outro oponente.
        </div>
      )}
    </div>
  );
}
