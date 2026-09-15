import { faker } from '@faker-js/faker';

export function novoAluno() {

    const timestamp = Date.now();
    const nome = faker.person.fullName();
    const email = faker.internet.email().toLocaleLowerCase();

    return {
        nome: nome,
        email: email,
        matricula: `MAT-${timestamp}`,
        senha: `senha@${timestamp}`
    };
}

