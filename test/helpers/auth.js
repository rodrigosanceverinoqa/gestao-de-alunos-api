import request from 'supertest';

export async function getToken(emailUser, passwordUser) {
    const loginResposta = await request('http://localhost:3000')
        .post('/api/auth/login')
        .set('content-type', 'application/json')
        .send({
            email: emailUser,
            senha: passwordUser
        });

    return loginResposta.body.token;
}