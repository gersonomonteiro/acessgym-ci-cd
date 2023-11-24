const chai = require('chai')
const http = require('chai-http')
const subSet = require('chai-subset')
const should = chai.should()
const expect = chai.expect

const server = require('../index') // Arquivo a ser testado

chai.use(http)
chai.use(subSet)

const BASE_URL = 'http://localhost:8080'
describe('Teste unitario de API que retorna cliente por ID', () => {
    describe('/GET/:id client', () => {
        it('Deve retornar status 200', (done) => {
            chai.request(BASE_URL)
                .get('/api/YHxmMxpyhuc45GCyB9J3/1')
                .end((err, res) => {
                    res.should.have.status(200)
                    done();
                })
        })
        it('Deve retornar um object', (done) => {
            chai.request(BASE_URL)
                .get('/api/YHxmMxpyhuc45GCyB9J3/1')
                .end((err, res) => {
                    res.body.should.be.a('object')
                    done();
                })
        })
    })
})
describe('Teste unitario de API que retorna role por ID', () => {
    describe('/GET/:id role', () => {
        it('Deve retornar status 200', (done) => {
            chai.request(BASE_URL)
                .get('/api/o7zi8Q4xeg1JjbD3f5v6/1')
                .end((err, res) => {
                    res.should.have.status(200)
                done();
                })
        })
        it('Deve retornar um object', (done) => {
            chai.request(BASE_URL)
                .get('/api/o7zi8Q4xeg1JjbD3f5v6/1')
                .end((err, res) => {
                    res.body.should.be.a('object')
                    res.body.role.should.have.property('id').eql(1);
                    res.body.role.should.have.property('name')
                done()
                })
        })
    })
})
