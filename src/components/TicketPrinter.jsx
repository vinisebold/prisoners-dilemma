import { useEffect, useRef } from 'react';

export default function TicketPrinter({ 
  currentStep, 
  history, 
  playerScore, 
  botScore
}) {
  const paperRef = useRef(null);

  // Faz scroll automático para a base do ticket sempre que houver novas rodadas
  useEffect(() => {
    if (paperRef.current) {
      paperRef.current.scrollTop = paperRef.current.scrollHeight;
    }
  }, [history]);

  // Formata os anos de prisão para ter sempre dois dígitos (ex: 03 ANOS)
  const formatScore = (score) => {
    const s = Math.max(0, score);
    return s < 10 ? `0${s}` : `${s}`;
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Dilema Básico";
      case 2: return "Partida Iterada";
      case 3: return "Modo Galeria";
      case 4: return "Ensaio de Ruído";
      case 5: return "Simulação Pop";
      case 6: return "Resumo Final";
      default: return "Ticket Registro";
    }
  };

  return (
    <div className="ticket-printer">
      {/* Marcador Eletrônico Digital (Placares de Penas) */}
      <div className="scoreboard-digital">
        <span className="scoreboard-label">Pena Total Jogador</span>
        <div className="seven-segment">
          {formatScore(playerScore)} <span style={{ fontSize: '0.9rem', color: '#ff3333' }}>ANOS</span>
        </div>
      </div>

      <div className="scoreboard-digital" style={{ marginTop: '4px' }}>
        <span className="scoreboard-label">Pena Total Oponente</span>
        <div className="seven-segment" style={{ color: 'var(--crt-amber)', textShadow: '0 0 8px var(--crt-amber-glow)' }}>
          {formatScore(botScore)} <span style={{ fontSize: '0.9rem', color: 'var(--crt-amber)' }}>ANOS</span>
        </div>
      </div>

      {/* Boca da Impressora */}
      <div className="printer-mouth" />

      {/* Papel Térmico Exposto */}
      <div className="ticket-paper" ref={paperRef}>
        <div className="ticket-title">
          REGISTRO DE RODADAS<br/>
          {getStepTitle()}
        </div>
        
        <div style={{ fontSize: '0.65rem', color: '#666', textAlign: 'center', marginBottom: '8px' }}>
          -- MATEMÁTICA E PROBABILIDADE --<br/>
          INVESTIGAÇÃO ATIVA
        </div>

        <div style={{ flex: 1 }}>
          {history && history.length > 0 ? (
            history.map((r, idx) => {
              const pChoice = r.playerChoice === 'cooperate' ? 'COOPERAR' : 'DELATAR';
              const bChoice = r.botChoice === 'cooperate' ? 'COOPERAR' : 'DELATAR';
              return (
                <div key={idx} style={{ borderBottom: '1px dotted #bbb', paddingBottom: '4px', marginBottom: '6px', fontSize: '0.7rem' }}>
                  <div style={{ fontWeight: 'bold' }}>RODADA: 0{idx + 1}</div>
                  <div className="ticket-line">
                    <span>VOCÊ: {pChoice} {r.playerFlipped && '(⚡ERRO)'}</span>
                    <span>+{r.playerPayoff}a</span>
                  </div>
                  <div className="ticket-line">
                    <span>BOT: {bChoice} {r.botFlipped && '(⚡ERRO)'}</span>
                    <span>+{r.botPayoff}a</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ color: '#888', textAlign: 'center', padding: '20px 0', fontSize: '0.7rem' }}>
              [AGUARDANDO<br/>PARTIDA INICIAR]
            </div>
          )}
        </div>

        <div style={{ 
          marginTop: '12px', 
          borderTop: '2px dashed #333', 
          paddingTop: '6px', 
          textAlign: 'center', 
          fontSize: '0.6rem',
          color: '#555' 
        }}>
          FIM DO EXTRATO PENAL<br/>
          DEPMIND CO.
        </div>
      </div>
    </div>
  );
}
