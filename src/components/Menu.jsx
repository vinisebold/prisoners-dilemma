
export default function Menu({ onStart }) {
  return (
    <div className="menu-container">
      <div className="menu-badge">SISTEMA DE SIMULAÇÃO</div>
      <h1 className="menu-title">DILEMA DO PRISIONEIRO</h1>
      <div className="menu-subtitle">Terminal de Decisão v1.0</div>

      <div className="menu-divider" />

      <div className="menu-description">
        <p>Um simulador didático interativo do Dilema do Prisioneiro com foco em teoria dos jogos, probabilidade e evolução da confiança.</p>
      </div>

      <div className="menu-info">
        <div className="menu-info-row">
          <span className="menu-info-label">Módulos</span>
          <span className="menu-info-value">06</span>
        </div>
        <div className="menu-info-row">
          <span className="menu-info-label">Duração</span>
          <span className="menu-info-value">~15 min</span>
        </div>
        <div className="menu-info-row">
          <span className="menu-info-label">Estratégias</span>
          <span className="menu-info-value">06</span>
        </div>
      </div>

      <button className="menu-play-btn" onClick={onStart}>
        INICIAR
      </button>

      <div className="menu-footer">
        <span className="menu-blink">_</span> PRESSIONE ENTER OU CLIQUE PARA INICIAR
      </div>
    </div>
  );
}
