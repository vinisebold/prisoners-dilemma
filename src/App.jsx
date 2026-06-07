import { useState, useEffect } from 'react';
import ConsoleFrame from './components/ConsoleFrame';
import CrtScreen from './components/CrtScreen';
import ControlPanel from './components/ControlPanel';
import DecisionKeyboard from './components/DecisionKeyboard';
import ClipboardDossier from './components/ClipboardDossier';
import SecondaryMonitor from './components/SecondaryMonitor';
import Step1Intro from './components/steps/Step1Intro';
import Step2Repeated from './components/steps/Step2Repeated';
import Step3Strategies from './components/steps/Step3Strategies';
import Step4Noise from './components/steps/Step4Noise';
import Step5Evolution from './components/steps/Step5Evolution';
import Step6Conclusion from './components/steps/Step6Conclusion';
import SettingsMenu from './components/SettingsMenu';
import Menu from './components/Menu';
import IntroStory from './components/IntroStory';
import LampLightCanvas from './components/LampLightCanvas';
import { sound } from './utils/sound';
import './App.css';

const TOTAL_STEPS = 6;

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [noiseProb, setNoiseProb] = useState(15); // Ruído padrão para etapas 4 e 5
  
  // Ajustes de Sistema
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('game_theme') || 'green');
  const [, setVolume] = useState(sound.getVolume());
  const [, setHumEnabled] = useState(sound.getHumEnabled());

  // --- Estados do Jogo por Etapa ---
  
  // Etapa 1: Intro
  const [step1PlayState, setStep1PlayState] = useState('waiting'); // 'waiting', 'played'
  const [step1PlayerChoice, setStep1PlayerChoice] = useState(null);
  const [step1BotChoice, setStep1BotChoice] = useState(null);

  // Etapa 2: Iterado Básico (5 rodadas contra Copycat)
  const [step2RoundsPlayed, setStep2RoundsPlayed] = useState(0);
  const [step2History, setStep2History] = useState([]);
  const [step2PlayerScore, setStep2PlayerScore] = useState(0);
  const [step2BotScore, setStep2BotScore] = useState(0);

  // Etapa 3: Galeria de Estratégias
  const [step3SelectedBot, setStep3SelectedBot] = useState('copycat');
  const [step3RoundsPlayed, setStep3RoundsPlayed] = useState(0);
  const [step3History, setStep3History] = useState([]);
  const [step3PlayerScore, setStep3PlayerScore] = useState(0);
  const [step3BotScore, setStep3BotScore] = useState(0);

  // Etapa 4: Ruído
  const [step4SelectedBot, setStep4SelectedBot] = useState('copycat');
  const [step4RoundsPlayed, setStep4RoundsPlayed] = useState(0);
  const [step4History, setStep4History] = useState([]);
  const [step4PlayerScore, setStep4PlayerScore] = useState(0);
  const [step4BotScore, setStep4BotScore] = useState(0);

  const [showMenu, setShowMenu] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  const handleStartGame = () => {
    sound.playClick();
    setShowMenu(false);
    setShowIntro(true);
  };

  const handleDismissIntro = () => {
    sound.playClick();
    setShowIntro(false);
  };

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e) => {
      if (e.key === 'Enter') handleStartGame();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showMenu]);

  useEffect(() => {
    if (!showIntro) return;
    const handler = (e) => {
      if (e.key === 'Enter') handleDismissIntro();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showIntro]);

  // --- Efeitos de Inicialização ---
  useEffect(() => {
    // Inicia o zumbido de eletricidade estática da tela CRT
    sound.startCrtHum();
    return () => {
      sound.stopCrtHum();
    };
  }, []);

  // Monitora mudança de tema
  useEffect(() => {
    document.body.className = `theme-${theme}${isSettingsOpen ? ' settings-open' : ''}${showMenu ? ' menu-open' : ''}${showIntro ? ' intro-open' : ''}`;
    localStorage.setItem('game_theme', theme);
  }, [theme, isSettingsOpen, showMenu, showIntro]);

  // --- Função para calcular payoffs ---
  const calculatePayoff = (p1, p2) => {
    if (p1 === 'cooperate' && p2 === 'cooperate') return [1, 1];
    if (p1 === 'cooperate' && p2 === 'defect') return [5, 0];
    if (p1 === 'defect' && p2 === 'cooperate') return [0, 5];
    return [3, 3];
  };

  // --- Lógica de Decisão das Estratégias ---
  const getBotDecision = (botType, myHistory) => {
    if (myHistory.length === 0) return 'cooperate';

    switch (botType) {
      case 'always_cooperate':
        return 'cooperate';
        
      case 'always_defect':
        return 'defect';

      case 'copycat':
        return myHistory[myHistory.length - 1].playerChoice;

      case 'grudger': {
        const hasPlayerDefected = myHistory.some(round => round.playerChoice === 'defect');
        return hasPlayerDefected ? 'defect' : 'cooperate';
      }

      case 'detective': {
        const roundNum = myHistory.length + 1;
        if (roundNum === 1) return 'cooperate';
        if (roundNum === 2) return 'defect';
        if (roundNum === 3) return 'cooperate';
        if (roundNum === 4) return 'cooperate';

        const playedDefectedOpening = myHistory.slice(0, 4).some(round => round.playerChoice === 'defect');
        if (playedDefectedOpening) {
          return myHistory[myHistory.length - 1].playerChoice;
        } else {
          return 'defect';
        }
      }

      case 'copykitten': {
        if (myHistory.length < 2) return 'cooperate';
        const last1 = myHistory[myHistory.length - 1].playerChoice;
        const last2 = myHistory[myHistory.length - 2].playerChoice;
        if (last1 === 'defect' && last2 === 'defect') {
          return 'defect';
        }
        return 'cooperate';
      }

      default:
        return 'cooperate';
    }
  };

  // --- Jogadas por Etapa ---

  // Jogar Etapa 1
  const handlePlayStep1 = (choice) => {
    console.log("handlePlayStep1 chamado com escolha:", choice, "Estado atual:", step1PlayState);
    if (step1PlayState !== 'waiting') return;
    
    setStep1PlayerChoice(choice);
    setStep1BotChoice('defect');
    setStep1PlayState('played');

    if (choice === 'cooperate') {
      sound.playFailure();
    } else {
      sound.playBeep();
    }
  };

  // Jogar Etapa 2
  const handlePlayStep2 = (choice) => {
    console.log("handlePlayStep2 chamado com escolha:", choice, "Rodada:", step2RoundsPlayed);
    if (step2RoundsPlayed >= 5) return;

    const botChoice = getBotDecision('copycat', step2History);
    const [pPayoff, bPayoff] = calculatePayoff(choice, botChoice);

    const newHistory = [
      ...step2History,
      { playerChoice: choice, botChoice, playerPayoff: pPayoff, botPayoff: bPayoff }
    ];

    setStep2History(newHistory);
    setStep2PlayerScore(prev => prev + pPayoff);
    setStep2BotScore(prev => prev + bPayoff);
    setStep2RoundsPlayed(prev => prev + 1);

    if (choice === 'defect' || botChoice === 'defect') {
      sound.playFailure();
    } else {
      sound.playBeep();
    }

    if (step2RoundsPlayed + 1 === 5) {
      setTimeout(() => sound.playChime(), 600);
    }
  };

  // Jogar Etapa 3
  const handlePlayStep3 = (choice) => {
    console.log("handlePlayStep3 chamado com escolha:", choice, "Oponente:", step3SelectedBot, "Rodada:", step3RoundsPlayed);
    if (step3RoundsPlayed >= 5) return;

    const botChoice = getBotDecision(step3SelectedBot, step3History);
    const [pPayoff, bPayoff] = calculatePayoff(choice, botChoice);

    const newHistory = [
      ...step3History,
      { playerChoice: choice, botChoice, playerPayoff: pPayoff, botPayoff: bPayoff }
    ];

    setStep3History(newHistory);
    setStep3PlayerScore(prev => prev + pPayoff);
    setStep3BotScore(prev => prev + bPayoff);
    setStep3RoundsPlayed(prev => prev + 1);

    if (choice === 'defect' || botChoice === 'defect') {
      sound.playFailure();
    } else {
      sound.playBeep();
    }

    if (step3RoundsPlayed + 1 === 5) {
      setTimeout(() => sound.playChime(), 600);
    }
  };

  // Jogar Etapa 4 (com Ruído Probabilístico)
  const handlePlayStep4 = (choice) => {
    console.log("handlePlayStep4 chamado com escolha:", choice, "Ruído:", noiseProb, "Oponente:", step4SelectedBot, "Rodada:", step4RoundsPlayed);
    if (step4RoundsPlayed >= 7) return;

    const botIntended = getBotDecision(step4SelectedBot, step4History);

    let playerTransmitted = choice;
    let playerFlipped = false;
    if (Math.random() * 100 < noiseProb) {
      playerTransmitted = choice === 'cooperate' ? 'defect' : 'cooperate';
      playerFlipped = true;
    }

    let botTransmitted = botIntended;
    let botFlipped = false;
    if (Math.random() * 100 < noiseProb) {
      botTransmitted = botIntended === 'cooperate' ? 'defect' : 'cooperate';
      botFlipped = true;
    }

    const [pPayoff, bPayoff] = calculatePayoff(playerTransmitted, botTransmitted);

    const newHistory = [
      ...step4History,
      { 
        playerChoice: playerTransmitted, 
        botChoice: botTransmitted, 
        playerPayoff: pPayoff, 
        botPayoff: bPayoff,
        playerFlipped,
        botFlipped
      }
    ];

    setStep4History(newHistory);
    setStep4PlayerScore(prev => prev + pPayoff);
    setStep4BotScore(prev => prev + bPayoff);
    setStep4RoundsPlayed(prev => prev + 1);

    if (playerFlipped || botFlipped) {
      sound.playFailure();
    } else if (playerTransmitted === 'defect' || botTransmitted === 'defect') {
      sound.playFailure();
    } else {
      sound.playBeep();
    }

    if (step4RoundsPlayed + 1 === 7) {
      setTimeout(() => sound.playChime(), 600);
    }
  };

  // --- Resetadores e Mudança de Oponente ---
  const handleBotChangeStep3 = (botKey) => {
    setStep3SelectedBot(botKey);
    setStep3RoundsPlayed(0);
    setStep3History([]);
    setStep3PlayerScore(0);
    setStep3BotScore(0);
  };

  const handleResetStep3 = () => {
    sound.playClick();
    setStep3RoundsPlayed(0);
    setStep3History([]);
    setStep3PlayerScore(0);
    setStep3BotScore(0);
  };

  const handleBotChangeStep4 = (botKey) => {
    setStep4SelectedBot(botKey);
    setStep4RoundsPlayed(0);
    setStep4History([]);
    setStep4PlayerScore(0);
    setStep4BotScore(0);
  };

  const handleResetStep4 = () => {
    sound.playClick();
    setStep4RoundsPlayed(0);
    setStep4History([]);
    setStep4PlayerScore(0);
    setStep4BotScore(0);
  };

  // Reinicia o jogo inteiro do zero
  const handleFullReset = () => {
    sound.playClick();
    setCurrentStep(1);
    
    setStep1PlayState('waiting');
    setStep1PlayerChoice(null);
    setStep1BotChoice(null);

    setStep2RoundsPlayed(0);
    setStep2History([]);
    setStep2PlayerScore(0);
    setStep2BotScore(0);

    setStep3SelectedBot('copycat');
    setStep3RoundsPlayed(0);
    setStep3History([]);
    setStep3PlayerScore(0);
    setStep3BotScore(0);

    setStep4SelectedBot('copycat');
    setStep4RoundsPlayed(0);
    setStep4History([]);
    setStep4PlayerScore(0);
    setStep4BotScore(0);
  };

  // --- Seleciona placar e histórico dinâmico para o SecondaryMonitor ---
  const getActiveHistoryAndScores = () => {
    if (currentStep === 1) {
      const played = step1PlayState === 'played';
      return {
        history: played ? [{
          playerChoice: step1PlayerChoice,
          botChoice: step1BotChoice,
          playerPayoff: step1PlayerChoice === 'cooperate' ? 5 : 3,
          botPayoff: step1PlayerChoice === 'cooperate' ? 0 : 3,
          playerFlipped: false,
          botFlipped: false
        }] : [],
        playerScore: played ? (step1PlayerChoice === 'cooperate' ? 5 : 3) : 0,
        botScore: played ? (step1PlayerChoice === 'cooperate' ? 0 : 3) : 0
      };
    }
    if (currentStep === 2) {
      return { history: step2History, playerScore: step2PlayerScore, botScore: step2BotScore };
    }
    if (currentStep === 3) {
      return { history: step3History, playerScore: step3PlayerScore, botScore: step3BotScore };
    }
    if (currentStep === 4) {
      return { history: step4History, playerScore: step4PlayerScore, botScore: step4BotScore };
    }
    return { history: [], playerScore: 0, botScore: 0 };
  };

  const { history: activeHistory, playerScore: activePlayerScore, botScore: activeBotScore } = getActiveHistoryAndScores();

  // --- Configuração dos Botões Dinâmicos no ControlPanel ---
  let showCooperateDefect = false;
  let cooperateDefectDisabled = false;
  let showNext = true;
  let nextActive = false;
  let showNoise = false;

  if (currentStep === 1) {
    showCooperateDefect = true;
    cooperateDefectDisabled = step1PlayState === 'played';
    nextActive = step1PlayState === 'played';
  } else if (currentStep === 2) {
    showCooperateDefect = true;
    cooperateDefectDisabled = step2RoundsPlayed >= 5;
    nextActive = step2RoundsPlayed >= 5;
  } else if (currentStep === 3) {
    showCooperateDefect = true;
    cooperateDefectDisabled = step3RoundsPlayed >= 5;
    nextActive = step3RoundsPlayed >= 5;
  } else if (currentStep === 4) {
    showCooperateDefect = true;
    cooperateDefectDisabled = step4RoundsPlayed >= 7;
    nextActive = step4RoundsPlayed >= 7;
    showNoise = true;
  } else if (currentStep === 5) {
    showNext = true;
    nextActive = true;
    showNoise = true;
  } else if (currentStep === 6) {
    showNext = false;
  }

  // --- Navegação entre Etapas ---
  const handleNextStep = () => {
    console.log("handleNextStep chamado. Passo atual:", currentStep);
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    console.log("handlePrevStep chamado. Passo atual:", currentStep);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <>
      {/* Botão de Hamburger da Página (Fora do container de background para ser clicável) */}
      <button 
        className="page-hamburger-btn"
        onClick={() => {
          sound.playClick();
          setIsSettingsOpen(prev => !prev);
        }}
        title="Configurações do Sistema"
      >
        {isSettingsOpen ? '✕' : '☰'}
      </button>

      {/* Luz Suspensa Dinâmica: Canvas 2D Cascade Blur (Fora do background para não sofrer zoom) */}
      <div className="hanging-lamp">
        <LampLightCanvas isSettingsOpen={isSettingsOpen} />
      </div>

      {/* Painel Geral de Background (Agrupa parede, janela, conduíte e sombra da janela para Zoom Parallax) */}
      <div className="background-container">
        <div className="background-wall" />

        {/* Elementos Atmosféricos do Fundo (Prisão) */}
        <div className="prison-conduit" />

      {/* Janela de Observação Física da Prisão (Espaço da Esquerda) */}
      <div className="prison-window">
        <svg viewBox="0 0 500 346" width="100%" height="100%" className="prison-window-svg">
          <defs>
            {/* Filtro de neon glow para a lâmpada do teto (Mais fraco com stdDeviation 4) */}
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Filtro de desfoque/blur para a sala do fundo */}
            <filter id="room-blur">
              <feGaussianBlur stdDeviation="1.3" />
            </filter>

            {/* Gradiente da parede de fundo (Iluminação do neon azul) */}
            <linearGradient id="back-wall-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#223048" />
              <stop offset="40%" stopColor="#161e2b" />
              <stop offset="100%" stopColor="#0a0d14" />
            </linearGradient>

            {/* Gradiente da parede esquerda */}
            <linearGradient id="left-wall-grad" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a2638" />
              <stop offset="100%" stopColor="#080b11" />
            </linearGradient>

            {/* Gradiente da parede direita */}
            <linearGradient id="right-wall-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a2638" />
              <stop offset="100%" stopColor="#080b11" />
            </linearGradient>

            {/* Gradiente do teto */}
            <linearGradient id="ceiling-grad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#202d40" />
              <stop offset="100%" stopColor="#0c121b" />
            </linearGradient>

            {/* Gradiente do chão */}
            <linearGradient id="floor-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#101a28" />
              <stop offset="100%" stopColor="#03050a" />
            </linearGradient>

            {/* Gradiente metálico do frame da janela */}
            <linearGradient id="window-frame-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2e2e2e" />
              <stop offset="25%" stopColor="#181818" />
              <stop offset="75%" stopColor="#0d0d0d" />
              <stop offset="100%" stopColor="#1e1e1e" />
            </linearGradient>

            {/* Gradiente de reflexo do vidro */}
            <linearGradient id="glass-reflection-1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.12)" />
              <stop offset="25%" stopColor="rgba(255, 255, 255, 0.04)" />
              <stop offset="40%" stopColor="rgba(255, 255, 255, 0.0)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.0)" />
            </linearGradient>
            <linearGradient id="glass-reflection-2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.0)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.0)" />
              <stop offset="70%" stopColor="rgba(255, 255, 255, 0.06)" />
              <stop offset="85%" stopColor="rgba(255, 255, 255, 0.01)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.0)" />
            </linearGradient>

            {/* Padrão da tela de arame (chain-link mesh) com brilho metálico 3D */}
            <pattern id="chain-link" width="16" height="28" patternUnits="userSpaceOnUse">
              <path d="M 0 14 L 8 0 L 16 14 L 8 28 Z" fill="none" stroke="#06090a" strokeWidth="1.8" />
              <path d="M 0 14 L 8 0 L 16 14 L 8 28 Z" fill="none" stroke="#54656f" strokeWidth="1.2" />
              <path d="M 0 14 L 8 0 L 16 14" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.4" />
            </pattern>
          </defs>

          {/* 1. Moldura Externa (Heavy metal frame - engrossada para strokeWidth 5.0) */}
          <rect x="0" y="0" width="500" height="346" rx="4" fill="url(#window-frame-grad)" stroke="#050505" strokeWidth="5.0" />
          <rect x="16" y="16" width="468" height="314" fill="none" stroke="#121212" strokeWidth="3.0" />
          <rect x="20" y="20" width="460" height="306" fill="none" stroke="#3c3c3c" strokeWidth="1.5" />

          {/* 2. Área Interna da Janela (Onde fica a cena 3D e o vidro) */}
          <g>
            <clipPath id="window-inner-clip">
              <rect x="25" y="25" width="450" height="296" />
            </clipPath>
            
            <g clipPath="url(#window-inner-clip)">
              {/* A. Paredes 3D e Porta (Com desfoque/blur de fundo) */}
              <g filter="url(#room-blur)">
                <polygon points="25,25 475,25 350,110 150,110" fill="url(#ceiling-grad)" />
                <polygon points="25,321 475,321 350,236 150,236" fill="url(#floor-grad)" />
                <polygon points="25,25 150,110 150,236 25,321" fill="url(#left-wall-grad)" />
                <polygon points="475,25 350,110 350,236 475,321" fill="url(#right-wall-grad)" />
                <rect x="150" y="110" width="200" height="126" fill="url(#back-wall-grad)" />

                {/* Arestas de perspectiva */}
                <line x1="25" y1="25" x2="150" y2="110" stroke="#10181b" strokeWidth="2.0" opacity="0.8" />
                <line x1="475" y1="25" x2="350" y2="110" stroke="#10181b" strokeWidth="2.0" opacity="0.8" />
                <line x1="25" y1="321" x2="150" y2="236" stroke="#05080a" strokeWidth="2.5" opacity="0.9" />
                <line x1="475" y1="321" x2="350" y2="236" stroke="#05080a" strokeWidth="2.5" opacity="0.9" />
                <rect x="150" y="110" width="200" height="126" fill="none" stroke="#080e10" strokeWidth="1.5" opacity="0.75" />

                {/* B. Lâmpada de Neon no Teto (Restaurada, tom azul e mais fraca) */}
                <rect x="190" y="102" width="120" height="4" rx="2" fill="#5b8ff9" filter="url(#neon-glow)" opacity="0.65" />
                <rect x="200" y="103" width="100" height="2" rx="1" fill="#e0e8ff" opacity="0.8" />
                <rect x="190" y="100" width="4" height="4" fill="#151d20" />
                <rect x="306" y="100" width="4" height="4" fill="#151d20" />

                {/* Porta de Aço de Fundo */}
                <rect x="223" y="134" width="54" height="102" fill="#0c1215" stroke="#1c2b30" strokeWidth="0.8" />
                <rect x="225" y="136" width="50" height="100" fill="#182328" stroke="#080c0e" strokeWidth="1.5" />
                <rect x="238" y="150" width="24" height="10" rx="1" fill="#080c0e" stroke="#25353c" strokeWidth="0.8" />
                <line x1="244" y1="150" x2="244" y2="160" stroke="#25353c" strokeWidth="1" />
                <line x1="250" y1="150" x2="250" y2="160" stroke="#25353c" strokeWidth="1" />
                <line x1="256" y1="150" x2="256" y2="160" stroke="#25353c" strokeWidth="1" />
                <line x1="225" y1="184" x2="275" y2="184" stroke="#0d1417" strokeWidth="1.2" />
                <line x1="225" y1="185" x2="275" y2="185" stroke="#25353c" strokeWidth="0.5" />
                <rect x="268" y="179" width="4" height="2" rx="0.5" fill="#364c57" />
                <circle cx="270" cy="180" r="1" fill="#0d1417" />
              </g>

              {/* C. Tela de Arame (Chain-Link Fence) */}
              <rect x="25" y="25" width="450" height="296" fill="url(#chain-link)" opacity="0.45" />

              {/* D. Vidro e Reflexos */}
              <polygon points="25,25 160,25 100,321 25,321" fill="url(#glass-reflection-1)" />
              <polygon points="320,25 440,25 475,80 475,200 400,321 280,321" fill="url(#glass-reflection-2)" />
              <path d="M25,25 L80,25 C50,37 37,50 25,80 Z" fill="rgba(0, 0, 0, 0.25)" filter="blur(4px)" />
              <path d="M475,321 L420,321 C440,295 462,275 475,235 Z" fill="rgba(0, 0, 0, 0.35)" filter="blur(5px)" />
              <path d="M25,321 L70,321 C50,305 37,295 25,265 Z" fill="rgba(0, 0, 0, 0.3)" filter="blur(4px)" />
            </g>
          </g>
        </svg>
      </div>

      <div className="prison-window-shadow">
        <svg viewBox="0 0 200 300" width="100%" height="100%">
          <defs>
            <filter id="prison-shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            <mask id="window-mask">
              <rect width="200" height="300" fill="black" />
              <path d="M 30,100 A 70,70 0 0,1 170,100 L 170,280 L 30,280 Z" fill="white" />
              <line x1="75" y1="30" x2="75" y2="280" stroke="black" strokeWidth="12" />
              <line x1="125" y1="30" x2="125" y2="280" stroke="black" strokeWidth="12" />
              <line x1="20" y1="100" x2="180" y2="100" stroke="black" strokeWidth="12" />
              <line x1="20" y1="180" x2="180" y2="180" stroke="black" strokeWidth="12" />
            </mask>
          </defs>
          <g filter="url(#prison-shadow-blur)">
            <rect width="200" height="300" fill="rgba(200, 225, 255, 0.22)" mask="url(#window-mask)" />
          </g>
        </svg>
      </div>
      </div>

      {/* Superfície Física da Mesa (Z-Index Inferior) */}
      <div className="desk-surface" />

      {/* Mesa do Investigador (Multi-Dispositivo) */}
      <div className="investigator-table">
        
        {(!showMenu && !showIntro) && (
        <div className="table-left">
          <ClipboardDossier 
            currentStep={currentStep} 
            selectedBotStep3={step3SelectedBot}
            selectedBotStep4={step4SelectedBot}
          />
        </div>
        )}

        {/* Coluna Central: O Terminal CRT */}
        <div className="table-center">
          <ConsoleFrame>
            <CrtScreen 
              currentStep={currentStep} 
              totalSteps={TOTAL_STEPS}
              isSettingsOpen={isSettingsOpen}
            >
              {isSettingsOpen ? (
                <SettingsMenu 
                  onClose={() => setIsSettingsOpen(false)}
                  theme={theme}
                  setTheme={setTheme}
                  onVolumeChange={() => setVolume(sound.getVolume())}
                  onHumChange={() => setHumEnabled(sound.getHumEnabled())}
                />
              ) : showMenu ? (
                <Menu onStart={handleStartGame} />
              ) : showIntro ? (
                <IntroStory onDismiss={handleDismissIntro} />
              ) : (
                <>
                  {currentStep === 1 && (
                    <Step1Intro 
                      playState={step1PlayState}
                      playerChoice={step1PlayerChoice}
                      botChoice={step1BotChoice}
                    />
                  )}
                  {currentStep === 2 && (
                    <Step2Repeated 
                      roundsPlayed={step2RoundsPlayed}
                      playerScore={step2PlayerScore}
                      botScore={step2BotScore}
                      history={step2History}
                    />
                  )}
                  {currentStep === 3 && (
                    <Step3Strategies 
                      selectedBot={step3SelectedBot}
                      onBotChange={handleBotChangeStep3}
                      roundsPlayed={step3RoundsPlayed}
                      history={step3History}
                      onResetMatch={handleResetStep3}
                    />
                  )}
                  {currentStep === 4 && (
                    <Step4Noise 
                      selectedBot={step4SelectedBot}
                      onBotChange={handleBotChangeStep4}
                      noiseProb={noiseProb}
                      roundsPlayed={step4RoundsPlayed}
                      playerScore={step4PlayerScore}
                      botScore={step4BotScore}
                      history={step4History}
                      onResetMatch={handleResetStep4}
                    />
                  )}
                  {currentStep === 5 && (
                    <Step5Evolution noiseProb={noiseProb} />
                  )}
                  {currentStep === 6 && (
                    <Step6Conclusion onRestart={handleFullReset} />
                  )}
                </>
              )}
            </CrtScreen>
 
            {!showIntro && (
            <ControlPanel 
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              onReset={handleFullReset}
              showNext={showNext}
              nextActive={nextActive && !isSettingsOpen}
              noiseProb={noiseProb}
              onNoiseChange={setNoiseProb}
              showNoise={showNoise}
              noiseDisabled={isSettingsOpen}
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
            />
            )}
          </ConsoleFrame>

          {(!showMenu && !showIntro) && (
          <DecisionKeyboard 
            onCooperate={() => {
              if (currentStep === 1) handlePlayStep1('cooperate');
              else if (currentStep === 2) handlePlayStep2('cooperate');
              else if (currentStep === 3) handlePlayStep3('cooperate');
              else if (currentStep === 4) handlePlayStep4('cooperate');
            }}
            onDefect={() => {
              if (currentStep === 1) handlePlayStep1('defect');
              else if (currentStep === 2) handlePlayStep2('defect');
              else if (currentStep === 3) handlePlayStep3('defect');
              else if (currentStep === 4) handlePlayStep4('defect');
            }}
            show={showCooperateDefect}
            disabled={cooperateDefectDisabled || isSettingsOpen}
          />
          )}
        </div>

        {(!showMenu && !showIntro) && (
        <div className="table-right">
          <SecondaryMonitor 
            currentStep={currentStep}
            history={activeHistory}
            playerScore={activePlayerScore}
            botScore={activeBotScore}
            roundsPlayed={
              currentStep === 1 ? (step1PlayState === 'played' ? 1 : 0) :
              currentStep === 2 ? step2RoundsPlayed :
              currentStep === 3 ? step3RoundsPlayed :
              currentStep === 4 ? step4RoundsPlayed : 0
            }
          />
        </div>
        )}

      </div>
    </>
  );
}
