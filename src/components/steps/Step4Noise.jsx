import React from 'react';
import { sound } from '../../utils/sound';

export default function Step4Noise({
  selectedBot,
  onBotChange,
  noiseProb,
  roundsPlayed,
  history,
  onResetMatch
}) {
  const maxRounds = 7;
  const isFinished = roundsPlayed >= maxRounds;

  // Verifica se a última rodada teve ruído
  const lastRound = history.length > 0 ? history[history.length - 1] : null;
  const hadNoise = lastRound ? (lastRound.playerFlipped || lastRound.botFlipped) : false;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', animation: 'crt-flicker 0.15s infinite' }}>
      <h1 className="retro-h1">Probabilidade & Ruído</h1>
      <p className="retro-p">
        Testaremos como a cooperação se comporta sob falhas de comunicação acidentais (ruído).
      </p>

      {/* Controles Básicos */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '10px 0', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
          <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Oponente:</label>
          <select 
            value={selectedBot}
            onChange={(e) => {
              sound.playClick();
              onBotChange(e.target.value);
            }}
            className="retro-select"
            disabled={roundsPlayed > 0 && !isFinished}
          >
            <option value="copycat">Copycat (Vingativo)</option>
            <option value="copykitten">Copykitten (Tolerante)</option>
          </select>
        </div>

        <button 
          className="retro-btn btn-action" 
          onClick={onResetMatch}
          style={{ padding: '8px 14px', fontSize: '0.8rem', marginTop: '16px' }}
        >
          Reiniciar Partida
        </button>
      </div>

      {/* Alerta de Transmissão com Ruído */}
      {hadNoise ? (
        <div className="crt-alert" style={{ borderColor: 'var(--crt-amber)', background: 'rgba(255, 176, 0, 0.1)', color: 'var(--crt-amber)' }}>
          <strong>[AVISO DE SISTEMA] ERRO DE TRANSMISSÃO DETECTADO!</strong><br/>
          {lastRound.playerFlipped && '• Sua decisão foi invertida na linha física. '}
          {lastRound.botFlipped && '• A decisão do bot foi invertida na linha física.'}
        </div>
      ) : (
        <div className="crt-alert" style={{ borderStyle: 'solid', borderColor: 'var(--crt-green-dim)', fontSize: '0.85rem' }}>
          <strong>[SINAL ESTÁVEL]</strong> Taxa de ruído ativa: {noiseProb}%. Leia os impactos matemáticos desse ruído na <strong>Prancheta (Esquerda)</strong>.
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '6px' }}>
        <div className="stat-box" style={{ minWidth: '140px' }}>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>PROGRESSO</div>
          <div className="stat-box-val" style={{ color: 'var(--crt-green)' }}>
            {isFinished ? 'FIM DA RODADA' : `${roundsPlayed + 1} / ${maxRounds}`}
          </div>
        </div>
      </div>
    </div>
  );
}
