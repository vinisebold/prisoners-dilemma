import { useState, useEffect } from 'react';
import ConsoleFrame from './components/ConsoleFrame';
import CrtScreen from './components/CrtScreen';
import ControlPanel from './components/ControlPanel';
import ClipboardDossier from './components/ClipboardDossier';
import TicketPrinter from './components/TicketPrinter';
import Step1Intro from './components/steps/Step1Intro';
import Step2Repeated from './components/steps/Step2Repeated';
import Step3Strategies from './components/steps/Step3Strategies';
import Step4Noise from './components/steps/Step4Noise';
import Step5Evolution from './components/steps/Step5Evolution';
import Step6Conclusion from './components/steps/Step6Conclusion';
import SettingsMenu from './components/SettingsMenu';
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
    document.body.className = `theme-${theme}${isSettingsOpen ? ' settings-open' : ''}`;
    localStorage.setItem('game_theme', theme);
  }, [theme, isSettingsOpen]);

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

  // --- Seleciona placar e histórico dinâmico para o TicketPrinter ---
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
      {/* Botão de Hamburger da Página */}
      <button 
        className="page-hamburger-btn"
        onClick={() => {
          sound.playClick();
          setIsSettingsOpen(prev => !prev);
        }}
        title="Configurações do Sistema"
      >
        ☰
      </button>

      {/* Luz Suspensa Dinâmica */}
      <div className="hanging-lamp">
        <div className="hanging-lamp-light" />
        <div className="hanging-lamp-particles">
          <svg width="800" height="850" viewBox="0 0 800 850" className="dust-particles-svg">
            <circle cx="375" cy="100" r="1.2" className="dust-p" style={{ '--dx': '5px', '--dy': '-3px', '--d': '-0s' }} />
            <circle cx="440" cy="200" r="0.8" className="dust-p" style={{ '--dx': '-3px', '--dy': '4px', '--d': '-2s' }} />
            <circle cx="355" cy="320" r="1.8" className="dust-p" style={{ '--dx': '4px', '--dy': '-2px', '--d': '-4s' }} />
            <circle cx="490" cy="400" r="0.9" className="dust-p" style={{ '--dx': '-4px', '--dy': '3px', '--d': '-6s' }} />
            <circle cx="320" cy="500" r="1.5" className="dust-p" style={{ '--dx': '3px', '--dy': '-4px', '--d': '-8s' }} />
            <circle cx="540" cy="580" r="0.7" className="dust-p" style={{ '--dx': '-2px', '--dy': '2px', '--d': '-10s' }} />
            <circle cx="310" cy="660" r="1.8" className="dust-p" style={{ '--dx': '5px', '--dy': '-1px', '--d': '-3s' }} />
            <circle cx="580" cy="740" r="1" className="dust-p" style={{ '--dx': '-5px', '--dy': '3px', '--d': '-7s' }} />
            <circle cx="400" cy="800" r="0.6" className="dust-p" style={{ '--dx': '2px', '--dy': '-3px', '--d': '-11s' }} />
            <circle cx="410" cy="150" r="0.7" className="dust-p" style={{ '--dx': '-2px', '--dy': '5px', '--d': '-1s' }} />
            <circle cx="360" cy="260" r="1.4" className="dust-p" style={{ '--dx': '3px', '--dy': '-1px', '--d': '-5s' }} />
            <circle cx="480" cy="310" r="0.6" className="dust-p" style={{ '--dx': '-1px', '--dy': '-4px', '--d': '-9s' }} />
            <circle cx="340" cy="420" r="2" className="dust-p" style={{ '--dx': '4px', '--dy': '2px', '--d': '-0.5s' }} />
            <circle cx="530" cy="460" r="0.8" className="dust-p" style={{ '--dx': '-3px', '--dy': '-2px', '--d': '-4.5s' }} />
            <circle cx="380" cy="550" r="1.1" className="dust-p" style={{ '--dx': '1px', '--dy': '4px', '--d': '-8.5s' }} />
            <circle cx="500" cy="620" r="0.5" className="dust-p" style={{ '--dx': '-4px', '--dy': '1px', '--d': '-2.5s' }} />
            <circle cx="350" cy="700" r="1.3" className="dust-p" style={{ '--dx': '2px', '--dy': '-3px', '--d': '-6.5s' }} />
            <circle cx="550" cy="780" r="0.9" className="dust-p" style={{ '--dx': '-1px', '--dy': '5px', '--d': '-10.5s' }} />
            <circle cx="420" cy="50" r="0.5" className="dust-p" style={{ '--dx': '3px', '--dy': '1px', '--d': '-3.5s' }} />
            <circle cx="450" cy="520" r="1.6" className="dust-p" style={{ '--dx': '-5px', '--dy': '-1px', '--d': '-7.5s' }} />
            <circle cx="330" cy="140" r="0.6" className="dust-p" style={{ '--dx': '2px', '--dy': '-2px', '--d': '-1.5s' }} />
            <circle cx="470" cy="80" r="0.9" className="dust-p" style={{ '--dx': '-1px', '--dy': '3px', '--d': '-5.5s' }} />
            <circle cx="390" cy="230" r="0.5" className="dust-p" style={{ '--dx': '4px', '--dy': '1px', '--d': '-9.5s' }} />
            <circle cx="430" cy="350" r="1.3" className="dust-p" style={{ '--dx': '-3px', '--dy': '-2px', '--d': '-0.8s' }} />
            <circle cx="300" cy="440" r="0.7" className="dust-p" style={{ '--dx': '1px', '--dy': '4px', '--d': '-4.8s' }} />
            <circle cx="560" cy="500" r="1" className="dust-p" style={{ '--dx': '-2px', '--dy': '-3px', '--d': '-8.8s' }} />
            <circle cx="370" cy="600" r="0.5" className="dust-p" style={{ '--dx': '3px', '--dy': '2px', '--d': '-2.8s' }} />
            <circle cx="520" cy="650" r="1.2" className="dust-p" style={{ '--dx': '-4px', '--dy': '-1px', '--d': '-6.8s' }} />
            <circle cx="330" cy="750" r="0.8" className="dust-p" style={{ '--dx': '2px', '--dy': '3px', '--d': '-10.8s' }} />
            <circle cx="460" cy="680" r="0.6" className="dust-p" style={{ '--dx': '-1px', '--dy': '-4px', '--d': '-1.2s' }} />
            <circle cx="510" cy="300" r="1.5" className="dust-p" style={{ '--dx': '5px', '--dy': '1px', '--d': '-5.2s' }} />
            <circle cx="340" cy="40" r="0.7" className="dust-p" style={{ '--dx': '-2px', '--dy': '2px', '--d': '-9.2s' }} />
            <circle cx="420" cy="470" r="0.4" className="dust-p" style={{ '--dx': '1px', '--dy': '-5px', '--d': '-3.2s' }} />
            <circle cx="280" cy="580" r="0.9" className="dust-p" style={{ '--dx': '3px', '--dy': '4px', '--d': '-7.2s' }} />
            <circle cx="570" cy="710" r="1.1" className="dust-p" style={{ '--dx': '-5px', '--dy': '-2px', '--d': '-11.2s' }} />
            <circle cx="380" cy="180" r="0.4" className="dust-p" style={{ '--dx': '2px', '--dy': '-1px', '--d': '-0.3s' }} />
            <circle cx="490" cy="280" r="0.8" className="dust-p" style={{ '--dx': '-4px', '--dy': '3px', '--d': '-4.3s' }} />
            <circle cx="360" cy="380" r="1.7" className="dust-p" style={{ '--dx': '1px', '--dy': '-3px', '--d': '-8.3s' }} />
            <circle cx="410" cy="50" r="0.5" className="dust-p" style={{ '--dx': '-3px', '--dy': '4px', '--d': '-2.3s' }} />
          </svg>
        </div>
      </div>

      {/* Elementos Atmosféricos do Fundo (Prisão) */}
      <div className="prison-conduit" />
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

      {/* Superfície Física da Mesa (Z-Index Inferior) */}
      <div className="desk-surface" />

      {/* Mesa do Investigador (Multi-Dispositivo) */}
      <div className="investigator-table">
        
        {/* Coluna Esquerda: A Prancheta de Papel (Dossiê do Caso) */}
        <div className="table-left">
          <ClipboardDossier 
            currentStep={currentStep} 
            selectedBotStep3={step3SelectedBot}
            selectedBotStep4={step4SelectedBot}
          />
        </div>

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
                    />
                  )}
                  {currentStep === 3 && (
                    <Step3Strategies 
                      selectedBot={step3SelectedBot}
                      onBotChange={handleBotChangeStep3}
                      roundsPlayed={step3RoundsPlayed}
                      onResetMatch={handleResetStep3}
                    />
                  )}
                  {currentStep === 4 && (
                    <Step4Noise 
                      selectedBot={step4SelectedBot}
                      onBotChange={handleBotChangeStep4}
                      noiseProb={noiseProb}
                      roundsPlayed={step4RoundsPlayed}
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
 
            <ControlPanel 
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
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              onReset={handleFullReset}
              showCooperateDefect={showCooperateDefect}
              cooperateDefectDisabled={cooperateDefectDisabled || isSettingsOpen}
              showNext={showNext}
              nextActive={nextActive && !isSettingsOpen}
              noiseProb={noiseProb}
              onNoiseChange={setNoiseProb}
              showNoise={showNoise}
              noiseDisabled={isSettingsOpen}
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
            />
          </ConsoleFrame>
        </div>

        {/* Coluna Direita: O Registrador e Impressor (Ticket) */}
        <div className="table-right">
          <TicketPrinter 
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

      </div>
    </>
  );
}
