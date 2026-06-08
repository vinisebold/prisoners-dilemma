export const BOT_DOSSIERS = {
  copycat: {
    name: 'Copycat (Olho por Olho)',
    desc: 'Começa em silêncio. Nas rodadas seguintes, repete exatamente o que você fez na rodada anterior.',
    dossier: 'Justo, retaliador e perdoador. É a estratégia de referência da teoria dos jogos.'
  },
  always_defect: {
    name: 'Sempre Confessar',
    desc: 'Nunca fica em silêncio. Confessa em todas as rodadas, não importa o que você decida fazer.',
    dossier: 'Explora quem mantém silêncio e evita ser explorado, mas falha em sustentar benefício mútuo.'
  },
  always_cooperate: {
    name: 'Sempre Silêncio',
    desc: 'Nunca confessa. Sempre escolhe silêncio, sob qualquer circunstância.',
    dossier: 'Mantém o acordo sempre. Alvo fácil para quem escolhe confessar. Sofre a pior pena se explorado.'
  },
  grudger: {
    name: 'Rabugento (Grudger)',
    desc: 'Começa em silêncio. Mas se você confessar uma única vez, ele NUNCA mais te perdoa e passa a confessar para sempre.',
    dossier: 'Rancoroso. Mantém silêncio mútuo, mas é extremamente intolerante a desvios.'
  },
  detective: {
    name: 'Detetive',
    desc: 'Joga: Silêncio, Confessar, Silêncio, Silêncio. Se você confessar de volta, ele vira um Copycat. Se você nunca confessar, ele vira Sempre Confessar para te explorar.',
    dossier: 'Analítico e explorador. Testa a reação do oponente antes de definir sua postura.'
  }
};
