<img width="800" height="194" alt="Banner" src="https://github.com/user-attachments/assets/6066d277-523d-4d97-a763-0f01ba283585" />

# Gestão de Controle — Baba Maria Massas

Sistema desktop simples para controle de estoque de uma pequena produção artesanal de massas, a Baba Maria Massas. Projeto pessoal desenvolvido para fins de portfólio e aprendizado durante a graduação em Engenharia de Software.

## Sobre o projeto

A aplicação roda localmente no computador, sem necessidade de servidor externo ou banco de dados remoto. Ela permite cadastrar produtos, controlar as quantidades em estoque e registrar entradas e saídas, mostrando também um pequeno painel com o resumo da situação atual do estoque.

## Tecnologias

- Node.js
- Electron
- JavaScript
- HTML
- CSS
- LowDB

## Funcionalidades

- Dashboard com resumo do estoque (total de produtos, produtos com estoque baixo e total de itens)
- Cadastro, edição e exclusão de produtos
- Listagem de produtos com status (Normal, Estoque baixo, Sem estoque)
- Registro de movimentações de entrada e saída de estoque
- Histórico de movimentações, mais recentes primeiro
- Página de estoque com busca por nome do produto
- Persistência dos dados em arquivo local (LowDB), mesmo após fechar o programa
