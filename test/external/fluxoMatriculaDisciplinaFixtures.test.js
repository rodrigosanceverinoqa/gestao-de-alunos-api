import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { comTokenDeAdmin } from '../helpers/auth.js';
import testesDeMatriculas from '../fixtures/matriculas.json' with {type: 'json'};

describe('Matricula de aluno em disciplina', () => {
    //Antes de rodar este script
    // Tenha o e-mail "admin@escola.com" e senha "admin123" cadastrado no banco de dados
    // Não posso ter nenhum aluno cadastrado com o email "joao.dasilva2@example.com" e matricula "MAT-12345678"
    // Não posso ter nenhuma disciplina cadastrada com o código "Port-1237"
    testesDeMatriculas.forEach((testeDeMatricula) => {
        it(testeDeMatricula.testTitle, async () => {

            const cadastroAlunoResposta = await api()
                .post('/api/admin/alunos')
                .set('content-type', 'application/json')
                .set('authorization', await comTokenDeAdmin())
                .send(testeDeMatricula.dadosAluno);

            const alunoId = cadastroAlunoResposta.body.id;
            console.log('Aluno cadastrado com sucesso. ID:', alunoId);
            console.log('Nome do aluno:', cadastroAlunoResposta.body.nome);
            console.log('Email do aluno:', cadastroAlunoResposta.body.email);

            const cadastroDisciplinaResposta = await api()
                .post('/api/admin/disciplinas')
                .set('content-type', 'application/json')
                .set('authorization', await comTokenDeAdmin())
                .send(testeDeMatricula.dadosDisciplina);

            const disciplinaId = cadastroDisciplinaResposta.body.id;
            console.log('Disciplina cadastrada com sucesso. ID:', disciplinaId);

            const cadastroMatriculaResposta = await api()
                .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                .set('content-type', 'application/json')
                .set('authorization', await comTokenDeAdmin())
                .send({
                    alunoId: alunoId,
                });

            expect(cadastroMatriculaResposta.status).to.equal(testeDeMatricula.statusCodeEsperado);
            expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
            expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);

        });
    });
});