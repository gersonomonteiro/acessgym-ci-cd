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
        it('Deve retornar status 200', () => {
            chai.request(BASE_URL)
                .get('/api/client/1')
                .end((err, res) => {
                    res.should.have.status(200)
                })
        })
        it('Deve retornar um object', () => {
            chai.request(BASE_URL)
                .get('/api/client/1')
                .end((err, res) => {
                    res.body.should.be.a('object')
                    res.body.client.should.have.property('id')
                    res.body.client.should.have.property('cardCode')
                    res.body.client.should.have.property('fullName')
                })
        })
    })
})
