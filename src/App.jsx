import React, { useState, useEffect } from 'react';
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
import { sound } from './utils/sound';
import './App.css';

const TOTAL_STEPS = 6;

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [noiseProb, setNoiseProb] = useState(15); // Ruído padrão para etapas 4 e 5

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

  // Monitora mudança de mudo
  const handleToggleMute = () => {
    const newMute = sound.toggleMute();
    setIsMuted(newMute);
    sound.updateHumGain();
  };

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

      case 'grudger':
        const hasPlayerDefected = myHistory.some(round => round.playerChoice === 'defect');
        return hasPlayerDefected ? 'defect' : 'cooperate';

      case 'detective':
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

      case 'copykitten':
        if (myHistory.length < 2) return 'cooperate';
        const last1 = myHistory[myHistory.length - 1].playerChoice;
        const last2 = myHistory[myHistory.length - 2].playerChoice;
        if (last1 === 'defect' && last2 === 'defect') {
          return 'defect';
        }
        return 'cooperate';

      default:
        return 'cooperate';
    }
  };

  // --- Jogadas por Etapa ---

  // Jogar Etapa 1
  const handlePlayStep1 = (choice) => {
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
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <>
      {/* Luz Suspensa Dinâmica */}
      <div className="hanging-lamp">
        <div className="hanging-lamp-light" />
      </div>

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
          <ConsoleFrame isMuted={isMuted} onToggleMute={handleToggleMute}>
            <CrtScreen currentStep={currentStep} totalSteps={TOTAL_STEPS}>
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
              cooperateDefectDisabled={cooperateDefectDisabled}
              showNext={showNext}
              nextActive={nextActive}
              noiseProb={noiseProb}
              onNoiseChange={setNoiseProb}
              showNoise={showNoise}
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
