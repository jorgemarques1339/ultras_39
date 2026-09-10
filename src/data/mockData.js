export const INITIAL_USER = {
  name: 'Salvador Vilacondense',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  memberNumber: '039-1984',
  memberCategory: 'Sócio Efetivo (Bancada Poente)',
  memberSince: '2019',
  phone: '912 345 678',
  email: 'salvador.g39@rioavefc.pt',
  quotaStatus: 'pendente', // 'em_dia' | 'pendente'
  quotaAmount: 12.50,
  quotaPendingPeriod: 'Época 2026/2027',
  quotaPendingMonth: 'Época 2026/2027',
};

export const NEXT_MATCH = {
  id: 'match-real-j06',
  competition: 'Liga Portugal Betclic',
  round: '6.ª Jornada',
  dateFormatted: '14 Setembro · 20:15',
  stadium: 'Estádio dos Arcos',
  city: 'Vila do Conde',
  weather: '19°C · Brisa Marítima 12km/h',
  homeTeam: {
    name: 'Rio Ave FC',
    short: 'RAFC',
    city: 'Vila do Conde',
    crest: '🟢⚪',
    color: '#00874E',
  },
  awayTeam: {
    name: 'Estrela da Amadora',
    short: 'CFEA',
    city: 'Amadora',
    crest: '🔴⚪🟢',
    color: '#D32F2F',
  },
  sector: 'Bancada Poente Coberta (Setor Grupo 39)',
  ticketPriceMember: 7.50,
  ticketPricePublic: 17.50,
  totalAvailableTickets: 120,
};

export const CALENDAR_MATCHES = [
  {
    id: 'cal-j06',
    competition: 'Liga Portugal Betclic',
    round: '6.ª Jornada',
    date: '14 Set 2026 · 20:15',
    home: 'Rio Ave FC',
    away: 'Estrela da Amadora',
    stadium: 'Estádio dos Arcos, Vila do Conde',
    isHome: true,
    status: 'upcoming',
    ticketAvailable: true,
    priceMember: 7.50,
  },
  {
    id: 'cal-j07',
    competition: 'Liga Portugal Betclic',
    round: '7.ª Jornada',
    date: '19 Set 2026 · 18:00',
    home: 'FC Alverca',
    away: 'Rio Ave FC',
    stadium: 'Complexo Desportivo do FC Alverca',
    isHome: false,
    status: 'upcoming',
    busOrganized: true,
    busPrice: 15.00,
    ticketAvailable: true,
    priceMember: 10.00,
  },
  {
    id: 'cal-j08',
    competition: 'Liga Portugal Betclic',
    round: '8.ª Jornada',
    date: '11 Out 2026 · 15:30',
    home: 'Rio Ave FC',
    away: 'CD Nacional',
    stadium: 'Estádio dos Arcos, Vila do Conde',
    isHome: true,
    status: 'upcoming',
    ticketAvailable: true,
    priceMember: 7.50,
  },
  {
    id: 'cal-j09',
    competition: 'Liga Portugal Betclic',
    round: '9.ª Jornada',
    date: '25 Out 2026 · 16:00',
    home: 'Rio Ave FC',
    away: 'FC Famalicão',
    stadium: 'Estádio dos Arcos, Vila do Conde',
    isHome: true,
    status: 'upcoming',
    ticketAvailable: true,
    priceMember: 8.50,
  },
];

export const PAST_RESULTS = [
  {
    id: 'res-j05',
    competition: 'Liga Portugal Betclic · 5.ª Jornada',
    date: '05 Set 2026',
    home: 'Santa Clara',
    away: 'Rio Ave FC',
    scoreHome: 4,
    scoreAway: 0,
    scorers: 'Deslocação aos Açores em partida exigente',
    stadium: 'Estádio de São Miguel (Ponta Delgada)',
    highlights: 'Caravana vilacondense presente em São Miguel em apoio incansável ao Rio Ave.',
  },
  {
    id: 'res-j04',
    competition: 'Liga Portugal Betclic · 4.ª Jornada',
    date: '31 Ago 2026',
    home: 'Rio Ave FC',
    away: 'Sporting CP',
    scoreHome: 0,
    scoreAway: 4,
    scorers: 'Estádio dos Arcos com lotação esgotada',
    stadium: 'Estádio dos Arcos, Vila do Conde',
    highlights: 'Apoio vibrante do Grupo 39 do primeiro ao último minuto na Bancada Poente.',
  },
  {
    id: 'res-j03',
    competition: 'Liga Portugal Betclic · 3.ª Jornada',
    date: '24 Ago 2026',
    home: 'Estoril Praia',
    away: 'Rio Ave FC',
    scoreHome: 0,
    scoreAway: 2,
    scorers: '⚽ Tiago Morais 27\', ⚽ Clayton 81\'',
    stadium: 'Estádio António Coimbra da Mota',
    highlights: 'Grande triunfo do Rio Ave FC fora de portas na Amoreira! 3 pontos de ouro.',
  },
  {
    id: 'res-j02',
    competition: 'Liga Portugal Betclic · 2.ª Jornada',
    date: '17 Ago 2026',
    home: 'Rio Ave FC',
    away: 'FC Porto',
    scoreHome: 0,
    scoreAway: 2,
    scorers: 'Primeira receção da época nos Arcos',
    stadium: 'Estádio dos Arcos, Vila do Conde',
    highlights: 'Bancada do Grupo 39 ao rubro com tifo de abertura de temporada.',
  },
];

export const FORUM_CATEGORIES = [
  { id: 'all', title: 'Todos os Tópicos', icon: 'Flame' },
  { id: 'deslocacao', title: 'Próxima Deslocação', icon: 'Bus' },
  { id: 'opiniao', title: 'Opinião & Debate', icon: 'MessageCircle' },
  { id: 'mercado', title: 'Mercado do Adepto', icon: 'ShoppingBag' },
];

export const INITIAL_FORUM_POSTS = [
  {
    id: 'post-1',
    categoryId: 'opiniao',
    categoryName: 'Opinião & Debate',
    author: 'Gonçalo Bateria',
    authorBadge: 'Chefe de Bancada',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    timeAgo: 'Há 15 min',
    title: '🟢⚪ Receção ao Estrela da Amadora na 2.ª feira (14 Set) - Apoio Máximo!',
    content: 'Depois da viagem aos Açores, a equipa precisa da nossa força nos Arcos para voltar às vitórias. Concentração na Porta 4 às 19h15. Todo o setor de verde e branco e cachecol bem alto!',
    upvotes: 54,
    hasUpvoted: true,
    commentsCount: 22,
    tag: 'OFICIAL G39',
    tagColor: '#00B368',
    replies: [
      {
        id: 'rep-1',
        author: 'Rui Marítimo',
        text: 'Lá estarei na Bancada Poente! Vamos puxar pela equipa os 90 minutos!',
        time: 'Há 8 min'
      }
    ]
  },
  {
    id: 'post-2',
    categoryId: 'deslocacao',
    categoryName: 'Próxima Deslocação',
    author: 'Tiago Arcos',
    authorBadge: 'Comissão Deslocações',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    timeAgo: 'Há 1 hora',
    title: '🚌 Autocarro para Alverca (7.ª Jornada · 19 Setembro) - Inscrições Abertas',
    content: 'A caravana do Grupo 39 ruma ao Ribatejo no sábado 19 de Setembro! Saída do Cais da Alfândega às 11h30. O pack inclui autocarro ida/volta + bilhete no setor visitante. Reserva imediata com MB WAY!',
    upvotes: 38,
    hasUpvoted: false,
    commentsCount: 14,
    tag: 'DESLOCAÇÃO',
    tagColor: '#F2B600',
    replies: []
  },
  {
    id: 'post-3',
    categoryId: 'opiniao',
    categoryName: 'Opinião & Debate',
    author: 'Mestre Vilacondense',
    authorBadge: 'Sócio 124',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    timeAgo: 'Há 3 horas',
    title: 'Análise ao início de campeonato e o jogo crucial com o Estrela',
    content: 'Tivemos um calendário inicial duríssimo com Porto e Sporting nos primeiros 4 jogos. A vitória no Estoril mostrou a qualidade do nosso contra-ataque. Contra o Estrela da Amadora na segunda-feira temos tudo para somar os 3 pontos.',
    upvotes: 29,
    hasUpvoted: false,
    commentsCount: 9,
    tag: 'TÁTICA',
    tagColor: '#00A3E0',
    replies: []
  },
  {
    id: 'post-4',
    categoryId: 'mercado',
    categoryName: 'Mercado do Adepto',
    author: 'Cláudio G39 Store',
    authorBadge: 'Merchandising',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    timeAgo: 'Ontem',
    title: '🧣 Cachecóis Oficiais Grupo 39 Época 2026/2027',
    content: 'Já disponíveis na sede do clube. Tecido especial comemorativo com entrega em mão no jogo de segunda-feira com o Estrela. Preço exclusivo sócio G39: 12,00 €.',
    upvotes: 47,
    hasUpvoted: false,
    commentsCount: 12,
    tag: 'MERCHANDISING',
    tagColor: '#F2B600',
    replies: []
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-mbw-9821',
    title: 'Quota Anual Sócio - Época 2025/2026',
    category: 'Quota Anual Grupo 39',
    amount: 12.50,
    date: '10 Ago 2025 · 11:24',
    method: 'MB WAY',
    phone: '912 345 678',
    sibsRef: 'MBW-2026-RAFC-9821',
    status: 'Concluído',
    statusColor: '#00C853',
  },
  {
    id: 'tx-mbw-9452',
    title: 'Bilhete Bancada Poente vs FC Porto',
    category: 'Bilhética Oficial RAFC',
    amount: 10.00,
    date: '15 Ago 2026 · 17:45',
    method: 'MB WAY',
    phone: '912 345 678',
    sibsRef: 'MBW-2026-RAFC-9452',
    status: 'Concluído',
    statusColor: '#00C853',
  },
  {
    id: 'tx-mbw-8910',
    title: 'Autocarro Caravana ao Estoril Praia',
    category: 'Deslocações Claque',
    amount: 15.00,
    date: '22 Ago 2026 · 14:10',
    method: 'MB WAY',
    phone: '912 345 678',
    sibsRef: 'MBW-2026-RAFC-8910',
    status: 'Concluído',
    statusColor: '#00C853',
  },
  {
    id: 'tx-mbw-8712',
    title: 'Cachecol Oficial Grupo 39',
    category: 'Loja Oficial G39',
    amount: 12.00,
    date: '28 Ago 2026 · 19:30',
    method: 'MB WAY',
    phone: '912 345 678',
    sibsRef: 'MBW-2026-RAFC-8712',
    status: 'Concluído',
    statusColor: '#00C853',
  }
];

export const CHANT_OF_THE_WEEK = {
  title: 'Rio Ave Eu Sou (Até Morrer)',
  tempo: '118 BPM · Ritmo de Bancada Grupo 39',
  verse1: 'Nas margens do nosso rio / Onde o verde beija o mar / Ergue-se o nosso orgulho / Sempre a te apoiar!',
  chorus: 'Rio Ave eu sou! Rio Ave até morrer! / Grupo 39 não te vai esquecer! 🥁👏🟢⚪',
  verse2: 'Nos Arcos ou lá fora / Com chuva ou com calor / Esta camisola 12 / Canta com fervor!',
};

// ==========================================
// 1. MODO DIA DE JOGO (MATCHDAY LIVE HUB)
// ==========================================
export const MATCHDAY_DATA = {
  isActive: true,
  status: 'EM DIRETO · 64\'',
  homeScore: 1,
  awayScore: 0,
  events: [
    { minute: '38\'', player: 'Clayton Silva', type: 'golo', text: '⚽ GOLO DO RIO AVE! Remate cruzado ao ângulo superior!' },
    { minute: '52\'', player: 'Amine Oudrhiri', type: 'amarelo', text: '🟨 Cartão amarelo por corte providencial no contra-ataque.' }
  ],
  meetingPoint: {
    title: 'Concentração Oficial Porta 4',
    time: '19h15 (Receção ao Autocarro)',
    location: 'Estádio dos Arcos · Bancada Poente',
    instructions: 'Levar cachecol verde e branco e camisola oficial. Entrada coordenada com a bateria G39.'
  },
  motmCandidates: [
    { id: 'p-9', name: 'Clayton Silva', position: 'Avançado', number: 9, votes: 142, pct: 54 },
    { id: 'p-6', name: 'Amine Oudrhiri', position: 'Médio', number: 6, votes: 58, pct: 22 },
    { id: 'p-1', name: 'Jhonatan Luiz', position: 'Guarda-redes', number: 1, votes: 38, pct: 15 },
    { id: 'p-3', name: 'Jonathan Panzo', position: 'Defesa Central', number: 3, votes: 24, pct: 9 }
  ]
};

// ==========================================
// 2. LOJA OFICIAL DA CLAQUE (G39 STORE)
// ==========================================
export const STORE_PRODUCTS = [
  {
    id: 'prod-scarf-26',
    title: 'Cachecol Oficial Época 2026/2027',
    category: 'Cachecóis',
    price: 12.00,
    memberDiscount: 'Preço Sócio: 12,00 € (Público: 15,00 €)',
    badge: 'OFICIAL G39',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=400&q=80',
    description: 'Tecido duplo acetinado de alta densidade com franjas verdes e brancas. Edição oficial comemorativa Grupo 39.',
    sizes: ['Tamanho Único (140x18cm)'],
    inStock: true
  },
  {
    id: 'prod-tshirt-vdc',
    title: 'T-Shirt "Vila do Conde no Coração"',
    category: 'Vestuário',
    price: 18.00,
    memberDiscount: 'Preço Sócio: 18,00 € (Público: 22,00 €)',
    badge: 'LANÇAMENTO',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
    description: '100% Algodão Premium orgânico 190g com serigrafia de alta resistência. Emblema G39 no peito e barco poveiro/vilacondense nas costas.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true
  },
  {
    id: 'prod-cap-g39',
    title: 'Boné Bordado G39 Trucker Green',
    category: 'Acessórios',
    price: 10.00,
    memberDiscount: 'Preço Sócio: 10,00 € (Público: 13,00 €)',
    badge: 'POPULAR',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80',
    description: 'Boné estilo trucker com rede respirável para dias de jogo e pala curva. Bordado 3D de alta definição.',
    sizes: ['Ajustável (Snapback)'],
    inStock: true
  },
  {
    id: 'prod-stickers-pack',
    title: 'Pack 10 Autocolantes Ultra G39',
    category: 'Autocolantes',
    price: 3.00,
    memberDiscount: 'Pack Sócio: 3,00 €',
    badge: 'COLEÇÃO',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
    description: 'Vinil impermeável ultra resistente aos raios UV e intempéries. 10 designs exclusivos para marcar presença.',
    sizes: ['10 Unidades Sortidas'],
    inStock: true
  }
];

// ==========================================
// 3. CANCIONEIRO & REPRODUTOR DE CÂNTICOS
// ==========================================
export const CHANTS_DATA = [
  {
    id: 'chant-1',
    title: 'Rio Ave Eu Sou (Até Morrer)',
    duration: 38,
    bpm: 118,
    category: 'Hino da Bancada',
    lines: [
      { time: 0, text: 'Nas margens do nosso rio...' },
      { time: 5, text: 'Onde o verde beija o mar! 🌊🟢' },
      { time: 10, text: 'Ergue-se o nosso orgulho...' },
      { time: 15, text: 'Sempre, sempre a te apoiar! 👏' },
      { time: 20, text: 'RIO AVE EU SOU! RIO AVE ATÉ MORRER! 🥁' },
      { time: 26, text: 'GRUPO 39 NÃO TE VAI ESQUECER! 🟢⚪' },
      { time: 32, text: 'Olé, olé, olé, Rio Ave olé! 🎺🥁' }
    ]
  },
  {
    id: 'chant-2',
    title: 'Na Bancada Poente',
    duration: 32,
    bpm: 124,
    category: 'Apoio 90 Minutos',
    lines: [
      { time: 0, text: 'Na Bancada Poente nós estamos presentes!' },
      { time: 6, text: 'A cantar pelo Rio Ave para a frente! 🥁' },
      { time: 12, text: 'Com a força do mar e da nossa gente! 🌊' },
      { time: 18, text: 'Ninguém nos vai parar, somos valentes! 🟢⚪' },
      { time: 24, text: 'La la la la la la, Rio Ave olé! 👏' }
    ]
  },
  {
    id: 'chant-3',
    title: 'Verde e Branco é Paixão',
    duration: 35,
    bpm: 112,
    category: 'Clássico Vilacondense',
    lines: [
      { time: 0, text: 'Desde pequeno que sinto este amor...' },
      { time: 6, text: 'Por esta camisola e por esta cor! 🟢⚪' },
      { time: 13, text: 'Vila do Conde ergue a tua voz!' },
      { time: 19, text: 'O Grupo 39 canta por todos nós! 🥁👏' },
      { time: 26, text: 'Força Rio Ave, sê campeão! 🏆' }
    ]
  }
];

// ==========================================
// 4. FIDELIDADE & GAMIFICAÇÃO (ACHIEVEMENTS)
// ==========================================
export const FAN_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    title: '100% Arcos',
    description: 'Presença confirmada nos últimos 3 jogos em casa',
    icon: 'ShieldCheck',
    unlocked: true,
    progress: '3/3 Jogos',
    reward: 'Prioridade em Bilhética'
  },
  {
    id: 'ach-2',
    title: 'Guerreiro das Deslocações',
    description: 'Inscrição confirmada na Caravana a Alverca',
    icon: 'Bus',
    unlocked: true,
    progress: '1/1 Viagens',
    reward: 'Desconto 2€ em Cachecóis'
  },
  {
    id: 'ach-3',
    title: 'Sócio de Ouro',
    description: 'Quota anual da época 2026/2027 liquidada',
    icon: 'Award',
    unlocked: true,
    progress: 'Época Regularizada',
    reward: 'Selo Dourado no Cartão'
  },
  {
    id: 'ach-4',
    title: 'Voz da Bancada',
    description: 'Publicar no Fórum e ensaiar cânticos na app',
    icon: 'Flame',
    unlocked: false,
    progress: '1/3 Ações',
    reward: 'Badge de Chefe de Claque'
  }
];

