import { api } from './api.js';
import 'dotenv/config';

async function fazerLogin(email, senha) {
  return api()
    .post('/api/auth/login')
    .set('content-type', 'application/json')
    .send({ email, senha });
}

export async function getToken(email, senha) {
  const loginResposta = await fazerLogin(email, senha);
  return loginResposta.body.token;
}

export async function loginComoAdmin() {
  return fazerLogin(process.env.ADMIN_EMAIL, process.env.ADMIN_SENHA);
}

export async function loginComoAluno(email, senha) {
  return fazerLogin(email, senha);
}

export async function comTokenDeAdmin() {
  const loginResposta = await loginComoAdmin();
  return `Bearer ${loginResposta.body.token}`;
}

export async function comTokenDeAluno(email, senha) {
  const loginResposta = await loginComoAluno(email, senha);
  return `Bearer ${loginResposta.body.token}`;
}
