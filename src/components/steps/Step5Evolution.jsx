import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/sound';

const INITIAL_POPULATION = [
  'cooperator', 'cooperator', 'cooperator', 'cooperator', 'cooperator',
  'cheater', 'cheater', 'cheater', 'cheater', 'cheater',
  'copycat', 'copycat', 'copycat', 'copycat', 'copycat',
  'grudger', 'grudger', 'grudger', 'grudger', 'grudger',
  'copykitten', 'copykitten', 'copykitten', 'copykitten', 'copykitten'
];

const STRATEGY_INFO = {
  cooperator: { name: 'Ingênuo (Sempre Cooperar)', color: 'var(--crt-green)', letter: 'I', class: 'cooperator' },
  cheater: { name: 'Traidor (Sempre Delatar)', color: 'var(--crt-red)', letter: 'T', class: 'cheater' },
  copycat: { name: 'Copycat (Olho por Olho)', color: 'var(--crt-amber)', letter: 'C', class: 'copycat' },
  grudger: { name: 'Rabugento (Rancoroso)', color: '#00b4ff', letter: 'R', class: 'grudger' },
  copykitten: { name: 'Copykitten (Tolerante)', color: '#fff032', letter: 'K', class: 'copykitten' }
};

export default function Step5Evolution({ noiseProb }) {
  const [agents, setAgents] = useState(INITIAL_POPULATION);
  const [generation, setGeneration] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Reinicia a população
  const handleReset = () => {
    sound.playClick();
    setAgents(INITIAL_POPULATION);
    setGeneration(0);
  };

  // Simula uma geração
  const runGeneration = () => {
    // 1. Simular jogos entre todos os pares (rodadas repetidas de 5 turnos com ruído)
    const n = agents.length;
    const scores = Array(n).fill(0); // Acumula Anos de Prisão (menor é melhor)

    // Jogo de 5 rodadas com ruído entre o agente i e j
    const playMatch = (type1, type2) => {
      let history1 = []; // [{myAction, opponentAction}]
      let history2 = []; // [{myAction, opponentAction}]

      let p1Years = 0;
      let p2Years = 0;

      for (let r = 0; r < 5; r++) {
        // Determina a jogada pretendida por cada um
        let intent1 = 'cooperate';
        if (type1 === 'cheater') intent1 = 'defect';
        else if (type1 === 'copycat') {
          intent1 = history1.length === 0 ? 'cooperate' : history1[history1.length - 1].opponentAction;
        } else if (type1 === 'grudger') {
          intent1 = history1.some(h => h.opponentAction === 'defect') ? 'defect' : 'cooperate';
        } else if (type1 === 'copykitten') {
          if (history1.length >= 2 && 
              history1[history1.length - 1].opponentAction === 'defect' && 
              history1[history1.length - 2].opponentAction === 'defect') {
            intent1 = 'defect';
          } else {
            intent1 = 'cooperate';
          }
        }

        let intent2 = 'cooperate';
        if (type2 === 'cheater') intent2 = 'defect';
        else if (type2 === 'copycat') {
          intent2 = history2.length === 0 ? 'cooperate' : history2[history2.length - 1].opponentAction;
        } else if (type2 === 'grudger') {
          intent2 = history2.some(h => h.opponentAction === 'defect') ? 'defect' : 'cooperate';
        } else if (type2 === 'copykitten') {
          if (history2.length >= 2 && 
              history2[history2.length - 1].opponentAction === 'defect' && 
              history2[history2.length - 2].opponentAction === 'defect') {
            intent2 = 'defect';
          } else {
            intent2 = 'cooperate';
          }
        }

        // Aplica o ruído de transmissão
        let act1 = intent1;
        if (Math.random() * 100 < noiseProb) {
          act1 = intent1 === 'cooperate' ? 'defect' : 'cooperate';
        }
        let act2 = intent2;
        if (Math.random() * 100 < noiseProb) {
          act2 = intent2 === 'cooperate' ? 'defect' : 'cooperate';
        }

        // Calcula payoffs (anos de prisão)
        if (act1 === 'cooperate' && act2 === 'cooperate') {
          p1Years += 1; p2Years += 1;
        } else if (act1 === 'cooperate' && act2 === 'defect') {
          p1Years += 5; p2Years += 0;
        } else if (act1 === 'defect' && act2 === 'cooperate') {
          p1Years += 0; p2Years += 5;
        } else {
          p1Years += 3; p2Years += 3;
        }

        // Salva histórico
        history1.push({ myAction: act1, opponentAction: act2 });
        history2.push({ myAction: act2, opponentAction: act1 });
      }

      return [p1Years, p2Years];
    };

    // Todo mundo joga contra todo mundo (incluindo ele mesmo)
    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        const [y1, y2] = playMatch(agents[i], agents[j]);
        scores[i] += y1;
        scores[j] += y2;
      }
    }

    // 2. Ordenar agentes pelo desempenho (anos de prisão acumulados - menor é melhor)
    // Criamos array de índices e ordenamos
    const indices = Array.from({ length: n }, (_, idx) => idx);
    indices.sort((a, b) => scores[a] - scores[b]); // Ordem crescente de anos de prisão (melhores primeiro)

    // Criamos uma cópia da população para mutação
    let newAgents = [...agents];

    // Eliminar os 5 piores (últimos 5 índices da lista ordenada)
    // E substituir pelos 5 melhores (primeiros 5 índices)
    const bestIndices = indices.slice(0, 5);
    const worstIndices = indices.slice(n - 5);

    worstIndices.forEach((wIdx, i) => {
      const bIdx = bestIndices[i];
      newAgents[wIdx] = agents[bIdx]; // Substitui o pior por clone do melhor
    });

    // Embaralhar para não manter os clones na mesma posição da grade
    newAgents.sort(() => Math.random() - 0.5);

    setAgents(newAgents);
    setGeneration(prev => prev + 1);
  };

  // Simula múltiplos passos em background
  useEffect(() => {
    if (!isSimulating) return;
    const timer = setInterval(() => {
      runGeneration();
    }, 250);
    return () => clearInterval(timer);
  }, [isSimulating, agents]);

  // Contagem de estratégias
  const counts = agents.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, { cooperator: 0, cheater: 0, copycat: 0, grudger: 0, copykitten: 0 });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <h1 className="retro-h1">Simulador de Evolução Pop</h1>
      <p className="retro-p">
        Veja como as estratégias competem em massa ao longo de gerações. O ruído altera drasticamente a sobrevivência!
      </p>

      {/* Controles da Simulação */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button 
          className="retro-btn btn-cooperate"
          onClick={() => {
            sound.playClick();
            runGeneration();
          }}
          disabled={isSimulating}
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
        >
          Próxima Geração
        </button>

        <button 
          className={`retro-btn ${isSimulating ? 'btn-defect' : 'btn-action'}`}
          onClick={() => {
            sound.playClick();
            setIsSimulating(!isSimulating);
          }}
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
        >
          {isSimulating ? 'Pausar Auto-Sim' : 'Auto-Simular'}
        </button>

        <button 
          className="retro-btn btn-action"
          onClick={handleReset}
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
        >
          Resetar População
        </button>

        <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--crt-amber)', marginLeft: '10px' }}>
          GERAÇÃO: {generation}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', flex: 1 }}>
        {/* Painel Esquerdo: População de 25 Agentes */}
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '8px', border: '1px solid var(--crt-green-dim)' }}>
          <div style={{ fontSize: '0.75rem', color: '#8b8', textTransform: 'uppercase', marginBottom: '8px' }}>Painel da População (25 Agentes)</div>
          <div className="population-grid" style={{ maxWidth: '200px' }}>
            {agents.map((type, idx) => {
              const info = STRATEGY_INFO[type];
              return (
                <div key={idx} className={`agent-node ${info.class}`} title={info.name}>
                  {info.letter}
                </div>
              );
            })}
          </div>
        </div>

        {/* Painel Central: Gráficos de Estatísticas */}
        <div style={{ flex: '1.5 1 280px', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.3)', padding: '12px', border: '1px solid var(--crt-green-dim)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.75rem', color: '#8b8', textTransform: 'uppercase', marginBottom: '8px' }}>Censo das Estratégias</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'center' }}>
            {Object.keys(STRATEGY_INFO).map(key => {
              const count = counts[key];
              const pct = (count / 25) * 100;
              const info = STRATEGY_INFO[key];
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                  <span style={{ width: '18px', fontWeight: 'bold', color: info.color }}>{info.letter}</span>
                  <div style={{ flex: 1, height: '14px', background: '#111', border: '1px solid #333', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: info.color, transition: 'width 0.3s ease' }} />
                  </div>
                  <span style={{ width: '40px', textAlign: 'right' }}>{count} ({Math.round(pct)}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Painel Direito: Análise do Experimento */}
        <div style={{ flex: '1.2 1 240px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid var(--crt-green-dim)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--crt-amber)', textTransform: 'uppercase', marginBottom: '6px' }}>Impacto do Ruído:</div>
          <p className="retro-p" style={{ fontSize: '0.75rem', color: '#aab', marginBottom: '6px' }}>
            <strong>Com 0% de Ruído:</strong> O <em>Copycat</em> ou <em>Copykitten</em> normalmente dominam a população e eliminam os Traidores.
          </p>
          <p className="retro-p" style={{ fontSize: '0.75rem', color: '#aab', marginBottom: '6px' }}>
            <strong>Com 10% a 20% de Ruído:</strong> O <em>Copycat</em> começa a brigar consigo mesmo por engano. Os <strong>Traidores (T)</strong> crescem explorando a discórdia, mas a tolerância do <strong>Copykitten (K)</strong> pode virar o jogo!
          </p>
          <p className="retro-p" style={{ fontSize: '0.75rem', color: '#aab', marginBottom: '0' }}>
            <strong>Com &gt;35% de Ruído:</strong> O caos impossibilita qualquer cooperação e os <strong>Traidores (T)</strong> assumem o controle total.
          </p>
        </div>
      </div>
    </div>
  );
}
