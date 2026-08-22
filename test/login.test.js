import request from 'supertest';
import app from '../src/app.js'; // Adjust the path to your Express app
import { expect } from 'chai';

describe('Login', () => {
    it('Login deve retornar 200 quando o usuário e senha estiverem corretos', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('content-type', 'application/json')
            .send({ email: 'admin@escola.com', senha: 'admin123' });
        expect(loginResposta.status).to.equal(200);
    });
});