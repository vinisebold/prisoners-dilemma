import { useState, useEffect } from 'react';
import { sound } from '../utils/sound';

export default function SettingsMenu({ onClose, theme, setTheme, onVolumeChange, onHumChange }) {
  const [vol, setVol] = useState(sound.getVolume());
  const [muted, setMuted] = useState(sound.getMute());
  const [hum, setHum] = useState(sound.getHumEnabled());
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Efeito de Carregamento TUI (Acelerado para 800ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

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

  // Tela de Loading TUI Simplificada (Apenas barra de carregamento centralizada)
  if (loading) {
    const bars = Math.round(progress / 10);

    return (
      <div className="settings-loading-screen" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontFamily: 'var(--font-mono)',
        color: 'inherit',
        padding: '20px'
      }}>
        <div style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
          [{'█'.repeat(bars)}{'░'.repeat(10 - bars)}] {progress}%
        </div>
      </div>
    );
  }

  return (
    <div className="settings-menu">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Seção Áudio */}
        <div className="settings-section">
          <div className="settings-section-title">┌─── CONTROLE DE ÁUDIO ───┐</div>
          
          <div className="volume-bar-container" style={{ margin: '6px 0 10px 0' }}>
            <span style={{ fontSize: '0.75rem', opacity: 0.65 }}>VOLUME ATUAL:</span>
            <span className="volume-bar">{getVolumeBar()}</span>
          </div>
          
          <div className="settings-btn-group">
            <button className="settings-btn" onClick={() => handleVolumeAdjust(-0.1)} disabled={muted || vol <= 0}>
              [ VOL - ]
            </button>
            <button className="settings-btn" onClick={() => handleVolumeAdjust(0.1)} disabled={muted || vol >= 1}>
              [ VOL + ]
            </button>
            <button className={`settings-btn ${muted ? 'active' : ''}`} onClick={handleMuteToggle}>
              [ {muted ? 'ATIVAR SOM' : 'MUDO'} ]
            </button>
          </div>
        </div>

        {/* Seção Fósforo */}
        <div className="settings-section">
          <div className="settings-section-title">┌─── FÓSFORO DO MONITOR ───┐</div>
          <div className="settings-btn-group">
            <button 
              className={`settings-btn ${theme === 'green' ? 'active' : ''}`} 
              onClick={() => handleThemeChange('green')}
            >
              [ VERDE FÓSFORO ]
            </button>
            <button 
              className={`settings-btn ${theme === 'amber' ? 'active' : ''}`} 
              onClick={() => handleThemeChange('amber')}
            >
              [ ÂMBAR CLÁSSICO ]
            </button>
            <button 
              className={`settings-btn ${theme === 'red' ? 'active' : ''}`} 
              onClick={() => handleThemeChange('red')}
            >
              [ VERMELHO ALERTA ]
            </button>
          </div>
        </div>

        {/* Seção Zumbido */}
        <div className="settings-section">
          <div className="settings-section-title">┌─── ZUMBIDO DE REDE ───┐</div>
          <div className="settings-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', opacity: 0.65 }}>
              STATUS DO HUM CRT: <span style={{ color: 'inherit', fontWeight: 'bold', textDecoration: 'underline' }}>{hum ? 'ATIVADO' : 'DESATIVADO'}</span>
            </span>
            <button className={`settings-btn ${hum ? 'active' : ''}`} onClick={handleHumToggle}>
              [ ALTERNAR ]
            </button>
          </div>
        </div>

      </div>

      <button className="settings-close-btn" onClick={() => { sound.playClick(); onClose(); }}>
        [ CONCLUIR E RETORNAR ]
      </button>
    </div>
  );
}
