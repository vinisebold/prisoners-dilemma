export default function Step1Intro({ playState, playerChoice }) {
  return (
    <div style={{ animation: 'crt-flicker 0.15s infinite', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
      <h1 className="retro-h1">Dilema Único</h1>
      <p className="retro-p" style={{ textAlign: 'center', color: '#aab' }}>
        Você e seu oponente foram detidos. Sem contato, cada um deve confessar ou silenciar.
      </p>

      {playState === 'waiting' ? (
        <div style={{ margin: '8px 0' }}>
          <div className="crt-alert" style={{ borderStyle: 'dashed', textAlign: 'center', padding: '12px' }}>
            <span style={{ fontSize: '1.0rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>[ AGUARDANDO DEPOIMENTO ]</span>
            Consulte a tabela de penas no <strong>Dossiê (Esquerda)</strong>.<br/>
            Selecione <strong>COOPERAR</strong> ou <strong>DELATAR</strong> no painel de controle.
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '5px' }}>
          <div className="crt-split-panel">
            <div className={`crt-card ${playerChoice === 'defect' ? 'defect' : ''}`}>
              <div className="crt-card-label">Sua Escolha</div>
              <div className={`crt-badge crt-badge-${playerChoice}`}>
                {playerChoice === 'cooperate' ? 'Cooperar' : 'Delatar'}
              </div>
            </div>

            <div className="crt-card defect">
              <div className="crt-card-label">Oponente</div>
              <div className="crt-badge crt-badge-defect">
                Delatar
              </div>
            </div>
          </div>

          <div className="crt-alert" style={{ borderColor: 'var(--crt-red)', background: 'rgba(255, 51, 51, 0.03)', color: 'var(--crt-red)', fontSize: '0.8rem', textAlign: 'center', margin: '4px 0' }}>
            Resultado calculado e impresso no <strong>Ticket (Direita)</strong>.
          </div>

          <p className="retro-p" style={{ fontSize: '0.78rem', color: '#9a9', textAlign: 'center', margin: '2px 0' }}>
            Na rodada única, delatar é o Equilíbrio de Nash (segurança individual), mas pune ambos coletivamente.
          </p>
          <p className="retro-p" style={{ fontSize: '0.78rem', color: 'var(--crt-amber)', textAlign: 'center', fontWeight: 'bold', margin: '2px 0' }}>
            Pressione AVANÇAR para iniciar partidas repetidas.
          </p>
        </div>
      )}
    </div>
  );
}
