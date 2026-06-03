import { useState } from 'react';
import { sound } from '../utils/sound';

export default function SettingsMenu({ onClose, theme, setTheme, onVolumeChange, onHumChange }) {
  const [vol, setVol] = useState(sound.getVolume());
  const [muted, setMuted] = useState(sound.getMute());
  const [hum, setHum] = useState(sound.getHumEnabled());

  const handleMuteToggle = () => {
    const isMuted = sound.toggleMute();
    setMuted(isMuted);
    sound.playClick();
    if (onVolumeChange) onVolumeChange();
  };

  const handleVolumeAdjust = (diff) => {
    const currentVolume = sound.getVolume();
    const newVol = Math.max(0, Math.min(1, Math.round((currentVolume + diff) * 10) / 10));
    sound.setVolume(newVol);
    setVol(newVol);
    if (sound.getMute()) {
      sound.setMute(false);
      setMuted(false);
    }
    sound.playClick();
    if (onVolumeChange) onVolumeChange();
  };

  const handleVolumePreset = (preset) => {
    sound.setVolume(preset);
    setVol(preset);
    if (sound.getMute()) {
      sound.setMute(false);
      setMuted(false);
    }
    sound.playClick();
    if (onVolumeChange) onVolumeChange();
  };

  const handleHumToggle = () => {
    const currentHum = sound.getHumEnabled();
    sound.setHumEnabled(!currentHum);
    setHum(!currentHum);
    sound.playClick();
    if (onHumChange) onHumChange();
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    sound.playClick();
  };

  const getVolumeBar = () => {
    if (muted) return '[MUDO] 🔇';
    const bars = Math.round(vol * 10);
    return '[' + '█'.repeat(bars) + '░'.repeat(10 - bars) + `] ${Math.round(vol * 100)}%`;
  };

  return (
    <div className="settings-menu">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* Seção Áudio */}
        <div className="settings-section">
          <div className="settings-section-title">Controle de Áudio</div>
          <div className="volume-bar-container">
            <span style={{ fontSize: '0.75rem', color: '#888' }}>VOLUME:</span>
            <span className="volume-bar">{getVolumeBar()}</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="settings-btn-group">
              <button className="settings-btn" onClick={() => handleVolumeAdjust(-0.1)} disabled={muted || vol <= 0}>
                [ Vol - ]
              </button>
              <button className="settings-btn" onClick={() => handleVolumeAdjust(0.1)} disabled={muted || vol >= 1}>
                [ Vol + ]
              </button>
              <button className={`settings-btn ${muted ? 'active' : ''}`} onClick={handleMuteToggle}>
                [ {muted ? 'Ativar Som' : 'Mudo'} ]
              </button>
            </div>
            
            <div className="settings-btn-group" style={{ alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#666' }}>PRESETS:</span>
              {[0.2, 0.5, 0.8, 1.0].map((preset) => (
                <button
                  key={preset}
                  className={`settings-btn ${vol === preset && !muted ? 'active' : ''}`}
                  onClick={() => handleVolumePreset(preset)}
                >
                  {preset * 100}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Seção Fósforo */}
        <div className="settings-section">
          <div className="settings-section-title">Fósforo do Monitor (Tema)</div>
          <div className="settings-btn-group">
            <button 
              className={`settings-btn ${theme === 'green' ? 'active' : ''}`} 
              onClick={() => handleThemeChange('green')}
            >
              Verde Fósforo
            </button>
            <button 
              className={`settings-btn ${theme === 'amber' ? 'active' : ''}`} 
              onClick={() => handleThemeChange('amber')}
            >
              Âmbar Clássico
            </button>
            <button 
              className={`settings-btn ${theme === 'red' ? 'active' : ''}`} 
              onClick={() => handleThemeChange('red')}
            >
              Vermelho Alerta
            </button>
          </div>
        </div>

        {/* Seção Zumbido */}
        <div className="settings-section">
          <div className="settings-section-title">Zumbido de Rede (Hum CRT)</div>
          <div className="settings-row">
            <span style={{ fontSize: '0.75rem', color: '#888' }}>
              ZUMBIDO CRT: <span style={{ color: hum ? 'var(--crt-green)' : '#888', fontWeight: 'bold' }}>{hum ? 'ATIVADO' : 'DESATIVADO'}</span>
            </span>
            <button className={`settings-btn ${hum ? 'active' : ''}`} onClick={handleHumToggle}>
              [ Alternar ]
            </button>
          </div>
        </div>

      </div>

      <button className="settings-close-btn" onClick={() => { sound.playClick(); onClose(); }}>
        Concluir e Retornar
      </button>
    </div>
  );
}
