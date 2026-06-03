// Utilidade de sintetização de som usando Web Audio API (procedural)
// Evita dependência de arquivos de áudio externos (.mp3/.wav)

let audioCtx = null;
let masterGain = null;
let humOscillator = null;
let humGain = null;
let isMuted = localStorage.getItem('game_muted') === 'true';
let volume = parseFloat(localStorage.getItem('game_volume') ?? '0.8');
let humEnabled = localStorage.getItem('game_hum_enabled') !== 'false';

function initAudio() {
  if (audioCtx) return;
  
  // Cria contexto de áudio se ainda não existir
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();
  
  // Nó de ganho mestre para controle de mudo
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(isMuted ? 0 : volume, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);
}

export const sound = {
  setVolume: (v) => {
    volume = Math.max(0, Math.min(1, v));
    localStorage.setItem('game_volume', String(volume));
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume, audioCtx.currentTime);
    }
  },
  
  getVolume: () => volume,

  setMute: (mute) => {
    isMuted = mute;
    localStorage.setItem('game_muted', String(mute));
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(mute ? 0 : volume, audioCtx.currentTime);
    }
  },
  
  toggleMute: () => {
    isMuted = !isMuted;
    localStorage.setItem('game_muted', String(isMuted));
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume, audioCtx.currentTime);
    }
    return isMuted;
  },
  
  getMute: () => isMuted,

  setHumEnabled: (enabled) => {
    humEnabled = enabled;
    localStorage.setItem('game_hum_enabled', String(enabled));
    if (enabled) {
      sound.startCrtHum();
    } else {
      sound.stopCrtHum();
    }
  },

  getHumEnabled: () => humEnabled,
  
  // Som de clique mecânico do interruptor/botão
  playClick: () => {
    try {
      initAudio();
      if (isMuted || !audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      const t = audioCtx.currentTime;
      
      // Clique de alta frequência rápido
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1000, t);
      osc1.frequency.exponentialRampToValueAtTime(100, t + 0.05);
      
      gain1.gain.setValueAtTime(0.15, t);
      gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
      
      osc1.connect(gain1);
      gain1.connect(masterGain);
      
      osc1.start(t);
      osc1.stop(t + 0.05);
      
      // Ruído metálico simulado com oscilador secundário
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(150, t);
      osc2.frequency.exponentialRampToValueAtTime(40, t + 0.08);
      
      gain2.gain.setValueAtTime(0.2, t);
      gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      
      osc2.connect(gain2);
      gain2.connect(masterGain);
      
      osc2.start(t);
      osc2.stop(t + 0.08);
    } catch (e) {
      console.warn("Falha ao tocar som de clique:", e);
    }
  },
  
  // Bip retro informativo curto
  playBeep: () => {
    try {
      initAudio();
      if (isMuted || !audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, t); // Lá (A5)
      
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start(t);
      osc.stop(t + 0.12);
    } catch (e) {
      console.warn("Falha ao tocar bip:", e);
    }
  },
  
  // Som de erro/traição de tom baixo
  playFailure: () => {
    try {
      initAudio();
      if (isMuted || !audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.linearRampToValueAtTime(80, t + 0.25);
      
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.linearRampToValueAtTime(0.001, t + 0.25);
      
      // Filtro passa-baixa para deixar mais abafado e menos áspero
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, t);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      osc.start(t);
      osc.stop(t + 0.25);
    } catch (e) {
      console.warn("Falha ao tocar som de falha:", e);
    }
  },

  // Sucesso/Chime para conquistas
  playChime: () => {
    try {
      initAudio();
      if (isMuted || !audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      const t = audioCtx.currentTime;
      
      const playTone = (freq, start, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.06, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(start);
        osc.stop(start + duration);
      };
      
      playTone(523.25, t, 0.15);      // C5
      playTone(659.25, t + 0.08, 0.15); // E5
      playTone(783.99, t + 0.16, 0.3);  // G5
      playTone(1046.50, t + 0.24, 0.4); // C6
    } catch (e) {
      console.warn("Falha ao tocar chime:", e);
    }
  },

  // Zumbido elétrico de fundo da tela CRT (hum)
  startCrtHum: () => {
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      if (humOscillator) return; // já rodando
      if (!humEnabled) return; // se desativado, não faz nada
      
      const t = audioCtx.currentTime;
      
      // Oscilador de 60Hz para emular zumbido da rede elétrica americana/filamento CRT
      humOscillator = audioCtx.createOscillator();
      humGain = audioCtx.createGain();
      
      // Onda dente de serra levemente filtrada
      humOscillator.type = 'triangle';
      humOscillator.frequency.setValueAtTime(60, t);
      
      // Ganho extremamente baixo para ser sutil
      humGain.gain.setValueAtTime(isMuted ? 0 : 0.015, t);
      
      // Filtro passa-baixa para embaçar o som
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, t);
      
      humOscillator.connect(filter);
      filter.connect(humGain);
      humGain.connect(masterGain || audioCtx.destination);
      
      humOscillator.start(t);
    } catch (e) {
      console.warn("Falha ao iniciar zumbido CRT:", e);
    }
  },
  
  stopCrtHum: () => {
    try {
      if (humOscillator) {
        humOscillator.stop();
        humOscillator.disconnect();
        humOscillator = null;
        humGain = null;
      }
    } catch (e) {
      console.warn("Falha ao parar zumbido CRT:", e);
    }
  },
  
  updateHumGain: () => {
    if (humGain && audioCtx) {
      humGain.gain.setValueAtTime((isMuted || !humEnabled) ? 0 : 0.015, audioCtx.currentTime);
    }
  }
};
