
export default function CrtScreen({ children, currentStep, totalSteps, isSettingsOpen }) {
  return (
    <div className="monitor-bezel">
      <div className="crt-screen-container">
        {/* Camadas de Efeito CRT */}
        <div className="crt-effects" />
        <div className="crt-scanline-bar" />
        
        {/* Conteúdo Real da Tela */}
        <div className="crt-content">
          {/* Cabeçalho da Tela */}
          <div className="crt-header">
            <span className="crt-title">
              {isSettingsOpen ? "AJUSTES DE SISTEMA" : "DILEMA MONITOR v1.0"}
            </span>
            <div className="crt-status-indicator">
              <span className={isSettingsOpen ? "led red on" : "led green on"} style={{ width: '8px', height: '8px' }} />
              <span style={{ fontSize: '0.75rem', letterSpacing: '2px', fontWeight: 'bold' }}>
                {isSettingsOpen ? "SETUP" : `MÓDULO: ${currentStep}/${totalSteps}`}
              </span>
            </div>
          </div>
          
          {/* Corpo Dinâmico */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
