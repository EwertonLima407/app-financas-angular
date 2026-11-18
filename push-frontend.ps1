<#
.SYNOPSIS
  Script para inicializar o repositório Git do Front-end (Angular 19) e subir no GitHub organizado por features/funcionalidades.

.DESCRIPTION
  Cria commits atômicos e opcionais branches para cada módulo funcional do App:
  - feat/setup: Setup Angular 19 Standalone, Tailwind CSS e Tokens
  - feat/auth: Login, Cadastro e Interceptor JWT
  - feat/layout: Header, Seletor de Espaço, Tema e Bottom Nav
  - feat/dashboard: Dashboard com Cards de Saldo e Ações Rápidas
  - feat/expenses: Gestão de Despesas, Filtros e Bottom Sheet
  - feat/investments: Carteiras de Investimentos e Metas
  - feat/spaces: Espaços Compartilhados e Membros

.EXAMPLE
  .\push-frontend.ps1 -RepoUrl "https://github.com/SEU_USUARIO/finance-frontend.git"
#>

param(
  [Parameter(Mandatory=$false)]
  [string]$RepoUrl,

  [switch]$CreateFeatureBranches
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   📱 Subindo Front-end Angular 19 para o GitHub por Feature" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Solicita a URL do repositório remoto se não foi passada via parâmetro
if (-not $RepoUrl) {
  $RepoUrl = Read-Host "Informe a URL do repositório remoto no GitHub (ex: https://github.com/usuario/finance-frontend.git)"
  if (-not $RepoUrl) {
    Write-Host "❌ URL do repositório não informada. Operação cancelada." -ForegroundColor Red
    exit 1
  }
}

# 2. Inicializa o Git se não existir
if (-not (Test-Path ".git")) {
  Write-Host "📦 Inicializando repositório Git local..." -ForegroundColor Yellow
  git init -b main
} else {
  Write-Host "ℹ️ Repositório Git já inicializado. Garantindo branch main..." -ForegroundColor Gray
  git branch -M main
}

# 3. Configura o Remote origin
$remoteExists = git remote
if ($remoteExists -contains "origin") {
  Write-Host "🔄 Atualizando URL do remote origin..." -ForegroundColor Gray
  git remote set-url origin $RepoUrl
} else {
  Write-Host "🔗 Adicionando remote origin: $RepoUrl" -ForegroundColor Gray
  git remote add origin $RepoUrl
}

# Função auxiliar para realizar commit atômico de uma feature
function Commit-Feature {
  param(
    [string]$FeatureName,
    [string]$BranchName,
    [string]$CommitMessage,
    [string[]]$Files
  )

  Write-Host "`n🔹 Processando: $FeatureName..." -ForegroundColor Magenta

  foreach ($file in $Files) {
    if (Test-Path $file) {
      git add $file
    }
  }

  $status = git status --porcelain
  if ($status) {
    git commit -m $CommitMessage
    Write-Host "   ✅ Commit realizado: $CommitMessage" -ForegroundColor Green

    if ($CreateFeatureBranches) {
      git branch -f $BranchName
      Write-Host "   🌿 Branch criada: $BranchName" -ForegroundColor DarkCyan
    }
  } else {
    Write-Host "   ⚠️ Nenhuma alteração pendente para esta feature." -ForegroundColor DarkGray
  }
}

# ========================================================
# 4. COMMITS POR FUNCIONALIDADES / FEATURES DO FRONTEND
# ========================================================

# Feature 1: Setup & Design Tokens
Commit-Feature `
  -FeatureName "Setup Angular 19 & Tailwind CSS" `
  -BranchName "feature/setup" `
  -CommitMessage "feat(setup): angular 19 standalone, tailwind css e tokens fintech" `
  -Files @(
    "angular.json",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.spec.json",
    "tailwind.config.js",
    ".editorconfig",
    ".gitignore",
    ".vscode/",
    "public/",
    "src/index.html",
    "src/main.ts",
    "src/styles.css"
  )

# Feature 2: Autenticação & Interceptor JWT
Commit-Feature `
  -FeatureName "Autenticação & Interceptor" `
  -BranchName "feature/auth" `
  -CommitMessage "feat(auth): login, cadastro, models e interceptor jwt" `
  -Files @(
    "src/app/core/models/auth.models.ts",
    "src/app/core/services/auth.service.ts",
    "src/app/core/interceptors/auth.interceptor.ts",
    "src/app/core/guards/auth.guard.ts",
    "src/app/features/auth/"
  )

# Feature 3: Layout & Navegação Mobile
Commit-Feature `
  -FeatureName "Layout & Navegação Mobile" `
  -BranchName "feature/layout" `
  -CommitMessage "feat(layout): header responsivo, seletor de tema e bottom nav ergonômica" `
  -Files @(
    "src/app/app.component.ts",
    "src/app/app.component.html",
    "src/app/app.component.css",
    "src/app/app.routes.ts",
    "src/app/app.config.ts",
    "src/app/core/services/theme.service.ts",
    "src/app/shared/components/header/",
    "src/app/shared/components/bottom-nav/"
  )

# Feature 4: Dashboard
Commit-Feature `
  -FeatureName "Dashboard Principal" `
  -BranchName "feature/dashboard" `
  -CommitMessage "feat(dashboard): saldo previsto, resumo de contas e atalhos rapidos" `
  -Files @(
    "src/app/features/dashboard/"
  )

# Feature 5: Despesas & Parcelamentos
Commit-Feature `
  -FeatureName "Despesas & Parcelamento" `
  -BranchName "feature/expenses" `
  -CommitMessage "feat(expenses): listagem, filtros, tags de parcelas e bottom sheet de lancamento" `
  -Files @(
    "src/app/core/models/expense.models.ts",
    "src/app/core/services/expense.service.ts",
    "src/app/features/expenses/"
  )

# Feature 6: Investimentos & Metas Financeiras
Commit-Feature `
  -FeatureName "Investimentos & Metas" `
  -BranchName "feature/investments" `
  -CommitMessage "feat(investments): carteiras, aportes e metas financeiras com barra de progresso" `
  -Files @(
    "src/app/core/models/investment.models.ts",
    "src/app/core/services/investment.service.ts",
    "src/app/features/investments/",
    "src/app/features/projects/"
  )

# Feature 7: Espaços Compartilhados & Documentação
Commit-Feature `
  -FeatureName "Espaços Compartilhados & Docs" `
  -BranchName "feature/spaces" `
  -CommitMessage "feat(spaces): alternador de espaco particular vs compartilhado e documentacao" `
  -Files @(
    "src/app/core/models/space.models.ts",
    "src/app/core/services/space.service.ts",
    "src/app/features/spaces/",
    "README.md",
    "push-frontend.ps1"
  )

# Adiciona arquivos restantes (se houver)
$remaining = git status --porcelain
if ($remaining) {
  git add .
  git commit -m "chore: ajustes complementares do frontend"
  Write-Host "   ✅ Commit complementar realizado." -ForegroundColor Green
}

# ========================================================
# 5. PUSH PARA O GITHUB
# ========================================================
Write-Host "`n🚀 Enviando branch main para o GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($CreateFeatureBranches) {
  Write-Host "🌿 Enviando branches de features para o GitHub..." -ForegroundColor Yellow
  git push origin --all
}

Write-Host "`n🎉 Sucesso! O repositório do Front-end foi enviado ao GitHub com sucesso." -ForegroundColor Green
Write-Host "   URL: $RepoUrl" -ForegroundColor Cyan
