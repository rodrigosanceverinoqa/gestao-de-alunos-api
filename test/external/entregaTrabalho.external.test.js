import { randomUUID } from 'node:crypto';
import { expect } from 'chai';
import dadosDeEntrega from '../fixtures/entregas-trabalho.json' with { type: 'json' };
import { api } from '../helpers/api.js';
import { loginComoAdmin, loginComoAluno } from '../helpers/auth.js';

function criarDadosAlunoUnicos(dadosAluno) {
  const identificador = randomUUID();
  const [usuario, dominio] = dadosAluno.email.split('@');

  return {
    ...dadosAluno,
    email: `${usuario}+${identificador}@${dominio}`,
    matricula: `${dadosAluno.matricula}-${identificador}`,
  };
}

describe('Fluxo de entrega de trabalho pelo aluno', () => {
  dadosDeEntrega.forEach((cenario) => {
    it(cenario.testTitle, async () => {
      const dadosAluno = criarDadosAlunoUnicos(cenario.dadosAluno);
      const loginAdminResposta = await loginComoAdmin();
      expect(loginAdminResposta.status).to.equal(200);
      expect(loginAdminResposta.body.usuario.role).to.equal('admin');
      const tokenAdmin = `Bearer ${loginAdminResposta.body.token}`;

      const cadastroAlunoResposta = await api()
        .post('/api/admin/alunos')
        .set('content-type', 'application/json')
        .set('authorization', tokenAdmin)
        .send(dadosAluno);

      expect(cadastroAlunoResposta.status).to.equal(201);
      expect(cadastroAlunoResposta.body.email).to.equal(dadosAluno.email);

      const alunoId = cadastroAlunoResposta.body.id;
      const matriculaResposta = await api()
        .post(`/api/admin/disciplinas/${cenario.disciplinaId}/matriculas`)
        .set('content-type', 'application/json')
        .set('authorization', tokenAdmin)
        .send({ alunoId });

      expect(matriculaResposta.status).to.equal(201);
      expect(matriculaResposta.body.alunoId).to.equal(alunoId);

      const loginAlunoResposta = await loginComoAluno(
        dadosAluno.email,
        dadosAluno.senha
      );
      expect(loginAlunoResposta.status).to.equal(200);
      expect(loginAlunoResposta.body.usuario.id).to.equal(alunoId);
      expect(loginAlunoResposta.body.usuario.role).to.equal('aluno');

      const entregaResposta = await api()
        .post(`/api/alunos/${alunoId}/trabalhos`)
        .set('content-type', 'application/json')
        .set('authorization', `Bearer ${loginAlunoResposta.body.token}`)
        .send({
          disciplinaId: cenario.disciplinaId,
          ...cenario.dadosTrabalho,
        });

      expect(entregaResposta.status).to.equal(cenario.statusCodeEsperado);
      expect(entregaResposta.body.alunoId).to.equal(alunoId);
      expect(entregaResposta.body.disciplinaId).to.equal(cenario.disciplinaId);
      expect(entregaResposta.body.titulo).to.equal(cenario.dadosTrabalho.titulo);
      expect(entregaResposta.body.status).to.equal('entregue');
    });
  });
});
