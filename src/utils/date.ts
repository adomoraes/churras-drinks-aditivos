// src/utils/date.ts

export type BlockStatus = 'futuro' | 'em_andamento' | 'encerrado';

/**
 * Calcula o status do bloco comparando o horário atual com o início e fim.
 */
export function getBlockStatus(startTime: string, endTime: string): BlockStatus {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) return 'futuro';
  if (now >= start && now <= end) return 'em_andamento';
  return 'encerrado';
}
