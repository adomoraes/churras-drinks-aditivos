// src/app/actions/checkin.ts
'use server'

import { supabase } from '@/lib/supabase'

export async function registerInterestAction(userId: string, blockId: string) {
  // Tenta inserir o check-in de interesse
  // O banco de dados já possui a regra UNIQUE para evitar duplicidade
  const { error } = await supabase
    .from('checkins')
    .insert([
      { 
        user_id: userId, 
        block_id: blockId, 
        type: 'interest' 
      }
    ])

  if (error) {
    // Se o erro for de duplicidade (código 23505), ignoramos ou avisamos
    if (error.code === '23505') {
      return { success: true, message: 'Interesse já registrado!' }
    }
    return { error: 'Não foi possível registrar seu interesse.' }
  }

  return { success: true }
}

// src/app/actions/checkin.ts
export async function registerPresenceAction(userId: string, blockId: string) {
  const { error } = await supabase
    .from('checkins')
    .upsert([ // Usamos upsert para atualizar caso ele já tenha dado "interesse"
      {
        user_id: userId,
        block_id: blockId,
        type: 'presence'
      }
    ], { onConflict: 'user_id,block_id,type' })

  if (error) return { error: 'Erro ao registrar presença.' };
  return { success: true };
}
