/// <reference types="cypress"/>
import contrato from '../contratos/produtos.contratos';

describe('Teste API em Produtos', () => {
  let token;

  beforeEach(() => {
    cy.token('ivapmn@qa.com', 'teste').then(tkn => {
      token = tkn;
    });
  });

  it.only('Deve validar contrato de produtos com sucesso', () => {
    cy.request('produtos').then(response => {
      return contrato.validateAsync(response.body);
    });
  });

  it.only('Deve listar produtos com sucesso - GET', () => {
    cy.request({
      method: 'GET',
      url: 'produtos',
    }).should(response => {
      expect(response.status).equal(200);
      expect(response.body).to.have.property('produtos');
    });
  });

  it.only('Deve cadastrar produtos com sucesso - POST', () => {
    let produto = 'Tuchaua' + Math.floor(Math.random() * 1000);
    cy.cadastrarProduto(token, produto, 10, 'Refri', 100)
      .should(response => {
        expect(response.status).equal(201);
        expect(response.body.message).equal('Cadastro realizado com sucesso');
      });
  });

  it.only('Deve validar mensagem de produto cadastrado anteriormente - POST', () => {
    cy.cadastrarProduto(token, 'produto', 10, 'Refri', 100)
      .should(response => {
        expect(response.status).equal(400);
        expect(response.body.message).equal('Já existe produto com esse nome');
      });
  });

  it.only('Deve editar um produto com sucesso - PUT', () => {
    let produto = 'Produto editado' + Math.floor(Math.random() * 1000);
    cy.cadastrarProduto(token, produto, 10, 'Produto editado', 100)
      .then(response => {
        let id = response.body._id;
        cy.request({
          method: 'PUT',
          url: `produtos/${id}`,
          headers: { authorization: token },
          body: {
            "nome": produto,
            "preco": 10,
            "descricao": "Produto editado",
            "quantidade": 100
          }
        }).should(response => {
          expect(response.body.message).to.equal('Registro alterado com sucesso');
          expect(response.status).to.equal(200);
        });
      });
  });

  it.only('Deve deletar um produto com sucesso - DELETE', () => {
    cy.cadastrarProduto(token, 'Tuchaua a ser deletado', 100, 'Delete', 50)
      .then(response => {
        let id = response.body._id;
        cy.request({
          method: 'DELETE',
          url: `produtos/${id}`,
          headers: { authorization: token }
        }).should(resp => {
          expect(resp.status).to.equal(200);
          expect(resp.body.message).to.equal('Registro excluído com sucesso');
        });
      });
  });
});
