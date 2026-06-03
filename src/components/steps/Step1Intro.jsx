export default function Step1Intro({ playState, playerChoice }) {
  return (
    <div style={{ animation: 'crt-flicker 0.15s infinite', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
      <h1 className="retro-h1">Dilema do Prisioneiro</h1>
      <p className="retro-p" style={{ color: 'var(--crt-green)' }}>
        Você e seu comparsa foram detidos e estão sob investigação criminal.
      </p>
      
      <p className="retro-p" style={{ color: 'var(--crt-amber)', fontSize: '0.95rem' }}>
        <strong>INSTRUÇÃO:</strong> Leia as regras penais datilografadas no <strong>Dossiê do Caso (Esquerda)</strong> para entender as punições.
      </p>

      {playState === 'waiting' ? (
        <div className="crt-alert" style={{ borderStyle: 'dashed' }}>
          <strong>[MÓDULO DE INTERROGAÇÃO ATIVO]</strong><br/>
          Use os botões físicos <strong>COOPERAR</strong> ou <strong>DELATAR</strong> no painel de controle abaixo para dar seu depoimento piloto.
        </div>
      ) : (
        <div style={{ marginTop: '10px' }}>
          <h2 className="retro-h2" style={{ color: playerChoice === 'cooperate' ? 'var(--crt-green)' : 'var(--crt-red)' }}>
            SUA DECISÃO REGISTRADA: {playerChoice === 'cooperate' ? 'COOPERAR' : 'DELATAR'}
          </h2>
          <h2 className="retro-h2" style={{ color: 'var(--crt-red)' }}>
            DECISÃO DO BOT REGISTRADA: DELATAR
          </h2>
          
          <div className="crt-alert" style={{ borderColor: 'var(--crt-red)', background: 'rgba(255, 51, 51, 0.05)', color: 'var(--crt-red)', fontSize: '0.85rem' }}>
            <strong>NOTIFICAÇÃO:</strong> As sentenças correspondentes foram calculadas e impressas no <strong>Ticket à direita</strong>.
          </div>

          <p className="retro-p" style={{ fontSize: '0.85rem', color: '#aab' }}>
            Em jogos de uma única rodada, trair é a escolha mais lógica para se proteger, mesmo que a cooperação mútua fosse melhor.
            Pressione <strong>AVANÇAR</strong> no painel físico para prosseguir para jogos repetidos.
          </p>
        </div>
      )}
    </div>
  );
}
