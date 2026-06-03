export const BOT_DOSSIERS = {
  copycat: {
    name: 'Copycat (Olho por Olho)',
    desc: 'Começa cooperando. Nas rodadas seguintes, repete exatamente o que você fez na rodada anterior.',
    dossier: 'Justo, retaliador e perdoador. É a estratégia de referência da teoria dos jogos.'
  },
  always_defect: {
    name: 'Sempre Delatar (Traidor)',
    desc: 'Nunca coopera. Delata todas as rodadas, não importa o que você decida fazer.',
    dossier: 'Explora severamente cooperadores ingênuos e evita ser explorado, mas falha em cooperar mutuamente.'
  },
  always_cooperate: {
    name: 'Sempre Cooperar (Ingênuo)',
    desc: 'Nunca delata. Sempre escolhe Cooperar/Silêncio, sob qualquer circunstância.',
    dossier: 'Altruísta puro. Alvo fácil para traidores de plantão. Sofre a pior pena se explorado.'
  },
  grudger: {
    name: 'Rabugento (Grudger)',
    desc: 'Começa cooperando. Mas se você o delatar uma única vez, ele NUNCA mais te perdoa e delata para sempre.',
    dossier: 'Rancoroso. Mantém cooperação mútua, mas é extremamente intolerante a desvios.'
  },
  detective: {
    name: 'Detetive',
    desc: 'Joga: Cooperar, Delatar, Cooperar, Cooperar. Se você delatar de volta, ele vira um Copycat. Se você nunca delatar, ele vira Sempre Delatar para te explorar.',
    dossier: 'Analítico e explorador. Testa a reação do oponente antes de definir sua postura.'
  }
};
