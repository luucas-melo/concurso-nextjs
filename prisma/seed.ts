import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data (optional - comment out if you want to keep existing data)
  console.log("🧹 Cleaning existing data...");
  await prisma.exam.deleteMany();
  await prisma.profile.deleteMany();

  // Create sample profiles
  console.log("👤 Creating profiles...");

  const profile1 = await prisma.profile.create({
    data: {
      id: "e4e853d9-a013-4bc2-87a9-4270f702d255",
      email: "lucasmelodos322@gmail.com",
      fullName: "Lucas Melo dos Santos",
      avatarUrl: null,
    },
  });

  const profile2 = await prisma.profile.create({
    data: {
      id: "00000000-0000-0000-0000-000000000002",
      email: "lucasmelosantos322@gmail.com",
      fullName: "Lucas Santos",
      avatarUrl: null,
    },
  });

  console.log(`✅ Created ${2} profiles`);

  // Create sample exams
  console.log("📝 Creating exams...");

  const exams = await prisma.exam.createMany({
    data: [
      // Waiting status exams
      {
        userId: profile1.id,
        name: "Concurso Público TRF 2ª Região",
        publicBody: "Tribunal Regional Federal da 2ª Região",
        position: "Analista Judiciário - Área Judiciária",
        examBoard: "CESPE/CEBRASPE",
        city: "Rio de Janeiro",
        state: "RJ",
        status: "waiting",
        registrationOpen: new Date("2026-02-01"),
        registrationDeadline: new Date("2026-02-28"),
        paymentDeadline: new Date("2026-03-05"),
        examDate: new Date("2026-04-20"),
        resultsDate: null,
        documents: [
          { name: "RG", checked: false },
          { name: "CPF", checked: false },
          { name: "Comprovante de residência", checked: false },
          { name: "Diploma de graduação", checked: false },
        ],
      },
      {
        userId: profile1.id,
        name: "Concurso Banco do Brasil",
        publicBody: "Banco do Brasil S.A.",
        position: "Escriturário",
        examBoard: "Fundação Cesgranrio",
        city: "São Paulo",
        state: "SP",
        status: "waiting",
        registrationOpen: new Date("2026-03-01"),
        registrationDeadline: new Date("2026-03-31"),
        paymentDeadline: new Date("2026-04-07"),
        examDate: new Date("2026-05-25"),
        resultsDate: null,
        documents: [
          { name: "Documento de identidade", checked: false },
          { name: "CPF", checked: false },
          { name: "Certificado de conclusão do ensino médio", checked: false },
        ],
      },
      // Registered status exams
      {
        userId: profile1.id,
        name: "Concurso TJ-SP",
        publicBody: "Tribunal de Justiça de São Paulo",
        position: "Escrevente Técnico Judiciário",
        examBoard: "Vunesp",
        city: "São Paulo",
        state: "SP",
        status: "registered",
        registrationOpen: new Date("2025-12-01"),
        registrationDeadline: new Date("2026-01-15"),
        paymentDeadline: new Date("2026-01-20"),
        examDate: new Date("2026-03-15"),
        resultsDate: null,
        documents: [
          { name: "RG", checked: true },
          { name: "CPF", checked: true },
          { name: "Comprovante de pagamento", checked: true },
          { name: "Foto 3x4", checked: true },
        ],
      },
      {
        userId: profile2.id,
        name: "Concurso Receita Federal",
        publicBody: "Secretaria Especial da Receita Federal do Brasil",
        position: "Auditor-Fiscal da Receita Federal",
        examBoard: "CESPE/CEBRASPE",
        city: "Brasília",
        state: "DF",
        status: "registered",
        registrationOpen: new Date("2025-11-15"),
        registrationDeadline: new Date("2026-01-05"),
        paymentDeadline: new Date("2026-01-10"),
        examDate: new Date("2026-03-30"),
        resultsDate: null,
        documents: [
          { name: "CPF", checked: true },
          { name: "RG", checked: true },
          { name: "Diploma de graduação", checked: true },
          { name: "Comprovante de inscrição", checked: true },
        ],
      },
      // Taken status exams
      {
        userId: profile2.id,
        name: "Concurso Polícia Federal",
        publicBody: "Departamento de Polícia Federal",
        position: "Agente de Polícia Federal",
        examBoard: "CESPE/CEBRASPE",
        city: "Várias",
        state: null,
        status: "taken",
        registrationOpen: new Date("2025-08-01"),
        registrationDeadline: new Date("2025-09-15"),
        paymentDeadline: new Date("2025-09-20"),
        examDate: new Date("2025-12-10"),
        resultsDate: new Date("2026-02-15"),
        documents: [
          { name: "Documentos pessoais", checked: true },
          { name: "Atestado médico", checked: true },
          { name: "Certificado de reservista", checked: true },
        ],
      },
      // Approved status exams
      {
        userId: profile2.id,
        name: "Concurso INSS",
        publicBody: "Instituto Nacional do Seguro Social",
        position: "Técnico do Seguro Social",
        examBoard: "FGV",
        city: "Belo Horizonte",
        state: "MG",
        status: "approved",
        registrationOpen: new Date("2025-05-01"),
        registrationDeadline: new Date("2025-06-15"),
        paymentDeadline: new Date("2025-06-20"),
        examDate: new Date("2025-09-20"),
        resultsDate: new Date("2025-11-30"),
        documents: [
          { name: "RG", checked: true },
          { name: "CPF", checked: true },
          { name: "Diploma do ensino médio", checked: true },
        ],
      },
      // Rejected status exam
      {
        userId: profile1.id,
        name: "Concurso Prefeitura de Curitiba",
        publicBody: "Prefeitura Municipal de Curitiba",
        position: "Fiscal de Obras",
        examBoard: "Instituto AOCP",
        city: "Curitiba",
        state: "PR",
        status: "rejected",
        registrationOpen: new Date("2025-04-01"),
        registrationDeadline: new Date("2025-05-15"),
        paymentDeadline: new Date("2025-05-20"),
        examDate: new Date("2025-08-10"),
        resultsDate: new Date("2025-10-15"),
        documents: [
          { name: "Documentos pessoais", checked: true },
          { name: "Comprovante de residência", checked: true },
        ],
      },
      // More diverse exams
      {
        userId: profile1.id,
        name: "Concurso TCU",
        publicBody: "Tribunal de Contas da União",
        position: "Auditor Federal de Controle Externo",
        examBoard: "CESPE/CEBRASPE",
        city: "Brasília",
        state: "DF",
        status: "waiting",
        registrationOpen: new Date("2026-04-01"),
        registrationDeadline: new Date("2026-05-15"),
        paymentDeadline: new Date("2026-05-20"),
        examDate: new Date("2026-07-20"),
        resultsDate: null,
        documents: [
          { name: "CPF", checked: false },
          { name: "RG", checked: false },
          { name: "Diploma de graduação", checked: false },
          { name: "Título de eleitor", checked: false },
        ],
      },
    ],
  });

  console.log(`✅ Created ${exams.count} exams`);

  console.log("✨ Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
