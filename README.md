# Grupo 39 · Rio Ave F.C. 🟢⚪

> Aplicação oficial da claque **Grupo 39** (Rio Ave Futebol Clube), construída com **React Native** e **Expo SDK 57**, destacando a integração de pagamentos nacionais instantâneos via **MB WAY**, carteira de sócio digital, calendário oficial da Liga Portugal Betclic e fórum da claque.

---

## 🚀 Funcionalidades Principais

* 💳 **Checkout Nativo MB WAY & SIBS:**
  * Compra de bilhetes e lugares em autocarros para deslocações.
  * Pagamento anual de quotas de sócio (12,00 € / Época 2026/2027) com emissão imediata de comprovativo oficial SIBS.
* 🪪 **Cartão Digital de Sócio (Wallet UI):**
  * Apresentação limpa dos dados oficiais do associado (N.º Sócio `#039-1984`, setor Bancada Poente, telefone e validade da época).
  * Estado de regularização dinâmico em tempo real.
* 🏟️ **Hero Match Banner & Calendário Real da Liga Portugal:**
  * Confrontos oficiais com emblemas em alta definição dos clubes da Liga Portugal (Rio Ave FC, CF Estrela da Amadora, Alverca, Sporting CP, FC Porto, etc.).
  * Contagem decrescente, meteorologia e tabs para resultados anteriores.
* 💬 **Fórum da Bancada Poente:**
  * Tópicos organizados por categorias (*Bancada & Cânticos*, *Próxima Deslocação*, *Opinião & Debate*, *Mercado do Adepto*).
  * Sistema de upvotes, respostas dinâmicas e modal flutuante de criação de novos tópicos.
* ✨ **Liquid Glass UI & Design System:**
  * Barra flutuante translúcida com glassmorphism (`backdrop-filter: blur(20px)`), paleta de cores oficial (`#00874E`, `#0D1310`, `#F2B600`).
  * Totalmente adaptado e responsivo para smartphones e tablets.

---

## 🛠️ Tecnologias Utilizadas

* **Framework:** [Expo SDK 57](https://expo.dev/) & [React Native](https://reactnative.dev/)
* **Plataforma Web:** `react-native-web` & `@expo/metro-runtime`
* **Ícones & Estilo:** `lucide-react-native` & `expo-linear-gradient`
* **Efeitos Visuais:** `canvas-confetti`
* **Deploy:** Vercel

---

## 💻 Como Executar Localmente

1. **Instalar as dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o ambiente de desenvolvimento Web:**
   ```bash
   npm run web
   # ou
   npx expo start --web
   ```

3. **Gerar pacote de produção Web:**
   ```bash
   npm run build
   ```
   Os ficheiros otimizados serão criados na pasta `dist/`.

---

## 🌐 Deploy na Vercel

O projeto já inclui o ficheiro `vercel.json` configurado para exportação automática de Expo Web:

1. Acede ao painel da [Vercel](https://vercel.com/) e clica em **"Add New Project"**.
2. Importa o repositório GitHub `jorgemarques1339/ultras_39`.
3. As definições padrão detetadas serão:
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Clica em **Deploy**! A tua aplicação ficará online de imediato com suporte HTTPS e domínio `.vercel.app`.

---

*Orgulho Vilacondense · Grupo 39 · Rio Ave F.C.*
