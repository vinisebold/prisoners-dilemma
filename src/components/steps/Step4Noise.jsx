import React from 'react';
import { sound } from '../../utils/sound';

export default function Step4Noise({
  selectedBot,
  onBotChange,
  noiseProb,
  onNoiseChange,
  roundsPlayed,
  history,
  playerScore,
  botScore,
  onPlay,
  onResetMatch
}) {
  const maxRounds = 7;
  const isFinished = roundsPlayed >= maxRounds;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <h1 className="retro-h1">Probabilidade & Ruído</h1>
      <p className="retro-p">
        Na vida real, ocorrem **erros de comunicação (ruído)**. Você pode tentar <em>Cooperar</em>, mas o oponente recebe sua mensagem como uma <em>Delação</em> por acidente.
      </p>

      {/* Seletor de Estratégia e Ruído */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
            <option value="copycat">Copycat (Vingança Imediata)</option>
            <option value="copykitten">Copykitten (Tolerante ao Erro)</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Taxa de Ruído (no Painel abaixo):</label>
          <div style={{ color: 'var(--crt-amber)', fontSize: '0.9rem', border: '1px solid #444', padding: '6px 12px', borderRadius: '4px', background: '#111' }}>
            {noiseProb}% de chance de inverter a ação
          </div>
        </div>

        <button 
          className="retro-btn btn-action" 
          onClick={onResetMatch}
          style={{ padding: '6px 12px', fontSize: '0.8rem', marginTop: '16px' }}
        >
          Reiniciar
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', flex: 1 }}>
        {/* Painel Esquerdo: Explicação da Probabilidade */}
        <div style={{ flex: '1.2 1 280px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--crt-green-dim)', padding: '12px', borderRadius: '6px', fontSize: '0.85rem' }}>
            <h2 className="retro-h2" style={{ fontSize: '1.1rem', marginBottom: '4px' }}>O Impacto do Acaso</h2>
            <p className="retro-p" style={{ fontSize: '0.8rem', color: '#aab', marginBottom: '6px' }}>
              Se houver ruído, quando você escolhe <strong>Cooperar</strong>, há uma probabilidade de {noiseProb}% da máquina transmitir <strong>Delatar</strong>.
            </p>
            <p className="retro-p" style={{ fontSize: '0.8rem', color: '#aab', marginBottom: '0' }}>
              <strong>Copycat:</strong> É destruído pelo ruído. Um único erro gera um ciclo infinito de retaliações ("mal-entendido").<br/>
              <strong>Copykitten:</strong> Tolera um erro. Só delata se o outro delatar duas vezes seguidas, quebrando a espiral de ódio!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="stat-box" style={{ flex: 1 }}>
              <div style={{ fontSize: '0.7rem', color: '#888' }}>RODADAS</div>
              <div style={{ color: 'var(--crt-amber)', fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
                {isFinished ? 'CONCLUÍDO' : `${roundsPlayed + 1} / ${maxRounds}`}
              </div>
            </div>
            <div className="stat-box" style={{ flex: 1 }}>
              <div style={{ fontSize: '0.7rem', color: '#888' }}>SEU ACUMULADO</div>
              <div className="stat-box-val" style={{ color: 'var(--crt-green)' }}>{playerScore}y</div>
            </div>
            <div className="stat-box" style={{ flex: 1 }}>
              <div style={{ fontSize: '0.7rem', color: '#888' }}>BOT ACUMULADO</div>
              <div className="stat-box-val" style={{ color: 'var(--crt-green)' }}>{botScore}y</div>
            </div>
          </div>
        </div>

        {/* Painel Direito: Histórico com Alertas de Ruído */}
        <div style={{ flex: '1.8 1 300px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.75rem', color: '#6a6', textTransform: 'uppercase', marginBottom: '2px' }}>Histórico com Registro de Ruído</div>
          <div className="round-log" style={{ flex: 1, minHeight: '120px', maxHeight: '180px' }}>
            {history.length === 0 ? (
              <div style={{ color: '#555', textAlign: 'center', paddingTop: '30px' }}>[INICIE O JOGO]</div>
            ) : (
              history.map((r, idx) => {
                const noiseFlipped = r.playerFlipped || r.botFlipped;
                return (
                  <div key={idx} className="round-log-entry" style={{ 
                    fontSize: '0.8rem',
                    color: noiseFlipped ? 'var(--crt-amber)' : 'inherit',
                    borderBottom: noiseFlipped ? '1px dashed var(--crt-amber)' : '1px dashed rgba(51,255,51,0.15)'
                  }}>
                    <div>
                      <span>R{idx + 1}: VOCÊ {r.playerChoice === 'cooperate' ? 'COOP' : 'DEL'} {r.playerFlipped && '⚡[RUÍDO]'} | </span>
                      <span>BOT {r.botChoice === 'cooperate' ? 'COOP' : 'DEL'} {r.botFlipped && '⚡[RUÍDO]'}</span>
                    </div>
                    <span style={{ fontWeight: 'bold' }}>[+{r.playerPayoff}y / +{r.botPayoff}y]</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      {isFinished && (
        <div className="crt-alert" style={{ borderColor: 'var(--crt-amber)', margin: '8px 0 0 0', fontSize: '0.85rem', padding: '8px' }}>
          <strong>Conclusão Probabilística:</strong> Com ruído ativo, o valor esperado dos anos de prisão do <em>Copycat</em> aumenta muito devido a retaliações infinitas por engano. A tolerância (Copykitten) atua como um filtro probabilístico que amortece erros isolados e estabiliza a cooperação. Avançar para ver em massa!
        </div>
      )}
    </div>
  );
}
