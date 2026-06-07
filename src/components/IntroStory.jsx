import { useState, useEffect } from 'react';

const LINES = [
  { delay: 500, text: "> INICIANDO TRANSMISSÃO...", className: 'intro-system' },
  { delay: 1500, text: "> ACESSANDO BANCO DE DADOS DO PROGRAMA DE RESSOCIALIZAÇÃO...", className: 'intro-system' },
  { delay: 3000, text: "", className: '' },
  { delay: 3100, text: "VOCÊ SE LEMBRA DO DIA EM QUE TUDO COMEÇOU.", className: 'intro-narrative' },
  { delay: 5000, text: "O anúncio no jornal prometia: \"PARTICIPE DE UM ESTUDO GOVERNAMENTAL SOBRE TOMADA DE DECISÃO. REMUNERAÇÃO GARANTIDA.\"", className: 'intro-narrative' },
  { delay: 7500, text: "Você precisava do dinheiro. As contas estavam atrasadas. O formulário era simples: nome, idade, histórico de trabalho.", className: 'intro-narrative' },
  { delay: 10000, text: "O que você NÃO sabia é que o endereço para onde te levaram...", className: 'intro-narrative' },
  { delay: 12000, text: "era uma penitenciária experimental.", className: 'intro-narrative' },
  { delay: 14000, text: "", className: '' },
  { delay: 14500, text: "O PROGRAMA DE RESSOCIALIZAÇÃO DO GOVERNO FEDERAL", className: 'intro-title' },
  { delay: 16000, text: "é um projeto sigiloso que utiliza testes psicológicos em \nindivíduos inseridos em ambientes prisionais simulados.", className: 'intro-narrative' },
  { delay: 19000, text: "A teoria é que, através de jogos de decisão repetidos, é possível prever e modificar comportamentos antissociais.", className: 'intro-narrative' },
  { delay: 22000, text: "Você não é um prisioneiro real — mas ninguém aqui fora sabe disso.", className: 'intro-narrative-em' },
  { delay: 24500, text: "", className: '' },
  { delay: 25000, text: "> CONEXÃO ESTABELECIDA COM O TERMINAL DE DECISÃO.", className: 'intro-system' },
  { delay: 26500, text: "> SUA PARTICIPAÇÃO É OBRIGATÓRIA ATÉ A CONCLUSÃO DO PROGRAMA.", className: 'intro-system-warn' },
  { delay: 28500, text: "> BEM-VINDO AO DILEMA.", className: 'intro-system' },
];

export default function IntroStory({ onDismiss }) {
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    const timers = LINES.map((line) =>
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
      }, line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const last = LINES[LINES.length - 1];
    const timer = setTimeout(() => onDismiss(), last.delay + 2000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="intro-story">
      <div className="intro-scroll">
        {visibleLines.map((line, i) =>
          line.text ? (
            <p key={i} className={`intro-line ${line.className || ''}`}>
              {line.text.split('\n').map((t, j) => (
                <span key={j}>{t}<br /></span>
              ))}
            </p>
          ) : (
            <br key={i} />
          )
        )}
        {visibleLines.length < LINES.length && (
          <span className="intro-cursor">_</span>
        )}
      </div>
      {visibleLines.length >= LINES.length && (
        <button className="intro-continue-btn" onClick={onDismiss}>
          PRESSIONE ENTER OU CLIQUE PARA CONTINUAR
          <span className="intro-blink">_</span>
        </button>
      )}
    </div>
  );
}
