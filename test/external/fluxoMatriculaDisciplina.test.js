import request from 'supertest';
import { expect } from 'chai';

function gerarAluno() {
    const identificador = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    return {
        nome: 'João da Silva',
        email: `joao.${identificador}@example.com`,
        matricula: `MAT-${identificador}`,
        senha: 'senha@123'
    };
}

describe('Matricula de aluno em disciplina', () => {
    it('deve autenticar um administrador e obter o token', async () => {
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('content-type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });

        expect(loginResposta.status).to.equal(200);
        expect(loginResposta.body.token).to.be.a('string');
    });

    it('deve cadastrar um novo aluno', async () => {
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('content-type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });
        const token = loginResposta.body.token;
        const aluno = gerarAluno();

        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('content-type', 'application/json')
            .set('authorization', `Bearer ${token}`)
            .send(aluno);

        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal(aluno.nome);
        expect(cadastroAlunoResposta.body.email).to.equal(aluno.email);
        expect(cadastroAlunoResposta.body.matricula).to.equal(aluno.matricula);
    });

    it('deve cadastrar uma disciplina', async () => {
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('content-type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });
        const token = loginResposta.body.token;
        const disciplina = {
            nome: 'Matemática',
            codigo: `MAT-${Date.now()}`,
            cargaHoraria: 80
        };

        const cadastroDisciplinaResposta = await request('http://localhost:3000')
            .post('/api/admin/disciplinas')
            .set('content-type', 'application/json')
            .set('authorization', `Bearer ${token}`)
            .send(disciplina);

        expect(cadastroDisciplinaResposta.status).to.equal(201);
        expect(cadastroDisciplinaResposta.body.nome).to.equal(disciplina.nome);
        expect(cadastroDisciplinaResposta.body.codigo).to.equal(disciplina.codigo);
    });

    it('deve matricular um aluno em uma disciplina', async () => {
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('content-type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });
        const token = loginResposta.body.token;
        const aluno = gerarAluno();

        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('content-type', 'application/json')
            .set('authorization', `Bearer ${token}`)
            .send(aluno);

        const cadastroDisciplinaResposta = await request('http://localhost:3000')
            .post('/api/admin/disciplinas')
            .set('content-type', 'application/json')
            .set('authorization', `Bearer ${token}`)
            .send({
                nome: 'História',
                codigo: `HIS-${Date.now()}`,
                cargaHoraria: 60
            });

        const matriculaResposta = await request('http://localhost:3000')
            .post(`/api/admin/disciplinas/${cadastroDisciplinaResposta.body.id}/matriculas`)
            .set('content-type', 'application/json')
            .set('authorization', `Bearer ${token}`)
            .send({ alunoId: cadastroAlunoResposta.body.id });

        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroDisciplinaResposta.status).to.equal(201);
        expect(matriculaResposta.status).to.equal(201);
        expect(matriculaResposta.body.alunoId).to.equal(cadastroAlunoResposta.body.id);
        expect(matriculaResposta.body.disciplinaId).to.equal(cadastroDisciplinaResposta.body.id);
    });
});
