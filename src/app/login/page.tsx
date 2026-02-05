// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '../actions/auth'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      // Salva o ID do usuário localmente para manter logado
      localStorage.setItem('@blocos:user', JSON.stringify(result.user))
      router.push('/') // Vai para a lista de blocos
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-amber-50">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-2">🎉 Carnavrau 2026 Login</h1>
        <p className="text-center text-gray-500 mb-8">Entre com os dados do grupo da Churras, drinks e aditivos!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Como quer ser chamado?</label>
            <input name="name" required className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Ex: João Silva" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Seu Telefone</label>
            <input name="phone" type="tel" required className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="(00) 00000-0000" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Código do Grupo</label>
            <input name="groupCode" type="password" required className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Código secreto" />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg active:scale-95"
          >
            {loading ? 'Entrando...' : 'Bora pra Folia! 🎊'}
          </button>
        </form>
      </div>
    </main>
  )
}
