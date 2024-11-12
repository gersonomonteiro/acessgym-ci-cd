const chai = require('chai');
const chaiHttp = require('chai-http');
const connection = require("../database");
chai.use(chaiHttp);

describe('Conexão com a Base de Dados MySQL', () => {
    it('Deve conectar à base de dados MySQL com sucesso', (done) => {        
        connection.authenticate()
        .then(() => {
          done()
        })
        .catch(err => {
          done(err);
        });
    });

});