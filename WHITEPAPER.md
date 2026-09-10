# White Paper Oficial · Aplicação Mobile Grupo 39 (Rio Ave FC)

> **Documento Oficial de Arquitetura, Funcionalidades e Especificação de Produto**  
> **Claque Oficial Grupo 39 · Rio Ave Futebol Clube**  
> **Versão:** v2.4.0 (Production) · **Data:** Setembro 2026 · **Local:** Vila do Conde, Portugal  
> **Versão em PDF:** [`Whitepaper_Grupo_39_Rio_Ave_FC.pdf`](file:///c:/Users/wolfi/Desktop/Grupo_39/Whitepaper_Grupo_39_Rio_Ave_FC.pdf)

---

## 1. Resumo Executivo & Visão do Produto

A aplicação mobile do **Grupo 39** foi concebida e desenvolvida para ser a plataforma digital central dos sócios e adeptos da claque oficial do **Rio Ave Futebol Clube**. Reunindo tecnologia moderna de referência internacional com a identidade bairrista e apaixonada de Vila do Conde, o ecossistema digital elimina burocracias no apoio à equipa, simplificando:

1. **Bilhética e Apoio nos Arcos:** Aquisição instantânea de bilhetes para a Bancada Poente em dias de jogo da Liga Portugal Betclic.
2. **Quota Anual de Sócio (12,00 €):** Pagamento eletrónico simplificado via **MB WAY** com emissão imediata do comprovativo oficial da SIBS.
3. **Cartão Digital de Sócio & Torniquetes:** Identificação com reflexo holográfico 3D e exportação para **Apple Wallet** e **Google Wallet** com código de torniquete offline.
4. **Envolvimento Comunitário e Bancada:** Feed do Fórum, Cancioneiro oficial com letras sincronizadas, Modo Dia de Jogo com marcador ao vivo e Loja Oficial de Merchandising.

---

## 2. Identidade Visual & Design System

* **Cores Oficiais:**
  * **Verde Rio Ave Primário:** `#00874E` (Bordas ativas: `#00B368` / `#00A859`)
  * **Dourado Vilacondense / Arcos:** `#F2B600` (Acentos luminosos e selos de sócio efetivo)
  * **Dark Slate Noturno:** `#0D1310` e `#070E0A` (Conforto visual em jogos noturnos e economia de bateria em ecrãs OLED)
* **Conceito Liquid Glass UI:** Elementos de navegação e cartões concebidos com estética translúcida de vidro líquido, desfoque de fundo (`backdrop-filter: blur(20px)`), reflexos esmeralda e transições suaves.
* **Ergonomia Multi-Dispositivo:** Design 100% responsivo para smartphones de qualquer dimensão (desde o iPhone SE até ao iPhone 16 Pro Max e Android de 360px a 430px+) e tablets (iPads de 768px a 1024px+).

---

## 3. Detalhe e Finalidade de Cada Secção da Aplicação

### A. Cabeçalho Superior Retrátil (`Header.js`)
* **Para que serve:** Identificação institucional discreta no topo e maximização da área de leitura útil.
* **Características:**
  * Altura ultracompacta de **52px**.
  * Emblema oficial **G39** com micro-badge **RAFC** e selo dourado **OFICIAL**.
  * Botão de notificações com sinalizador luminoso verde.
  * **Comportamento Dinâmico (*Auto-Hide on Scroll*):** Quando o adepto faz scroll para baixo, o cabeçalho recolhe suavemente (`translateY: -52px`, `opacity: 0`), libertando 100% do ecrã para o conteúdo. Ao menor deslize para cima, o cabeçalho reaparece instantaneamente (220ms). Ao mudar de separador, a sua visibilidade é automaticamente reposta.

---

### B. Separador 1: Página Inicial / Início (`HomeScreen.js`)
* **Para que serve:** Centro de operações diário do adepto e ponto de encontro em dias de jogo.
* **Módulos Integrados:**
  1. **Smart Slider de Destaques:** Carrossel horizontal deslizante automático a cada 4,5s com mensagens de boas-vindas ao associado, chamada para a Bancada Poente e caravanas de autocarro.
  2. **Atalhos Rápidos de Estádio:**
     * 🥁 **Cancioneiro G39:** Acesso direto ao leitor interativo de músicas com bateria e letras sincronizadas.
     * 🛍️ **Loja Oficial G39:** Catálogo exclusivo com compra imediata via MB WAY.
  3. **Cartão do Próximo Jogo Oficial:**
     * Confronto real da **Liga Portugal Betclic (6.ª Jornada): Rio Ave FC vs CF Estrela da Amadora** no Estádio dos Arcos.
     * Emblemas oficiais de alta definição dos clubes.
     * Data e hora claras: `14 Set · 20h15`.
     * Botão compacto **"Comprar Bilhete"** via MB WAY (sem poluição de lotação ou meteorologia).
  4. **Modo Dia de Jogo (*Matchday Live Hub*):**
     * Indicador luminoso pulsante verde `MODO DIA DE JOGO`.
     * Marcador ao vivo em tempo real (`Rio Ave FC 1 - 0 CF Estrela da Amadora · 64'`).
     * Concentração da Bancada Poente: `Porta 4 às 19h15 (Receção ao Autocarro da equipa)`.
     * Votação interativa dos adeptos para o *"Guerreiro da Bancada"* (Clayton Silva, Amine, Jhonatan Luiz, Jonathan Panzo) com cálculo de percentagens em tempo real.
  5. **Deslocações & Notícias da Claque:**
     * Informação detalhada das caravanas fora (ex: Caravana a Alverca com partida do Cais da Alfândega).
     * Reserva imediata do pack Autocarro + Bilhete por 15,00 € com MB WAY.

---

### C. Separador 2: Fórum da Comunidade (`ForumScreen.js`)
* **Para que serve:** Espaço oficial de debate, organização da bancada e convívio entre associados.
* **Características:**
  * **Filtro por Categorias Temáticas:** *"Todos os Tópicos"*, *"Bancada & Cânticos"*, *"Próxima Deslocação"*, *"Opinião & Debate"* e *"Mercado do Adepto"*.
  * **Atalho Especial de Cânticos:** Botão `Cânticos G39 🥁` destacado na própria barra de categorias.
  * **Feed Limpo de Publicações:** Cartões elegantes focados no autor, distintivo associativo (ex: *Chefe de Bancada*, *Sócio G39*), tempo decorrido e texto do tópico, sem tags ou hashtags poluídas.
  * **Upvotes Reativos:** Apoio com incremento/decremento dinâmico de votos.
  * **Respostas Expansíveis:** Leitura em acordeão e submissão de novos comentários em tempo real.
  * **Botão Flutuante Compacto (FAB):** Botão discreto `+ Novo Tópico` na base, adaptado para ecrãs de smartphones sem cobrir os posts.

---

### D. Separador 3: Calendário Desportivo (`CalendarScreen.js`)
* **Para que serve:** Planeamento de presença nos jogos da época e acompanhamento da tabela desportiva.
* **Características:**
  * **Aba 1: Próximos Jogos:** Calendário das jornadas futuras da Liga Portugal Betclic (CF Estrela da Amadora, FC Alverca, SC Braga, FC Famalicão) com indicação do estádio, data/hora e compra de bilhetes.
  * **Aba 2: Resultados Anteriores:** Histórico oficial dos jogos disputados na época (Santa Clara, Sporting CP, Estoril Praia, FC Porto).

---

### E. Separador 4: Perfil do Adepto & Carteira de Sócio (`ProfileScreen.js`)
* **Para que serve:** Identificação oficial do sócio, gestão de quotas e arquivo de comprovativos legais.
* **Módulos Integrados:**
  1. **Cartão Digital Holográfico de Sócio 3D:**
     * Efeito de brilho metálico reativo ao toque e movimento.
     * Dados oficiais completos: Nome, N.º de Sócio (`#039-1984`), Época Ativa (`2026/2027`), Filiação (`Desde 2019`), Setor (`Bancada Poente`), Contacto MB WAY e Validade.
     * Indicador de estado luminoso: `EM DIA` ou `PENDENTE`.
  2. **Carteira Digital (*Apple Wallet & Google Wallet*):**
     * Botão oficial `Guardar na Carteira Digital`.
     * Abre o modal do passe digital (`.pkpass`) com código de barras Code128 e leitor NFC para passagem nos torniquetes dos Arcos sem necessidade de internet.
  3. **Fidelidade de Bancada & Gamificação (*Check-in nos Arcos*):**
     * Botão interativo `📍 Fazer Check-in no Estádio dos Arcos` para registar presença no dia de jogo.
     * Contador oficial de presenças apoiadas na época (ex: *14 / 15 Presenças*).
     * Vitrine de Crachás de Sócio:
       * 🏟️ *100% Arcos* (Presença nos jogos em casa)
       * 🚌 *Guerreiro das Deslocações* (Caravana a Alverca)
       * 💳 *Sócio de Ouro* (Quota anual liquidada)
       * 🗣️ *Voz da Bancada* (Participação na comunidade e cânticos)
  4. **Gestão de Quota Anual de Sócio (12,00 €):**
     * Cobrança anual única referente à época ativa (2026/2027).
     * Botão direto `Liquidar Quota Anual via MB WAY (12,00 €)`.
     * Ao pagar, o cartão transita instantaneamente para verde com o selo regularizado.
  5. **Histórico de Movimentos & Recibos SIBS:**
     * Registo cronológico de todas as compras de bilhetes, quotas e artigos.
     * Botão para rever a qualquer momento o comprovativo oficial timbrado SIBS.

---

### F. Módulos Globais e Modais Especiais

#### 1. Motor de Pagamentos MB WAY (`MbWayCheckoutModal.js`)
* **Para que serve:** Processamento instantâneo de transações eletrónicas seguras sem necessidade de cartão de crédito.
* **Fluxo:**
  1. O adepto clica em comprar ou liquidar quota.
  2. O modal exibe o resumo, taxa SIBS grátis (0,00 €) e telemóvel pré-preenchido (+351 912 345 678).
  3. Contagem decrescente de segurança de 4 minutos simulando o push oficial da aplicação MB WAY.
  4. Sucesso instantâneo com checkmark animado, emissão de recibo SIBS e atualização em tempo real do estado do sócio.

#### 2. Comprovativo Oficial SIBS (`ReceiptModal.js`)
* **Para que serve:** Emissão de documento fiscal e comprovativo com valor legal para apresentação na sede ou nas portas do estádio.
* **Detalhes:** Cabeçalho SIBS / MB WAY, Referência única (ex: `MBW-2026-RAFC-9821`), Código de Autorização bancária, data/hora e dados do associado.

#### 3. Loja Oficial da Claque (`StoreModal.js`)
* **Para que serve:** Venda de artigos oficiais e sustentabilidade financeira do Grupo 39.
* **Catálogo:** Cachecol Oficial 2026/2027 (12,00 €), T-Shirt "Vila do Conde no Coração" (18,00 €), Boné Trucker G39 (10,00 €) e Pack 10 Autocolantes (3,00 €). Todos com compra integrada num clique via MB WAY.

#### 4. Cancioneiro & Bateria da Claque (`ChantsModal.js`)
* **Para que serve:** Preservação cultural, ensino e unificação dos cânticos de apoio.
* **Tecnologia:** Síntese de ritmo sonoro de bancada a 118-124 BPM e letras sincronizadas com iluminação progressiva tipo karaoke (*"Rio Ave Eu Sou"*, *"Na Bancada Poente"*, *"Verde e Branco é Paixão"*).

#### 5. Barra de Navegação Flutuante (`LiquidGlassNavBar.js`)
* **Para que serve:** Navegação ergonómica com o polegar.
* **Design:** Ancorada a 100% na base em smartphones com preenchimento seguro de gestos (`bottom: 0`), e flutuante centrada em tablets (`bottom: 20`, `maxWidth: 520`).

---

## 4. Arquitetura Técnica & Especificações de Engenharia

| Componente | Implementação | Benefício para o Adepto |
| :--- | :--- | :--- |
| **Framework** | React Native / Expo (v57) | Aplicação universal para Android, iOS e Web. |
| **Estilos** | Pure StyleSheet (sem Tailwind) | Máxima performance, zero overhead, animações 60 FPS. |
| **Layout** | Docking inferior a 100% | Ergonomia total com uma só mão em qualquer smartphone. |
| **Offline Pass** | Apple / Google Wallet `.pkpass` | Entrada direta nos torniquetes mesmo sem internet. |
| **Hosting** | Vercel Edge Global Network | Carregamento sub-segundo em qualquer operador móvel. |
| **Versionamento** | Git no GitHub (`jorgemarques1339/ultras_39`) | Histórico de código auditável e deploys automáticos. |

---

## 5. Como Gerar e Consultar a Versão em PDF

O documento oficial em formato **PDF** de alta fidelidade gráfica encontra-se compilado na raiz do projeto:
- **Ficheiro:** [`Whitepaper_Grupo_39_Rio_Ave_FC.pdf`](file:///c:/Users/wolfi/Desktop/Grupo_39/Whitepaper_Grupo_39_Rio_Ave_FC.pdf)
- **Tamanho:** ~1,42 MB (5 páginas completas no formato A4, com capa institucional, tabelas, caixas de destaque e selos oficiais).

---

> **GRUPO 39 · RIO AVE FUTEBOL CLUBE**  
> *Vila do Conde no Coração · Desde 1984*  
> Todos os direitos reservados.
