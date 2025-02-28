import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.incident.deleteMany({});

  // Sample incidents
  const incidents = [
    {
      id: uuidv4(),
      date: '2025-02-28',
      location: 'Rua de Santa Catarina, 374',
      freguesia: 'Cedofeita, Santo Ildefonso, Sé, Miragaia, São Nicolau e Vitória',
      description: 'Buraco na estrada causando perigo para ciclistas',
      type: 'Infraestrutura',
      severity: 'Média',
      reporterName: 'João Silva',
      email: 'joao.silva@example.com',
      subscribeToUpdates: true,
      status: 'Pendente'
    },
    {
      id: uuidv4(),
      date: '2025-02-27',
      location: 'Avenida dos Aliados, 120',
      freguesia: 'Cedofeita, Santo Ildefonso, Sé, Miragaia, São Nicolau e Vitória',
      description: 'Semáforo não está funcionando corretamente',
      type: 'Sinalização',
      severity: 'Alta',
      reporterName: 'Maria Oliveira',
      email: 'maria.oliveira@example.com',
      subscribeToUpdates: true,
      status: 'Em análise'
    },
    {
      id: uuidv4(),
      date: '2025-02-26',
      location: 'Rua do Almada, 501',
      freguesia: 'Cedofeita, Santo Ildefonso, Sé, Miragaia, São Nicolau e Vitória',
      description: 'Calçada com pedras soltas, risco de queda para pedestres',
      type: 'Infraestrutura',
      severity: 'Média',
      reporterName: 'António Santos',
      email: 'antonio.santos@example.com',
      subscribeToUpdates: false,
      status: 'Pendente'
    },
    {
      id: uuidv4(),
      date: '2025-02-25',
      location: 'Rua de Cedofeita, 256',
      freguesia: 'Cedofeita, Santo Ildefonso, Sé, Miragaia, São Nicolau e Vitória',
      description: 'Faixa de pedestres apagada, difícil visualização para motoristas',
      type: 'Sinalização',
      severity: 'Média',
      reporterName: 'Ana Ferreira',
      email: 'ana.ferreira@example.com',
      subscribeToUpdates: true,
      status: 'Resolvido'
    },
    {
      id: uuidv4(),
      date: '2025-02-24',
      location: 'Rua de Passos Manuel, 137',
      freguesia: 'Cedofeita, Santo Ildefonso, Sé, Miragaia, São Nicolau e Vitória',
      description: 'Poste de iluminação danificado, área escura à noite',
      type: 'Iluminação',
      severity: 'Alta',
      reporterName: 'Pedro Costa',
      email: 'pedro.costa@example.com',
      subscribeToUpdates: true,
      status: 'Em análise'
    }
  ];

  // Insert incidents
  for (const incident of incidents) {
    await prisma.incident.create({
      data: incident
    });
    console.log(`Created incident: ${incident.description}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 