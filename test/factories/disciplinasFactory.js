import { faker } from '@faker-js/faker';

export function novaDisciplina() {

    const timestamp = Date.now();
    const nome = faker.person.jobTitle();
    const codigo = `Port-${timestamp}`;

    return {
        nome: nome,
        codigo: codigo,
        cargaHoraria: 80
    };
}