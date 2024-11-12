const User = require('../models/User')
const Role = require('../models/Role')
const Permission = require('../models/Permission')
const { Op } = require('sequelize')

const chai = require('chai');
const chaiHttp = require('chai-http');
const subSet = require('chai-subset')
const server = require('../index'); // Caminho para o arquivo do servidor

const { name } = require('ejs');
chai.use(chaiHttp);
chai.use(subSet)
const { expect } = chai;
var bcrypt = require('bcryptjs')

const pwd = bcrypt.hashSync('unit.testpwd', 8)
let token
let userId
let roleId
describe('Teste unitario de operações com utilizador e role', () => {
    
    
    it('Deve criar um Utilizador', async () => {
        const  roles = ['unitest']

        const user = new User({ firstname: 'unit',lastname: 'test', email: 'unit.test@gmail.com', password: pwd, ative: 1});
        const result = await user.save();
        userId = result.id
        expect(result).to.have.property('id');
    });
    
    it('Deve criar um role', async () => {
        const  permissions = ['READ_USER','READ_ROLE','DELETE_ROLE']
        const  users = ['unit.test@gmail.com']
        const role = new Role({name: 'unitest', description: 'Regra para unit test'})
        const roleResult = await role.save();
        Permission.findAll({
            where: {
                name: {
                    [Op.or]:
                        permissions,
                },
            },
        }).then((permissions) => {
            role.setPermission(permissions)
        })
        roleId = roleResult.id
        expect(roleResult).to.have.property('id');
    });

    it('Deve atualizar utilizador', async () => {
        const  roles = ['unitest']
        const  email = 'unit.test@gmail.com'
        Role.findAll({
            where: {
                name: {
                    [Op.or]: roles,
                },
            },
        }).then((roles) => {
            User.findOne({
                where: {
                    email: email,
            }
            }).then((user) => {   
                user.setRoles(roles).then((res) => {
                    expect(res).to.have.property('user_roles');

                })
            })
            
        })
    });
});
describe('Teste unitario de Autenticação', () => {    

    it('Deve retornar 200 e token de acesso', (done) => {
        // Gerar um token válido para autenticação
        chai.request(server)
            .post('/api/auth/signin')
            .send({ email: 'unit.test@gmail.com', password: 'unit.testpwd' })
            .end((err, res) => {
                token = res.body.token;
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('token');
                done();
            });
    });
});
describe('Teste unitario em APIs', () => {
    it('Deve retornar 200 e listar utilizadores', (done) => {
        chai.request(server)
            .get('/api/user')
            .set('x-access-token', `${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });
    it('Deve retornar 200 e listar roles', (done) => {
        chai.request(server)
            .get('/api/roles')
            .set('x-access-token', `${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });
    it('Deve retornar 200 e eliminar role criado', (done) => {
        const url = `/api/role/${roleId}`
        chai.request(server)
            .delete(url)
            .set('x-access-token', `${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').eql('Role eliminado com sucesso!');
                done();
            });
    });

});
describe('Teste unitario de operações com utilizador e role', () => {
    it('Deve eliminar utilizador criado', async () => {
        User.destroy({
            where: {
                id: userId,
            },
        }).then((user) => {    
            console.log(user)           
            expect(res).to.have.property('user_roles');
        })
       
    });
})
