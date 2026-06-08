import { useState } from 'react';
import { sound } from '../utils/sound';

export default function DecisionKeyboard({ onCooperate, onDefect, show = false, disabled = false }) {
  const isDisabled = !show || disabled;
  const [pressedChoice, setPressedChoice] = useState(null);

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

  const getHitboxProps = (choice, onChoose, title) => ({
    type: 'button',
    className: 'deck-button-hitbox',
    onPointerDown: () => {
      if (!isDisabled) setPressedChoice(choice);
    },
    onPointerUp: () => setPressedChoice(null),
    onPointerLeave: () => setPressedChoice(null),
    onPointerCancel: () => setPressedChoice(null),
    onKeyDown: (event) => {
      if (!isDisabled && (event.key === ' ' || event.key === 'Enter')) {
        setPressedChoice(choice);
      }
    },
    onKeyUp: () => setPressedChoice(null),
    onBlur: () => {
      setPressedChoice(null);
    },
    onClick: onChoose,
    disabled: isDisabled,
    title,
    'aria-label': title
  });

  return (
    <div className={`decision-keyboard-shell ${isDisabled ? 'deck-disabled' : ''} ${!show ? 'deck-offline' : ''}`}>
      <div className={`decision-keyboard-deck ${isDisabled ? 'deck-disabled' : ''} ${!show ? 'deck-offline' : ''}`}>
        {/* Parafusos Allen/Torx Vintage nos cantos */}
        <div className="deck-screw tl" />
        <div className="deck-screw tr" />
        <div className="deck-screw bl" />
        <div className="deck-screw br" />

        {/* Bezel prateado de metal escovado que agrupa ambos os botões */}
        <div className="deck-inner-bezel">
          {/* Soquete do botão Silêncio */}
          <div className="deck-button-socket socket-cooperate">
            <div
              className={`deck-button-cap deck-btn-cooperate ${isDisabled ? 'is-disabled' : ''} ${pressedChoice === 'cooperate' ? 'is-pressed' : ''}`}
              aria-hidden="true"
            >
              {/* Componentes físicos simulados sob o vidro translúcido */}
              <span className="btn-stem" />
              <span className="btn-bulb-housing">
                <span className="btn-bulb-filament" />
              </span>
              <span className="btn-light" />
              <span className="btn-glass-glare" />
              <span className="btn-label">Silêncio</span>
            </div>
          </div>

          {/* Soquete do botão Confessar */}
          <div className="deck-button-socket socket-defect">
            <div
              className={`deck-button-cap deck-btn-defect ${isDisabled ? 'is-disabled' : ''} ${pressedChoice === 'defect' ? 'is-pressed' : ''}`}
              aria-hidden="true"
            >
              {/* Componentes físicos simulados sob o vidro translúcido */}
              <span className="btn-stem" />
              <span className="btn-bulb-housing">
                <span className="btn-bulb-filament" />
              </span>
              <span className="btn-light" />
              <span className="btn-glass-glare" />
              <span className="btn-label">Confessar</span>
            </div>
          </div>
        </div>
      </div>

      <div className="decision-keyboard-hit-layer">
        <div className="deck-hitbox-bezel">
          <button {...getHitboxProps('cooperate', handleCooperate, 'Silêncio')} />
          <button {...getHitboxProps('defect', handleDefect, 'Confessar')} />
        </div>
      </div>
    </div>
  );
}
