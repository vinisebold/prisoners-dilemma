import { sound } from '../utils/sound';

export default function ControlPanel({
  onCooperate,
  onDefect,
  onNext,
  onPrev,
  onReset,
  showCooperateDefect = false,
  cooperateDefectDisabled = false,
  showNext = true,
  nextActive = false,
  noiseProb = 0,
  onNoiseChange = null,
  showNoise = false,
  noiseDisabled = false,
  currentStep = 1,
  totalSteps = 6
}) {
  
  const handleCooperate = () => {
    sound.playClick();
    onCooperate();
  };

  const handleDefect = () => {
    sound.playClick();
    onDefect();
  };

  const handleNext = () => {
    sound.playClick();
    onNext();
  };

  const handlePrev = () => {
    sound.playClick();
    onPrev();
  };

  const handleReset = () => {
    sound.playClick();
    onReset();
  };

  return (
    <div className="control-panel">
      {/* Grupo Esquerdo: Navegação Geral */}
      <div className="panel-group">
        <span className="panel-group-label">Sistema</span>
        <button 
          className="retro-btn btn-action" 
          onClick={handlePrev}
          disabled={currentStep === 1}
          style={{ padding: '8px 12px', fontSize: '0.8rem' }}
        >
          &lt; Voltar
        </button>
        <button 
          className="retro-btn btn-action" 
          onClick={handleReset}
          style={{ padding: '8px 12px', fontSize: '0.8rem' }}
        >
          Reiniciar
        </button>
      </div>

      {/* Grupo Central: Botões de Decisão */}
      {showCooperateDefect && (
        <div className="panel-group">
          <span className="panel-group-label">Decisão do Prisioneiro</span>
          <button 
            className="retro-btn btn-cooperate"
            onClick={handleCooperate}
            disabled={cooperateDefectDisabled}
          >
            Cooperar
          </button>
          <button 
            className="retro-btn btn-defect"
            onClick={handleDefect}
            disabled={cooperateDefectDisabled}
          >
            Delatar
          </button>
        </div>
      )}

      {/* Grupo de Parâmetros de Probabilidade (Ruído) */}
      {showNoise && (
        <div className="panel-group">
          <span className="panel-group-label">Transmissão (Ruído)</span>
          <div className="retro-slider-container">
            <div className="retro-slider-label">
              <span>Taxa de Erro:</span>
              <span style={{ color: noiseProb > 0 ? 'var(--crt-amber)' : 'var(--crt-green)' }}>
                {noiseProb}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50" 
              step="5"
              value={noiseProb}
              onChange={(e) => {
                sound.playClick();
                onNoiseChange(parseInt(e.target.value));
              }}
              disabled={noiseDisabled}
              className="retro-slider"
            />
          </div>
          <span className={`led ${noiseProb > 0 ? 'amber on' : 'green on'}`} style={{ alignSelf: 'flex-end', marginBottom: '6px' }} />
        </div>
      )}

      {/* Grupo Direito: Progresso */}
      {showNext && (
        <div className="panel-group">
          <span className="panel-group-label">Fase</span>
          <button 
            className={`retro-btn ${nextActive ? 'btn-next' : 'btn-action'}`}
            onClick={handleNext}
            style={{ minWidth: '100px' }}
          >
            {currentStep === totalSteps ? 'Fim' : 'Avançar &gt;'}
          </button>
        </div>
      )}
    </div>
  );
}
