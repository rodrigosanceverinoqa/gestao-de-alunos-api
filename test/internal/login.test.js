import request from 'supertest';
import app from '../../src/app.js'; // Adjust the path to your Express app
import { expect } from 'chai';
import * as sinon from 'sinon';
import authService from '../../src/services/auth.service.js';


describe('Login', () => {

    it('Login deve retornar 200 quando o usuário e senha estiverem corretos', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('content-type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });
        expect(loginResposta.status).to.equal(200);
    });


    it('Login deve retornar o e-mail correto do usuário autenticado', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('content-type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });

        expect(loginResposta.body.usuario.email).to.equal('admin@escola.com');

        console.log(loginResposta.body.usuario.email);
    });

    it('Login deve retornar 401 quando o usuário e senha estiverem incorretos', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('content-type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'wrongpassword'
            });
        expect(loginResposta.status).to.equal(401);
    });

    it('Login deve retornar 400 quando o email ou senha estiverem faltando', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('content-type', 'application/json')
            .send({
                email: 'admin@escola.com'
            });
        expect(loginResposta.status).to.equal(400);
        expect(loginResposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
        console.log(loginResposta.body); // Log the response body for debugging
    });

    it('Login deve retornar 500 quando o email ou senha estiverem faltando', async () => {

        const authServiceMock = sinon.stub(authService, 'login');
        authServiceMock.throws(new Error('Erro catastróficoooo!!!!!!'));

        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('content-type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });
        console.log(loginResposta.status);
        console.log(loginResposta.body);
        expect(loginResposta.status).to.equal(500);

        sinon.restore(); // Restore the original function after the test
    });

});