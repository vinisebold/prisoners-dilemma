import { sound } from '../../utils/sound';
import { BOT_DOSSIERS } from '../../utils/dossiers';

export default function Step3Strategies({
  selectedBot,
  onBotChange,
  roundsPlayed,
  onResetMatch
}) {
  const maxRounds = 5;
  const isFinished = roundsPlayed >= maxRounds;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', animation: 'crt-flicker 0.15s infinite' }}>
      <h1 className="retro-h1">Galeria de Estratégias</h1>
      <p className="retro-p">
        Selecione seu oponente para testar suas táticas em uma partida de 5 rodadas.
      </p>

      {/* Seleção do Bot */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '14px 0', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
          <label style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Oponente Selecionado:</label>
          <select 
            value={selectedBot}
            onChange={(e) => {
              sound.playClick();
              onBotChange(e.target.value);
            }}
            className="retro-select"
            disabled={roundsPlayed > 0 && !isFinished}
          >
            {Object.keys(BOT_DOSSIERS).map(key => (
              <option key={key} value={key}>{BOT_DOSSIERS[key].name}</option>
            ))}
          </select>
        </div>

        <button 
          className="retro-btn btn-action" 
          onClick={onResetMatch}
          style={{ padding: '8px 14px', fontSize: '0.8rem', marginTop: '16px' }}
        >
          Reiniciar Partida
        </button>
      </div>

      <div className="crt-alert" style={{ borderStyle: 'solid', borderColor: 'var(--crt-amber)', background: 'rgba(255, 176, 0, 0.05)', color: 'var(--crt-amber)', fontSize: '0.85rem' }}>
        <strong>INSTRUÇÃO:</strong> O perfil psicológico e a lógica detalhada do bot selecionado foram carregados na <strong>Prancheta (Esquerda)</strong>. 
        Os resultados de cada rodada estão sendo impressos no <strong>Ticket (Direita)</strong>.
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <div className="stat-box" style={{ minWidth: '180px' }}>
          <div style={{ fontSize: '0.7rem', color: '#888' }}>RODADA ATUAL</div>
          <div className="stat-box-val" style={{ color: 'var(--crt-green)' }}>
            {isFinished ? 'PARTIDA CONCLUÍDA' : `${roundsPlayed + 1} / ${maxRounds}`}
          </div>
        </div>
      </div>
    </div>
  );
}
