# FoodMatch - Seu Assistente Inteligente de Alimentação

O FoodMatch é um aplicativo inteligente que ajuda usuários a combinarem alimentos e bebidas com base em seus objetivos nutricionais e preferências. Ele calcula informações nutricionais, sugere receitas e gera listas de compras inteligentes com foco em praticidade, sabor e custo-benefício.

## Funcionalidades do MVP

- **Cadastro/Login de Usuário**: Registro com informações básicas e objetivos nutricionais
- **Dashboard**: Resumo do objetivo nutricional e acesso rápido às funcionalidades
- **Listagem de Receitas**: Visualização de receitas com detalhes nutricionais
- **Match de Alimentos e Bebidas**: Sugestões de combinações ideais
- **Visualização Nutricional**: Informações detalhadas sobre valores nutricionais

## Tecnologias Utilizadas

- **Backend**: Django REST Framework (Python)
- **Banco de Dados**: PostgreSQL
- **Frontend**: React (Next.js)
- **Autenticação**: JWT

## Instalação e Execução

### Backend (Django)

```bash
# Navegar para o diretório do backend
cd backend

# Instalar dependências
pip install -r requirements.txt

# Executar migrações do banco de dados
python manage.py migrate

# Carregar dados iniciais (opcional)
python manage.py loaddata initial_data.json

# Iniciar o servidor
python manage.py runserver
```

### Frontend (Next.js)

```bash
# Navegar para o diretório do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

## Estrutura do Projeto

- `/backend`: API Django REST Framework
- `/frontend`: Aplicação Next.js
- `/docs`: Documentação adicional