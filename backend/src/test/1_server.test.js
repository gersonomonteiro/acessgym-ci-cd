const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index'); // Caminho para o arquivo do servidor
const { expect } = chai;

chai.use(chaiHttp);

describe('Inicialização do Servidor', () => {
    it('Deve responder com status 200 na rota base', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').eql('AcessGym UP and Running');
                done();
            });
    });
});
