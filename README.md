#  Daily Diet API

API para controle de refeições diárias e acompanhamento de métricas de dieta de um usuário.

A aplicação permite que usuários registrem suas refeições, indiquem se estão dentro ou fora da dieta e acompanhem estatísticas sobre seu progresso.

---

#  Tecnologias utilizadas

- Node.js
- Fastify
- Knex.js
- SQLite
- Vitest
- Supertest
- TypeScript

---

#  Requisitos da aplicação

## RF (Requisitos Funcionais)

- [x] O usuário deve poder criar uma conta
- [x] O usuário deve poder ser identificado entre as requisições através de uma sessão

### Usuário

- [x] O usuário deve poder visualizar seus dados

### Refeições

- [x] O usuário deve poder registrar uma nova refeição
- [x] O usuário deve poder editar uma refeição
- [x] O usuário deve poder apagar uma refeição
- [x] O usuário deve poder listar todas as refeições que registrou
- [x] O usuário deve poder visualizar uma única refeição

### Métricas

- [x] O usuário deve poder visualizar suas métricas de dieta
- [x] Deve ser possível visualizar a **quantidade total de refeições registradas**
- [x] Deve ser possível visualizar a **quantidade de refeições dentro da dieta**
- [x] Deve ser possível visualizar a **quantidade de refeições fora da dieta**
- [x] Deve ser possível visualizar a **melhor sequência de refeições dentro da dieta**

---

# 📏 RN (Regras de Negócio)

- [x] Uma refeição deve pertencer a um usuário
- [x] Uma refeição deve possuir:
  - nome
  - descrição
  - data
  - indicação se está dentro da dieta (`is_on_diet`)
- [x] O usuário só pode visualizar refeições que ele criou
- [x] O usuário só pode editar refeições que ele criou
- [x] O usuário só pode deletar refeições que ele criou

---

# ⚙️ RNF (Requisitos Não Funcionais)

- [x] A aplicação deve utilizar **cookies** para identificar o usuário entre as requisições
- [x] O banco de dados deve ser gerenciado utilizando **Knex.js**
- [x] Os testes devem ser implementados utilizando **Vitest**
- [x] Os testes de integração devem utilizar **Supertest**
- [x] A aplicação deve utilizar **Fastify** como framework HTTP

---

# 🧪 Testes

A aplicação possui testes de integração para validar:

- criação de usuários
- criação de refeições
- listagem de refeições
- visualização de refeições
- cálculo das métricas

---

