import { BOT_DOSSIERS } from '../utils/dossiers';

export default function ClipboardDossier({ currentStep, selectedBotStep3, selectedBotStep4 }) {
  
  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="paper-stamp">CONFIDENCIAL</div>
            <h2 className="paper-h2">Acordo Penal</h2>
            
            <p className="paper-p" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              ESCOLHAS DISPONÍVEIS:
            </p>
            <p className="paper-p" style={{ fontSize: '0.8rem', margin: '0 0 4px 10px' }}>
              • <strong>SILÊNCIO:</strong> Não confessa.
            </p>
            <p className="paper-p" style={{ fontSize: '0.8rem', margin: '0 0 12px 10px' }}>
              • <strong>CONFESSAR:</strong> Confessa e implica o comparsa.
            </p>
            
            <table className="paper-payoff-table">
              <thead>
                <tr>
                  <th>Você ↓ | Bot →</th>
                  <th>Silêncio</th>
                  <th>Confessar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Silêncio</th>
                  <td>Ambos:<br/><strong>1 ano</strong></td>
                  <td>Você: 5 anos<br/>Bot: Livre</td>
                </tr>
                <tr>
                  <th>Confessar</th>
                  <td>Você: Livre<br/>Bot: 5 anos</td>
                  <td>Ambos:<br/><strong>3 anos</strong></td>
                </tr>
              </tbody>
            </table>

            <p className="paper-p" style={{ fontSize: '0.75rem', marginTop: '12px', color: '#555' }}>
              <strong>Nota:</strong> Confessar é a estratégia dominante individual (Nash), mas pune ambos coletivamente.
            </p>
          </>
        );

      case 2:
        return (
          <>
            <div className="paper-stamp">INTERROGADO</div>
            <h2 className="paper-h2">Fase 2: Repetição</h2>
            
            <p className="paper-p">
              <strong>Múltiplas Rodadas (Iterado):</strong>
            </p>
            <p className="paper-p" style={{ fontSize: '0.8rem', margin: '0 0 12px 10px' }}>
              • Introduz punição e retaliação futuras.<br/>
              • A ameaça de confissão sustenta o silêncio mútuo.
            </p>
            
            <p className="paper-p" style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              OPONENTE ATUAL: COPYCAT
            </p>
            <p className="paper-p" style={{ fontSize: '0.8rem', margin: '0 0 4px 10px' }}>
              1. Começa em silêncio.<br/>
              2. Copia exatamente sua jogada anterior.
            </p>
          </>
        );

      case 3: {
        const bot3 = BOT_DOSSIERS[selectedBotStep3] || BOT_DOSSIERS.copycat;
        return (
          <>
            <div className="paper-stamp" style={{ borderColor: '#b27722', color: '#b27722' }}>ARQUIVADO</div>
            <h2 className="paper-h2">Ficha do Oponente</h2>
            
            <p className="paper-p" style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#000', marginBottom: '8px' }}>
              TIPO: {bot3.name}
            </p>
            
            <p className="paper-p" style={{ fontSize: '0.8rem', marginBottom: '10px' }}>
              • <strong>Lógica:</strong> {bot3.desc}
            </p>
            
            <p className="paper-p" style={{ fontSize: '0.75rem', color: '#555', borderTop: '1px dashed #bbb', paddingTop: '8px' }}>
              • <strong>Perfil:</strong> {bot3.dossier}
            </p>
          </>
        );
      }

      case 4: {
        const bot4Name = selectedBotStep4 === 'copycat' ? 'Copycat' : 'Copykitten';
        const bot4Desc = selectedBotStep4 === 'copycat' 
          ? 'Vingativo. Retalia a qualquer delação.'
          : 'Tolerante. Só retalia se for traído 2 vezes seguidas.';
        return (
          <>
            <div className="paper-stamp" style={{ borderColor: 'navy', color: 'navy' }}>ESTATÍSTICA</div>
            <h2 className="paper-h2">Ruído (Acaso)</h2>
            
            <p className="paper-p">
              <strong>Erro de Canal (Probabilidade p):</strong>
            </p>
            <p className="paper-p" style={{ fontSize: '0.8rem', margin: '0 0 10px 10px' }}>
              • Chance de inverter sua ação na rede.<br/>
              • Silêncio planejado → Confessar enviado (por erro).
            </p>

            <p className="paper-p" style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              COMPORTAMENTO COM RUÍDO:
            </p>
            <p className="paper-p" style={{ fontSize: '0.8rem', margin: '0 0 4px 10px' }}>
              • <strong>Copycat:</strong> Espiral infinito de retaliações.<br/>
              • <strong>{bot4Name}:</strong> {bot4Desc}
            </p>
          </>
        );
      }

      case 5:
        return (
          <>
            <div className="paper-stamp">EVOLUTIVO</div>
            <h2 className="paper-h2">Seleção Natural</h2>
            
            <p className="paper-p">
              <strong>Torneio de 25 Agentes:</strong>
            </p>
            <p className="paper-p" style={{ fontSize: '0.8rem', margin: '0 0 10px 10px' }}>
              • Todos jogam contra todos (5 rodadas).<br/>
              • Acumulam penas de prisão.
            </p>

            <p className="paper-p" style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              REPRODUÇÃO POR GERAÇÃO:
            </p>
            <p className="paper-p" style={{ fontSize: '0.8rem', margin: '0 0 4px 10px' }}>
              • <strong>Eliminação:</strong> Corta os 5 piores.<br/>
              • <strong>Clonagem:</strong> Duplica os 5 melhores.
            </p>
          </>
        );

      case 6:
        return (
          <>
            <div className="paper-stamp" style={{ borderColor: 'green', color: 'green' }}>CONCLUÍDO</div>
            <h2 className="paper-h2">Relatório Geral</h2>
            
            <p className="paper-p" style={{ fontWeight: 'bold', marginBottom: '6px' }}>
              REQUISITOS DA CONFIANÇA:
            </p>
            
            <p className="paper-p" style={{ fontSize: '0.8rem', margin: '0 0 6px 10px' }}>
              1. <strong>Repetição (Futuro):</strong> Relações contínuas reduzem o incentivo a confessar.
            </p>
            
            <p className="paper-p" style={{ fontSize: '0.8rem', margin: '0 0 6px 10px' }}>
              2. <strong>Soma Não-Zero:</strong> Cooperação mútua gera ganho real para ambos.
            </p>
            
            <p className="paper-p" style={{ fontSize: '0.8rem', margin: '0 0 6px 10px' }}>
              3. <strong>Perdão (Ruído):</strong> Tolerância impede espirais de ódio em canais com ruído.
            </p>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="paper-clipboard">
      <div className="clipboard-clip" />
      <div className="paper-sheet">
        <div className="paper-sheet-header">
          <span>CASO: DILEMA DE CONFISSÃO</span>
          <span>FLH: 0{currentStep}</span>
        </div>
        
        {renderContent()}

        <div className="paper-footer">
          DEPARTAMENTO DE TEORIA DOS JOGOS
        </div>
      </div>
    </div>
  );
}
