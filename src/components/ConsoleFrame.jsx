import React from 'react';
import { sound } from '../utils/sound';

export default function ConsoleFrame({ children, isMuted, onToggleMute }) {
  return (
    <div className="terminal-cabinet">
      {/* Detalhes Físicos - Parafusos nos Cantos */}
      <div className="screw tl" />
      <div className="screw tr" />
      <div className="screw bl" />
      <div className="screw br" />
      
      {/* Placa de Especificação de Hardware */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '40px',
        fontSize: '0.65rem',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        display: 'flex',
        gap: '20px'
      }}>
        <span>ID: CONSOLE_PD_1984</span>
        <span>STATUS: SYSTEM_OK</span>
      </div>

      {/* Controle de Áudio / Mudo */}
      <div 
        className={`mute-switch ${isMuted ? 'active' : ''}`}
        onClick={onToggleMute}
        style={{
          position: 'absolute',
          top: '8px',
          right: '40px',
          zIndex: 100
        }}
        title="Ativar/Desativar Som"
      >
        <span style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>SOM: {isMuted ? 'OFF' : 'ON'}</span>
        <div className="mute-switch-icon" />
      </div>

      {/* O monitor e painel de controle são renderizados dentro */}
      {children}
      
      {/* Grade de Ventilação e Logotipo na Base */}
      <div style={{
        marginTop: '16px',
        borderTop: '2px solid #222',
        paddingTop: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#555',
        fontSize: '0.7rem'
      }}>
        <div style={{ display: 'flex', gap: '3px' }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{ width: '4px', height: '12px', background: '#111', borderRadius: '1px' }} />
          ))}
        </div>
        <span>MATEMÁTICA E PROBABILIDADE | DEPMIND INC.</span>
        <div style={{ display: 'flex', gap: '3px' }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{ width: '4px', height: '12px', background: '#111', borderRadius: '1px' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
