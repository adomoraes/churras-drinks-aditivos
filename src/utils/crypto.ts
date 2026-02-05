// src/utils/crypto.ts

/**
 * Transforma o telefone em um código único (hash).
 * Usamos a API nativa do navegador para isso.
 */
export async function hashPhone(phone: string): Promise<string> {
  // Remove caracteres não numéricos (ex: (11) 9999-9999 vira 1199999999)
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Transforma a string em um formato que o algoritmo SHA-256 entenda
  const msgUint8 = new TextEncoder().encode(cleanPhone);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  
  // Converte o resultado em uma string legível
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
