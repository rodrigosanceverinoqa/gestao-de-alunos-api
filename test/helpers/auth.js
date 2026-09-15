import { api } from './api.js';
import 'dotenv/config'

export async function getToken(emailUser, passwordUser) {
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('content-type', 'application/json')
        .send({
            email: emailUser,
            senha: passwordUser
        });

    return loginResposta.body.token;
}

export async function comTokenDeAdmin() {
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('content-type', 'application/json')
        .send({
            email: process.env.ADMIN_EMAIL,
            senha: process.env.ADMIN_SENHA
        });

    return `Bearer ${loginResposta.body.token}`;

}