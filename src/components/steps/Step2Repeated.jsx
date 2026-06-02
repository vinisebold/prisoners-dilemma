import React from 'react';

export default function Step2Repeated({ roundsPlayed, playerScore, botScore }) {
  const maxRounds = 5;
  const isFinished = roundsPlayed >= maxRounds;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', animation: 'crt-flicker 0.15s infinite' }}>
      <h1 className="retro-h1">Dilema Iterado (Repetido)</h1>
      <p className="retro-p">
        As sentenças agora são cumulativas. Você jogará <strong>5 rodadas</strong> contra um oponente desconhecido.
      </p>

      <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--crt-green-dim)', padding: '14px', borderRadius: '6px', margin: '10px 0' }}>
        <h2 className="retro-h2" style={{ color: 'var(--crt-green)', fontSize: '1.2rem', marginBottom: '4px' }}>Status da Interrogação</h2>
        <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', color: isFinished ? 'var(--crt-amber)' : 'var(--crt-green)', letterSpacing: '1px' }}>
          {isFinished ? 'PROCESSO CONCLUÍDO' : `RODADA EM CURSO: ${roundsPlayed + 1} / ${maxRounds}`}
        </div>
      </div>

      {!isFinished ? (
        <div className="crt-alert" style={{ borderStyle: 'dashed', margin: '0' }}>
          <strong>[SISTEMA]</strong> Sua pena acumulada está sendo impressa na bobina física do <strong>Ticket à direita</strong>. Insira sua decisão!
        </div>
      ) : (
        <div style={{ marginTop: '6px' }}>
          <div className="crt-alert" style={{ borderColor: 'var(--crt-amber)', background: 'rgba(255, 176, 0, 0.05)', color: 'var(--crt-amber)', margin: '0 0 10px 0' }}>
            <strong>OPONENTE DESMASCARADO:</strong> Ele joga como <strong>Copycat (Olho por Olho)</strong>!
          </div>
          <p className="retro-p" style={{ fontSize: '0.85rem', color: '#aab' }}>
            Ele iniciou cooperando e depois simplesmente repetiu sua jogada anterior. 
            Consulte o <strong>Dossiê (Esquerda)</strong> para entender por que essa estratégia é tão famosa na teoria dos jogos. Pressione <strong>AVANÇAR</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
