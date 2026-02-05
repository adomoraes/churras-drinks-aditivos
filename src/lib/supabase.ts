// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Essas variáveis vêm do seu arquivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Criamos o cliente para interagir com o banco de dados
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
