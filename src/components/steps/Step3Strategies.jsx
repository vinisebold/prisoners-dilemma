import React from 'react';
import { sound } from '../../utils/sound';

export const BOT_DOSSIERS = {
  copycat: {
    name: 'Copycat (Olho por Olho)',
    desc: 'Começa cooperando. Nas rodadas seguintes, repete exatamente o que você fez na rodada anterior.',
    dossier: 'Justo, retaliador e perdoador. É a estratégia de referência da teoria dos jogos.'
  },
  always_defect: {
    name: 'Sempre Delatar (Traidor)',
    desc: 'Nunca coopera. Delata todas as rodadas, não importa o que você decida fazer.',
    dossier: 'Explora severamente cooperadores ingênuos e evita ser explorado, mas falha em cooperar mutuamente.'
  },
  always_cooperate: {
    name: 'Sempre Cooperar (Ingênuo)',
    desc: 'Nunca delata. Sempre escolhe Cooperar/Silêncio, sob qualquer circunstância.',
    dossier: 'Altruísta puro. Alvo fácil para traidores de plantão. Sofre a pior pena se explorado.'
  },
  grudger: {
    name: 'Rabugento (Grudger)',
    desc: 'Começa cooperando. Mas se você o delatar uma única vez, ele NUNCA mais te perdoa e delata para sempre.',
    dossier: 'Rancoroso. Mantém cooperação mútua, mas é extremamente intolerante a desvios.'
  },
  detective: {
    name: 'Detetive',
    desc: 'Joga: Cooperar, Delatar, Cooperar, Cooperar. Se você delatar de volta, ele vira um Copycat. Se você nunca delatar, ele vira Sempre Delatar para te explorar.',
    dossier: 'Analítico e explorador. Testa a reação do oponente antes de definir sua postura.'
  }
};

export default function Step3Strategies({
  selectedBot,
  onBotChange,
  roundsPlayed,
  history,
  playerScore,
  botScore,
  onPlay,
  onResetMatch
}) {
  const maxRounds = 5;
  const isFinished = roundsPlayed >= maxRounds;
  const activeBot = BOT_DOSSIERS[selectedBot];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <h1 className="retro-h1">Galeria de Estratégias</h1>
      <p className="retro-p">
        Nem todo mundo pensa igual. Teste suas táticas contra 5 bots com perfis diferentes. 
      </p>

      {/* Seleção do Bot */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Selecione o Oponente:</label>
          <select 
            value={selectedBot}
            onChange={(e) => {
              sound.playClick();
              onBotChange(e.target.value);
            }}
            className="retro-select"
            disabled={roundsPlayed > 0 && !isFinished} // Bloqueia troca no meio da partida
          >
            {Object.keys(BOT_DOSSIERS).map(key => (
              <option key={key} value={key}>{BOT_DOSSIERS[key].name}</option>
            ))}
          </select>
        </div>

        <button 
          className="retro-btn btn-action" 
          onClick={onResetMatch}
          style={{ padding: '6px 12px', fontSize: '0.8rem', marginTop: '16px' }}
        >
          Reiniciar Partida
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', flex: 1 }}>
        {/* Painel Esquerdo: Dossiê do Bot */}
        <div style={{ flex: '1 1 240px', background: 'rgba(0,0,0,0.25)', border: '1px solid var(--crt-green-dim)', borderRadius: '6px', padding: '12px' }}>
          <h2 className="retro-h2" style={{ color: 'var(--crt-amber)', fontSize: '1.2rem', marginBottom: '4px' }}>Dossiê do Oponente</h2>
          <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold', marginBottom: '6px' }}>{activeBot.name}</div>
          <p className="retro-p" style={{ fontSize: '0.8rem', color: '#aaccbb', marginBottom: '8px' }}>
            <strong>Comportamento:</strong> {activeBot.desc}
          </p>
          <p className="retro-p" style={{ fontSize: '0.75rem', color: 'var(--crt-green)', fontStyle: 'italic', borderTop: '1px dashed #333', paddingTop: '6px' }}>
            <strong>Nota do Investigador:</strong> {activeBot.dossier}
          </p>
        </div>

        {/* Painel Central: Status da Partida */}
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="stat-box" style={{ background: '#111' }}>
            <div style={{ fontSize: '0.75rem', color: '#888' }}>RODADA</div>
            <div className="stat-box-val" style={{ color: 'var(--crt-amber)', fontSize: '1.2rem' }}>
              {isFinished ? 'CONCLUÍDO' : `${roundsPlayed + 1} / ${maxRounds}`}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="stat-box" style={{ flex: 1 }}>
              <div style={{ fontSize: '0.7rem', color: '#888' }}>SEU PLACAR</div>
              <div className="stat-box-val">{playerScore}y</div>
            </div>
            <div className="stat-box" style={{ flex: 1 }}>
              <div style={{ fontSize: '0.7rem', color: '#888' }}>BOT PLACAR</div>
              <div className="stat-box-val">{botScore}y</div>
            </div>
          </div>

          {!isFinished ? (
            <div className="crt-alert" style={{ borderStyle: 'dashed', margin: '0', fontSize: '0.8rem', padding: '8px' }}>
              Pressione <strong>COOPERAR</strong> ou <strong>DELATAR</strong>.
            </div>
          ) : (
            <div className="crt-alert" style={{ borderColor: 'var(--crt-green)', margin: '0', fontSize: '0.8rem', padding: '8px' }}>
              Fim de jogo! Experimente outros bots ou clique em <strong>AVANÇAR</strong>.
            </div>
          )}
        </div>

        {/* Painel Direito: Histórico do Duelo */}
        <div style={{ flex: '1.5 1 260px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.75rem', color: '#6a6', textTransform: 'uppercase', marginBottom: '2px' }}>Histórico do Duelo</div>
          <div className="round-log" style={{ flex: 1, minHeight: '100px', maxHeight: '140px' }}>
            {history.length === 0 ? (
              <div style={{ color: '#555', textAlign: 'center', paddingTop: '20px' }}>[SEM REGISTROS]</div>
            ) : (
              history.map((r, idx) => (
                <div key={idx} className="round-log-entry" style={{ fontSize: '0.8rem' }}>
                  <span>R{idx + 1}: VOCÊ {r.playerChoice === 'cooperate' ? 'COOP' : 'DEL'} | BOT {r.botChoice === 'cooperate' ? 'COOP' : 'DEL'}</span>
                  <span>[+{r.playerPayoff}y / +{r.botPayoff}y]</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
