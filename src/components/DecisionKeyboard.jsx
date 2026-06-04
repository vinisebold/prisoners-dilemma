import { sound } from '../utils/sound';

export default function DecisionKeyboard({ onCooperate, onDefect, show = false, disabled = false }) {
  const isDisabled = !show || disabled;

  const handleCooperate = () => {
    if (isDisabled) return;
    sound.playClick();
    onCooperate();
  };

  const handleDefect = () => {
    if (isDisabled) return;
    sound.playClick();
    onDefect();
  };

  return (
    <div className={`decision-keyboard-deck ${isDisabled ? 'deck-disabled' : ''} ${!show ? 'deck-offline' : ''}`}>
      {/* Parafusos Allen/Torx Vintage nos cantos */}
      <div className="deck-screw tl" />
      <div className="deck-screw tr" />
      <div className="deck-screw bl" />
      <div className="deck-screw br" />

      {/* Bezel prateado de metal escovado que agrupa ambos os botões */}
      <div className="deck-inner-bezel">
        {/* Soquete do botão Cooperar */}
        <div className="deck-button-socket socket-cooperate">
          <button
            className="deck-button-cap deck-btn-cooperate"
            onClick={handleCooperate}
            disabled={isDisabled}
            title="Cooperar"
          >
            {/* Componentes físicos simulados sob o vidro translúcido */}
            <span className="btn-stem" />
            <span className="btn-bulb-housing">
              <span className="btn-bulb-filament" />
            </span>
            <span className="btn-light" />
            <span className="btn-glass-glare" />
            <span className="btn-label">Cooperar</span>
          </button>
        </div>

        {/* Soquete do botão Delatar */}
        <div className="deck-button-socket socket-defect">
          <button
            className="deck-button-cap deck-btn-defect"
            onClick={handleDefect}
            disabled={isDisabled}
            title="Delatar"
          >
            {/* Componentes físicos simulados sob o vidro translúcido */}
            <span className="btn-stem" />
            <span className="btn-bulb-housing">
              <span className="btn-bulb-filament" />
            </span>
            <span className="btn-light" />
            <span className="btn-glass-glare" />
            <span className="btn-label">Delatar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
