// src/app/actions/auth.ts
'use server'

import { supabase } from '@/lib/supabase'
import { hashPhone } from '@/utils/crypto'

export async function loginAction(formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const groupCode = formData.get('groupCode') as string

  // 1. Validar código do grupo (definido no seu .env.local)
  if (groupCode !== process.env.GROUP_ACCESS_CODE) {
    return { error: 'Código do grupo inválido!' }
  }

  // 2. Gerar o hash do telefone para privacidade
  const phoneHash = await hashPhone(phone)

  // 3. Verificar se o usuário já existe no Supabase
  const { data: existingUser, error: findError } = await supabase
    .from('users')
    .select('*')
    .eq('phone_hash', phoneHash)
    .single()

  if (existingUser) {
    return { success: true, user: existingUser }
  }

  // 4. Se não existir, criar novo usuário
  const { data: newUser, error: createError } = await supabase
    .from('users')
    .insert([{ name, phone_hash: phoneHash }])
    .select()
    .single()

  if (createError) {
    return { error: 'Erro ao criar usuário.' }
  }

  return { success: true, user: newUser }
}
