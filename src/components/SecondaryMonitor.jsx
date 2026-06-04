import { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/sound';

export default function SecondaryMonitor({
  currentStep,
  history = [],
  playerScore,
  botScore
}) {
  const [mode, setMode] = useState('grid'); // 'grid', 'chart', 'stats'
  const [logs, setLogs] = useState([
    'SISTEMA AUXILIAR INICIALIZADO...',
    'MONITOR DE REGISTRO CONECTADO.',
  ]);

  const logsEndRef = useRef(null);

  // Auto-scroll para os logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight;
    }
  }, [logs]);

  // Adiciona logs quando novas rodadas acontecem ou a etapa muda
  useEffect(() => {
    const stepNames = {
      1: 'DILEMA BÁSICO',
      2: 'PARTIDA ITERADA',
      3: 'GALERIA DE ESTRATÉGIAS',
      4: 'ENSAIO DE RUÍDO',
      5: 'TORNEIO EVOLUTIVO',
      6: 'RESUMO FINAL'
    };

    const timeoutId = setTimeout(() => {
      setLogs(prev => [
        ...prev,
        `> ALTERANDO PARA MÓDULO: ${stepNames[currentStep] || currentStep}`
      ]);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [currentStep]);

  useEffect(() => {
    if (!history || history.length === 0) return;

    const lastRoundIdx = history.length - 1;
    const lastRound = history[lastRoundIdx];
    const rNum = String(lastRoundIdx + 1).padStart(2, '0');

    const pChoiceStr = lastRound.playerChoice === 'cooperate' ? 'COOPERAR' : 'DELATAR';
    const bChoiceStr = lastRound.botChoice === 'cooperate' ? 'COOPERAR' : 'DELATAR';

    const pFlipStr = lastRound.playerFlipped ? ' (⚡RUÍDO)' : '';
    const bFlipStr = lastRound.botFlipped ? ' (⚡RUÍDO)' : '';

    const timeoutId = setTimeout(() => {
      setLogs(prev => [
        ...prev,
        `> R${rNum} REGISTRADA:`,
        `  JOGADOR: ${pChoiceStr}${pFlipStr} (+${lastRound.playerPayoff}a)`,
        `  OPONENTE: ${bChoiceStr}${bFlipStr} (+${lastRound.botPayoff}a)`
      ]);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [history]);

  const rotateKnob = () => {
    sound.playClick();
    setMode(prev => {
      if (prev === 'grid') return 'chart';
      if (prev === 'chart') return 'stats';
      return 'grid';
    });
  };

  // Rotação do botão giratório físico (Knob)
  const getKnobRotation = () => {
    if (mode === 'grid') return -45;
    if (mode === 'chart') return 0;
    return 45;
  };

  // Cálculos para o gráfico SVG
  const renderChart = () => {
    if (!history || history.length === 0) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '110px',
          border: '1px dashed var(--sec-color-dim)',
          borderRadius: '4px',
          fontSize: '0.65rem',
          color: 'var(--sec-color-dim)',
          textAlign: 'center',
          padding: '8px'
        }}>
          [SEM REGISTROS GRAVADOS]<br/>
          INICIE UMA PARTIDA
        </div>
      );
    }

    const width = 200;
    const height = 110;
    const padding = 15;

    // Calcular placar acumulado por rodada
    let currentPScore = 0;
    let currentBScore = 0;
    const pPoints = [{ x: padding, y: height - padding }];
    const bPoints = [{ x: padding, y: height - padding }];

    const totalRounds = history.length;
    const maxVal = Math.max(
      ...history.reduce((acc, curr) => {
        const lastP = acc.length > 0 ? acc[acc.length - 1].p : 0;
        const lastB = acc.length > 0 ? acc[acc.length - 1].b : 0;
        acc.push({ p: lastP + curr.playerPayoff, b: lastB + curr.botPayoff });
        return acc;
      }, []).flatMap(d => [d.p, d.b]), 
      5 // Valor mínimo no eixo Y
    );

    history.forEach((round, idx) => {
      currentPScore += round.playerPayoff;
      currentBScore += round.botPayoff;

      const x = padding + ((idx + 1) / totalRounds) * (width - 2 * padding);
      const yP = height - padding - (currentPScore / maxVal) * (height - 2 * padding);
      const yB = height - padding - (currentBScore / maxVal) * (height - 2 * padding);

      pPoints.push({ x, y: yP });
      bPoints.push({ x, y: yB });
    });

    const pPathStr = pPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const bPathStr = bPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--sec-color)', marginBottom: '3px' }}>
          <span>Pena Acumulada (Anos)</span>
          <span>Máx: {maxVal}a</span>
        </div>
        <svg width="100%" height={height} className="sec-chart-svg" viewBox={`0 0 ${width} ${height}`}>
          {/* Grade de fundo */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="var(--sec-color-dim)" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="var(--sec-color-dim)" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--sec-color)" strokeWidth="1" opacity="0.6" />
          
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="var(--sec-color)" strokeWidth="1" opacity="0.6" />
          <line x1={width - padding} y1={padding} x2={width - padding} y2={height - padding} stroke="var(--sec-color-dim)" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3" />

          {/* Marcadores de rodadas (eixo X) */}
          {history.map((_, idx) => {
            const x = padding + ((idx + 1) / totalRounds) * (width - 2 * padding);
            return (
              <g key={idx}>
                <line x1={x} y1={padding} x2={x} y2={height - padding} stroke="var(--sec-color-dim)" strokeWidth="0.5" strokeDasharray="1,2" opacity="0.25" />
                <text x={x} y={height - 3} fontSize="5" fill="var(--sec-color)" textAnchor="middle" opacity="0.8">R{idx + 1}</text>
              </g>
            );
          })}

          {/* Traçado do Jogador (Verde/Cor Primária Secundária) */}
          <path d={pPathStr} fill="none" stroke="#33ff33" strokeWidth="1.8" filter="drop-shadow(0 0 2px rgba(51, 255, 51, 0.5))" />
          {pPoints.map((p, i) => i > 0 && <circle key={i} cx={p.x} cy={p.y} r="2" fill="#33ff33" />)}

          {/* Traçado do Oponente (Vermelho/Glow) */}
          <path d={bPathStr} fill="none" stroke="#ff3333" strokeWidth="1.8" filter="drop-shadow(0 0 2px rgba(255, 51, 51, 0.5))" />
          {bPoints.map((p, i) => i > 0 && <circle key={i} cx={p.x} cy={p.y} r="2" fill="#ff3333" />)}
        </svg>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', fontSize: '0.58rem', marginTop: '2px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#33ff33', borderRadius: '50%' }} /> VOCÊ ({playerScore}a)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#ff3333', borderRadius: '50%' }} /> BOT ({botScore}a)
          </span>
        </div>
      </div>
    );
  };

  // Contagem de estatísticas de cooperação
  const renderStats = () => {
    if (!history || history.length === 0) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '110px',
          border: '1px dashed var(--sec-color-dim)',
          borderRadius: '4px',
          fontSize: '0.65rem',
          color: 'var(--sec-color-dim)',
          textAlign: 'center',
          padding: '8px'
        }}>
          [SEM REGISTROS GRAVADOS]<br/>
          INICIE UMA PARTIDA
        </div>
      );
    }

    const total = history.length;
    const playerCoops = history.filter(r => r.playerChoice === 'cooperate').length;
    const botCoops = history.filter(r => r.botChoice === 'cooperate').length;

    const pCoopPct = Math.round((playerCoops / total) * 100);
    const bCoopPct = Math.round((botCoops / total) * 100);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px 0' }}>
        <div style={{ textAlign: 'center', fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--sec-color)', marginBottom: '2px' }}>
          Índice de Cooperação Recíproca
        </div>

        {/* Barra Jogador */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', marginBottom: '2px' }}>
            <span>SUA TAXA DE COOPERAÇÃO</span>
            <span>{playerCoops}/{total} ({pCoopPct}%)</span>
          </div>
          <div style={{ height: '10px', background: '#111', border: '1px solid var(--sec-color-dim)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${pCoopPct}%`, height: '100%', background: '#33ff33', boxShadow: '0 0 4px rgba(51, 255, 51, 0.8)' }} />
          </div>
        </div>

        {/* Barra Oponente */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', marginBottom: '2px' }}>
            <span>TAXA DE COOPERAÇÃO BOT</span>
            <span>{botCoops}/{total} ({bCoopPct}%)</span>
          </div>
          <div style={{ height: '10px', background: '#111', border: '1px solid var(--sec-color-dim)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${bCoopPct}%`, height: '100%', background: '#ff3333', boxShadow: '0 0 4px rgba(255, 51, 51, 0.8)' }} />
          </div>
        </div>

        <div style={{ fontSize: '0.58rem', color: 'var(--sec-color-dim)', borderTop: '1px dotted var(--sec-color-dim)', paddingTop: '6px', marginTop: '4px', textAlign: 'center' }}>
          Legenda: Barras indicam percentual de rodadas em que a opção de cooperar foi executada.
        </div>
      </div>
    );
  };

  return (
    <div className="secondary-monitor">
      {/* Definição do SVG ClipPath responsivo e invisível no DOM */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <clipPath id="screen-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 
                     L 1,0 
                     L 1,0.90 
                     C 1,0.91 0.99,0.92 0.98,0.92 
                     L 0.88,0.92 
                     C 0.87,0.92 0.86,0.93 0.86,0.94 
                     L 0.86,0.98 
                     C 0.86,0.99 0.85,1 0.84,1 
                     L 0,1 
                     Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Moldura Bezel da tela */}
      <div className="sec-monitor-bezel">
        {/* SVG de Overlay para desenhar a borda preta da tela ao redor do recorte curvo */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            pointerEvents: 'none', 
            zIndex: 15 
          }}
        >
          <path 
            d="M 0,0 L 100,0 L 100,90 C 100,91 99,92 98,92 L 88,92 C 87,92 86,93 86,94 L 86,98 C 86,99 85,100 84,100 L 0,100 Z" 
            fill="none" 
            stroke="#050505" 
            strokeWidth="3.5" 
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Tela CRT */}
        <div className="sec-monitor-screen">
          {/* Efeitos CRT */}
          <div className="crt-effects" />
          <div className="crt-scanline-bar" />

          {/* Conteúdo Real da Tela */}
          <div className="sec-monitor-content">
            <div className="sec-monitor-title">
              REGISTRO DE RODADAS
            </div>

            {/* Renderização Condicional com base no Modo Girado */}
            <div style={{ flex: 1 }}>
              {mode === 'grid' && (
                <div className="sec-mode-grid">
                  {history && history.length > 0 ? (
                    history.map((round, idx) => {
                      const pCooperate = round.playerChoice === 'cooperate';
                      const bCooperate = round.botChoice === 'cooperate';
                      return (
                        <div key={idx} className="sec-round-card">
                          <div className="sec-card-header">
                            <span>RODADA: 0{idx + 1}</span>
                            {round.playerFlipped || round.botFlipped ? (
                              <span style={{ color: '#ff3333', fontSize: '0.58rem' }}>⚡ RUÍDO DETECTADO</span>
                            ) : null}
                          </div>
                          <div className="sec-card-row">
                            <span>VOCÊ:</span>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <span className={`sec-choice-badge ${pCooperate ? 'cooperate' : 'defect'}`}>
                                {pCooperate ? '🤝 COOPERAR' : '⚔️ DELATAR'}
                              </span>
                              <span>+{round.playerPayoff}a</span>
                            </div>
                          </div>
                          <div className="sec-card-row">
                            <span>OPONENTE:</span>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <span className={`sec-choice-badge ${bCooperate ? 'cooperate' : 'defect'}`}>
                                {bCooperate ? '🤝 COOPERAR' : '⚔️ DELATAR'}
                              </span>
                              <span>+{round.botPayoff}a</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ color: 'var(--sec-color-dim)', textAlign: 'center', padding: '30px 0', fontSize: '0.7rem' }}>
                      [AGUARDANDO<br/>PARTIDA INICIAR]
                    </div>
                  )}
                </div>
              )}

              {mode === 'chart' && renderChart()}

              {mode === 'stats' && renderStats()}
            </div>

            {/* Histórico Raw Terminal (Logs) */}
            <div className="sec-terminal-logs" ref={logsEndRef}>
              {logs.map((log, index) => (
                <div key={index} style={{ whiteSpace: 'pre-wrap', marginBottom: '2px' }}>{log}</div>
              ))}
              <span className="sec-cursor" />
            </div>
          </div>
        </div>

        {/* Seletor Giratório (Knob) absoluto no canto inferior direito */}
        <div className="knob-container" title="Modos de Exibição (Grid, Gráfico, Stats)">
          <div 
            className="knob-wheel" 
            style={{ transform: `rotate(${getKnobRotation()}deg)` }}
            onClick={rotateKnob}
          >
            <div className="knob-indicator-line" />
          </div>
        </div>
      </div>
    </div>
  );
}
