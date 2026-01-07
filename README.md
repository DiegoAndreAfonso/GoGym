# Sobre o Projeto


## GoGym 

    GoGym é um aplicativo móvel voltado para o gerenciamento de treinos e o incentivo à prática constante de atividades físicas. Nele, o usuário pode criar sua própria ficha de treino, acompanhar seu progresso e participar de competições amistosas com amigos.

## Arquitetura 

                        ┌─────────────────────────────────────────────┐
                        │              ARQUITETURA                    │
                        ├─────────────────────────────────────────────┤
                        │    📱 React Native (Mobile)                 │
                        │    🌐 Laravel API (Backend)                 │
                        │    🗄️  MySQL (Banco de Dados)               │
                        └─────────────────────────────────────────────┘

## Pré-requisitos
 
### Ferramentas Necessárias
    Ferramenta	Versão	Descrição
    PHP	≥ 8.1	Backend Laravel
    Composer	≥ 2.0	Gerenciador de dependências PHP
    Node.js	≥ 18.0	Frontend e Mobile
    npm ou yarn	Latest	Gerenciador de pacotes JavaScript
    MySQL	≥ 8.0	Banco de dados
    Git	≥ 2.0	Controle de versão
    Expo CLI	≥ 49.0	Desenvolvimento mobile

### Verificando as Instalações
    # Verifique as versões instaladas
    php --version
    composer --version
    node --version
    npm --version
    mysql --version
    git --version

## Configuração Inicial

#### Clone o projeto


    git clone https://github.com/seu-usuario/gogym.git

#### Acesse a pasta do projeto
    cd gogym

### Estrutura do projeto
    gogym/
    ├── backend/          # API Laravel
    ├── frontend/         # Mobile (React Native)
    └── README.md

## Configuração do Backend (Laravel)
#### Navegue para a pasta do backend
    cd backend

### Instale as dependências do PHP
    composer install

### Copie o arquivo de ambiente
    cp .env.example .env

### Configure o arquivo .env com suas credenciais
    # Edite principalmente:
    # - DB_DATABASE
    # - DB_USERNAME
    # - DB_PASSWORD

### Gere a chave da aplicação
    php artisan key:generate
### Execute as migrações do banco de dados
    php artisan migrate

### Popule o banco com dados iniciais (opcional)
    php artisan db:seed

### Gere as chaves para API (Passport)
    php artisan passport:install

## Configuração do Frontend 
### Volte para a raiz do projeto
    cd ..

### Acesse a pasta do frontend
    cd frontend

### Instale as dependências
    npm install  # ou yarn install

# Executando o Projeto

## Passo 1: Inicie o Backend


### Em um terminal, na pasta backend/
    cd backend

### Execute o servidor Laravel
    php artisan serve

## Passo 2: Inicie o Frontend Web

### Em outro terminal, na pasta frontend/
    cd frontend

### Execute o servidor de desenvolvimento
    npm expo start  


    Escaneie o QR Code com:
    - Expo Go App (disponível nas app stores)
    - Ou pressione:
    • 'w' para web

# Comandos Úteis
## Backend (Laravel)
    php artisan serve          # Inicia servidor
    php artisan migrate        # Executa migrações
    php artisan migrate:fresh  # Recria banco
    php artisan db:seed        # Popula dados
    php artisan tinker         # Console interativo
    php artisan route:list     # Lista rotas


## Mobile (React Native)
    npx expo start     # Inicia servidor Expo
    npx expo start --web      # Web apenas
    npx expo prebuild  # Gera código nativo

## Verifique se o MySQL está rodando
    sudo systemctl status mysql

## Inicie o MySQL se necessário
    sudo systemctl start mysql


<div align="center">