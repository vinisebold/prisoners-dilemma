import React from 'react';
import { sound } from '../../utils/sound';

export default function Step2Repeated({
  roundsPlayed,
  history,
  playerScore,
  botScore,
  onPlay
}) {
  const maxRounds = 5;
  const isFinished = roundsPlayed >= maxRounds;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <h1 className="retro-h1">Dilema Repetido (Iterado)</h1>
      <p className="retro-p">
        Em sociedade, as interações se repetem. As decisões de hoje afetam o amanhã.
        Você jogará <strong>5 rodadas consecutivas</strong> contra um oponente misterioso.
      </p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px', flex: 1 }}>
        {/* Painel Esquerdo: Placar e Status */}
        <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="stat-box" style={{ border: '2px solid var(--crt-green-dim)', padding: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: '#8b8', textTransform: 'uppercase' }}>Status da Conexão</div>
            <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: isFinished ? 'var(--crt-amber)' : 'var(--crt-green)' }}>
              {isFinished ? 'SIMULAÇÃO CONCLUÍDA' : `RODADA EM CURSO: ${roundsPlayed + 1} / ${maxRounds}`}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="stat-box" style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>SEUS ANOS DE PRISÃO</div>
              <div className="stat-box-val" style={{ color: 'var(--crt-green)' }}>{playerScore}</div>
            </div>
            <div className="stat-box" style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>ANOS DO BOT MISTERIOSO</div>
              <div className="stat-box-val" style={{ color: 'var(--crt-green)' }}>{botScore}</div>
            </div>
          </div>

          {!isFinished ? (
            <div className="crt-alert" style={{ borderStyle: 'dashed', margin: '0' }}>
              <strong>[AGUARDANDO ENTRADA]</strong><br/>
              Use os botões <strong>COOPERAR</strong> ou <strong>DELATAR</strong> no painel de controle abaixo para jogar a próxima rodada.
            </div>
          ) : (
            <div className="crt-alert" style={{ borderColor: 'var(--crt-amber)', background: 'rgba(255, 176, 0, 0.05)', color: 'var(--crt-amber)', margin: '0' }}>
              <strong>MENSAGEM DO SISTEMA:</strong><br/>
              Oponente desmascarado! O bot jogava a estratégia <strong>Olho por Olho (Copycat)</strong>.
            </div>
          )}
        </div>

        {/* Painel Direito: Histórico de Rodadas (Log) */}
        <div style={{ flex: '2 1 300px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.8rem', color: '#6a6', textTransform: 'uppercase', marginBottom: '4px' }}>Log do Terminal de Interrogação</div>
          <div className="round-log" style={{ flex: 1, minHeight: '120px', maxHeight: '180px' }}>
            {history.length === 0 ? (
              <div style={{ color: '#555', textAlign: 'center', paddingTop: '30px' }}>[NENHUMA JOGADA REGISTRADA]</div>
            ) : (
              history.map((r, idx) => {
                const isPlayerCoop = r.playerChoice === 'cooperate';
                const isBotCoop = r.botChoice === 'cooperate';
                return (
                  <div key={idx} className="round-log-entry">
                    <span>R{idx + 1}: VOCÊ {isPlayerCoop ? 'COOPEROU (S)' : 'DELATOU (T)'} | BOT {isBotCoop ? 'COOPEROU (S)' : 'DELATOU (T)'}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
                      [+{r.playerPayoff}y / +{r.botPayoff}y]
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {isFinished && (
        <div style={{ marginTop: '16px', padding: '12px', border: '1px solid var(--crt-green-dim)', background: 'rgba(51, 255, 51, 0.05)', borderRadius: '6px' }}>
          <p className="retro-p" style={{ fontSize: '0.9rem', marginBottom: '6px' }}>
            <strong>Análise Matemática:</strong> A estratégia <em>Olho por Olho (Copycat)</em> começa cooperando e depois simplesmente imita sua decisão anterior.
          </p>
          <p className="retro-p" style={{ fontSize: '0.9rem', color: '#aaccbb', marginBottom: '0' }}>
            Se você cooperou todas as rodadas, ambos pegaram apenas 5 anos no total (ótimo resultado mútuo!). Se você tentou delatá-lo, ele te puniu na rodada seguinte. Em relacionamentos contínuos, a cooperação pode se sustentar porque a traição gera punição imediata, alterando os valores esperados das recompensas futuras.
          </p>
        </div>
      )}
    </div>
  );
}
