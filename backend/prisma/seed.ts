import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const articles = [
    {
      title: 'Solana RPC failover em alta latência',
      category: 'RPC_ERROR',
      problem: 'Timeout recorrente no RPC primário durante janelas de volatilidade.',
      solution: 'Alternar para endpoint secundário com retry exponencial e registrar incidente.',
      tags: ['rpc', 'failover', 'timeout'],
      relatedIncidents: [],
    },
    {
      title: 'Rate limit da PumpPortal API',
      category: 'API_ERROR',
      problem: 'Respostas 429 frequentes no discovery.',
      solution: 'Aplicar cache agressivo, retry com jitter e redução de concorrência.',
      tags: ['pumpportal', 'rate-limit', 'retry'],
      relatedIncidents: [],
    },
    {
      title: 'Falha de confirmação de transação',
      category: 'EXECUTION_ERROR',
      problem: 'Transação enviada sem confirmação final no SLA esperado.',
      solution: 'Reconsultar assinatura em múltiplos RPCs e abrir incidente HIGH após timeout.',
      tags: ['execution', 'confirmation', 'sla'],
      relatedIncidents: [],
    },
    {
      title: 'Dados inconsistentes de holders',
      category: 'DATA_ERROR',
      problem: 'Distribuição de holders divergente entre fontes.',
      solution: 'Aplicar reconciliação por prioridade de fonte e marcar token com warning.',
      tags: ['holders', 'data-quality', 'reconciliation'],
      relatedIncidents: [],
    },
    {
      title: 'Degradação geral de processamento',
      category: 'SYSTEM_ERROR',
      problem: 'Fila de análise acumulando e aumentando latência.',
      solution: 'Escalar workers, ajustar limites de fila e ativar circuito de proteção.',
      tags: ['queue', 'system', 'circuit-breaker'],
      relatedIncidents: [],
    },
  ];

  for (const article of articles) {
    await prisma.knowledgeArticle.upsert({
      where: { id: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
      update: article,
      create: {
        id: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        ...article,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
