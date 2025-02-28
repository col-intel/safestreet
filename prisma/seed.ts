const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.incident.deleteMany({});

  // Seed data
  const incidents = [
    {
      id: uuidv4(),
      date: "2024-02-20",
      time: "19:30",
      location: "Rua de Santa Catarina",
      freguesia: "Santo Ildefonso",
      description: "Assalto a uma loja. Dois indivíduos encapuzados entraram e ameaçaram os funcionários.",
      type: "Roubo",
      severity: "high",
      reporterName: "João Silva",
      email: "joao.silva@example.com",
      subscribeToUpdates: true,
      status: "approved",
      createdAt: new Date('2024-02-20T19:30:00Z')
    },
    {
      id: uuidv4(),
      date: "2024-02-22",
      time: "14:15",
      location: "Jardim do Passeio Alegre",
      freguesia: "Foz do Douro",
      description: "Grupo de jovens a vandalizar equipamentos do parque infantil.",
      type: "Vandalismo",
      severity: "medium",
      reporterName: "Ana Santos",
      email: "ana.santos@example.com",
      subscribeToUpdates: false,
      status: "approved",
      createdAt: new Date('2024-02-22T14:15:00Z')
    },
    {
      id: uuidv4(),
      date: "2024-02-23",
      time: "23:45",
      location: "Rua das Flores",
      freguesia: "Sé",
      description: "Indivíduo suspeito a seguir pessoas que saíam de restaurantes.",
      type: "Comportamento Suspeito",
      severity: "medium",
      reporterName: "Miguel Costa",
      email: "miguel.costa@example.com",
      subscribeToUpdates: true,
      status: "approved",
      createdAt: new Date('2024-02-23T23:45:00Z')
    },
    {
      id: uuidv4(),
      date: "2024-02-25",
      time: "08:20",
      location: "Avenida dos Aliados",
      freguesia: "Santo Ildefonso",
      description: "Carteirista apanhado em flagrante por um polícia à paisana.",
      type: "Furto",
      severity: "medium",
      reporterName: "Sofia Martins",
      email: "sofia.martins@example.com",
      subscribeToUpdates: false,
      status: "approved",
      createdAt: new Date('2024-02-25T08:20:00Z')
    },
    {
      id: uuidv4(),
      date: "2024-02-26",
      time: "02:10",
      location: "Rua da Galeria de Paris",
      freguesia: "Vitória",
      description: "Briga entre grupos à saída de um bar. Houve agressões e vidros partidos.",
      type: "Agressão",
      severity: "high",
      reporterName: "Pedro Oliveira",
      email: "pedro.oliveira@example.com",
      subscribeToUpdates: true,
      status: "approved",
      createdAt: new Date('2024-02-26T02:10:00Z')
    },
    {
      id: uuidv4(),
      date: "2024-02-27",
      time: "16:40",
      location: "Praça da Batalha",
      freguesia: "Santo Ildefonso",
      description: "Idosa assaltada enquanto esperava pelo autocarro. Levaram-lhe a carteira e o telemóvel.",
      type: "Roubo",
      severity: "high",
      reporterName: "Mariana Sousa",
      email: "mariana.sousa@example.com",
      subscribeToUpdates: false,
      status: "approved",
      createdAt: new Date('2024-02-27T16:40:00Z')
    },
    {
      id: uuidv4(),
      date: "2024-02-28",
      time: "11:30",
      location: "Rua de Cedofeita",
      freguesia: "Cedofeita",
      description: "Carro estacionado com vidro partido e objetos roubados do interior.",
      type: "Furto",
      severity: "medium",
      reporterName: "Ricardo Ferreira",
      email: "ricardo.ferreira@example.com",
      subscribeToUpdates: true,
      status: "approved",
      createdAt: new Date('2024-02-28T11:30:00Z')
    },
    {
      id: uuidv4(),
      date: "2024-02-28",
      time: "18:45",
      location: "Rua do Almada",
      freguesia: "Vitória",
      description: "Suspeita de tráfico de drogas. Várias pessoas a entrar e sair rapidamente de um edifício abandonado.",
      type: "Drogas",
      severity: "high",
      reporterName: "Carlos Mendes",
      email: "carlos.mendes@example.com",
      subscribeToUpdates: true,
      status: "pending",
      createdAt: new Date('2024-02-28T18:45:00Z')
    },
    {
      id: uuidv4(),
      date: "2024-02-29",
      time: "09:15",
      location: "Rua de Passos Manuel",
      freguesia: "Santo Ildefonso",
      description: "Graffiti ofensivo em vários edifícios.",
      type: "Vandalismo",
      severity: "low",
      reporterName: "Luísa Pereira",
      email: "luisa.pereira@example.com",
      subscribeToUpdates: false,
      status: "pending",
      createdAt: new Date('2024-02-29T09:15:00Z')
    }
  ];

  for (const incident of incidents) {
    await prisma.incident.create({
      data: incident
    });
  }

  console.log('Database has been seeded with initial data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 