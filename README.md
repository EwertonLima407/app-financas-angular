# 📱 App Finanças - Frontend Angular 19

Frontend moderno, responsivo e mobile-first (Android & iOS) para o SaaS de Gestão de Despesas e Investimentos Pessoais e Compartilhados, desenvolvido em **Angular 19** e **Tailwind CSS**.

Baseado na especificação técnica de UI/UX em [`GUIA_PLANEJAMENTO_FRONTEND_ANGULAR19.md`](../Gestão%20de%20Finanças%20Antrigravity/GUIA_PLANEJAMENTO_FRONTEND_ANGULAR19.md).

---

## 🚀 Como Executar o Projeto

### 1. Iniciar o Backend (API)
No terminal do projeto backend (`Gestão de Finanças Antrigravity`):
```bash
npm run dev
# ou
npm start
```
A API estará ativa em `http://localhost:3333`.

### 2. Iniciar o Frontend (Angular 19)
No terminal deste projeto (`app-financas-angular`):
```bash
npm start
# ou
ng serve --open
```
O aplicativo abrirá automaticamente no navegador em `http://localhost:4200`.

---

## 🛠️ Tecnologias & Arquitetura

* **Angular 19.0+:** 100% Standalone Components (sem NgModules).
* **State Management:** **Angular Signals** (`signal()`, `computed()`, `effect()`) para reatividade leve e instantânea.
* **Estilização:** **Tailwind CSS v3** com tokens de design fintech, Dark/Light mode nativo e suporte a Safe Areas mobile (Android/iOS).
* **Segurança & Auth:** `HttpInterceptorFn` para injeção automática do cabeçalho `Authorization: Bearer <token>` e `CanActivateFn` para proteção de rotas.
* **Internacionalização:** Formatação nativa de moeda brasileira (`R$ 1.234,56`) e datas (`dd/MM/yyyy`) via `pt-BR`.

---

## 📂 Estrutura de Pastas

```text
src/app/
├── core/
│   ├── guards/          # auth.guard.ts (Proteção de rotas)
│   ├── interceptors/    # auth.interceptor.ts (Injeção de JWT)
│   ├── models/          # auth, expense, investment, space models
│   └── services/        # auth, expense, investment, space, theme (Signals)
├── features/
│   ├── auth/            # login e register
│   ├── dashboard/       # resumo geral, previsão de saldo, cards de ação rápida
│   ├── expenses/        # lista com filtros, parcelamento recorrente e bottom sheet
│   ├── investments/     # carteiras e aportes
│   ├── projects/        # metas financeiras com barras de progresso
│   └── spaces/          # modo particular vs espaços compartilhados
├── shared/
│   └── components/
│       ├── header/      # saudação, seletor de espaço, toggle tema, logout
│       └── bottom-nav/  # navegação inferior ergonômica para polegar (thumb-zone)
├── app.config.ts        # provedores http com interceptor e pt-BR
└── app.routes.ts        # rotas lazy-loaded
```

---

## 📱 Destaques Mobile (Figma Blueprint)

* **Bottom Navigation Bar:** Acesso rápido ergonômico a Início, Despesas, (+ Novo Lançamento), Investimentos e Espaços.
* **Bottom Sheet Modals:** Deslizam suavemente de baixo para cima com formulários compactos para touch.
* **Seletor de Espaço:** Alternância instantânea no topo entre **Modo Particular (Privado)** e **Espaços Compartilhados (Casal / Família)** com garantia total de privacidade.
