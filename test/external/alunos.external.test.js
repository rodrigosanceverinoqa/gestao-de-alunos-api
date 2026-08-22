import request from 'supertest';
import { expect } from 'chai';
import { getToken } from '../helpers/auth.js';

function gerarAluno() {
    const identificador = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    return {
        nome: 'João da Silva',
        email: `joao.${identificador}@example.com`,
        matricula: `MAT-${identificador}`,
        senha: 'senha@123'
    };
}

describe('Login', () => {
    let token;

    beforeEach(async () => {
        token = await getToken('admin@escola.com', 'admin123');
    });

    it('deve cadastrar um aluno quando ele informa dados válidos', async () => {
        const aluno = gerarAluno();

        //cadastrar aluno
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('content-type', 'application/json')
            .set('authorization', `Bearer ${token}`)
            .send(aluno);

        //validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal(aluno.nome);
        expect(cadastroAlunoResposta.body.email).to.equal(aluno.email);
        expect(cadastroAlunoResposta.body.matricula).to.equal(aluno.matricula);


    });

    it('deve negar o cadastro de um aluno quando ele já existe', async () => {
        const aluno = gerarAluno();

        const primeiroCadastroResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('content-type', 'application/json')
            .set('authorization', `Bearer ${token}`)
            .send(aluno);

        expect(primeiroCadastroResposta.status).to.equal(201);

        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('content-type', 'application/json')
            .set('authorization', `Bearer ${token}`)
            .send(aluno);

        //validar que o cadastro foi negado
        expect(cadastroAlunoResposta.status).to.equal(409);
        expect(cadastroAlunoResposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');
    });
});

