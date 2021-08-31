# Blog
Blog para postagem de artigos, possui cadastro de usuário, gestão de postagens e painel de administrador. 

## Como testar
Você pode testar localmente clonando o repositório e executando os comandos na seguinte ordem:
### `npm install`
### `nodemon app.js`
Caso tenha interesse pode testar online através de uma hospedagem no heroku: [https://vast-fortress-25518.herokuapp.com/](https://vast-fortress-25518.herokuapp.com/).

## Ferramentas utilizadas no desenvolvimento
Foi utilizado handlebars como template engine, Node.js no back-end e database com mongoDB.

## Funcionalidades
### Funções de Usuário
Cadastro, login e logout de usuário.
### Painel de admin (navbar)
Painel de admin disponível no navbar (renderização condicional para usuário logado como admin).
### Categorias e postagens
Gestão de categorias e de novas postagens pelo admin, adição, edição e exclusão de categorias e postagens.

## Funcionalidades para próximas versões
1. Gestão de usuários
