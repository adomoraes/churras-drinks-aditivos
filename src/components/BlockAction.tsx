'use client'

import { useState, useEffect } from 'react'

interface Props {
  startTime: string
  onFinish: () => void // Função chamada quando o tempo acaba
}

export function Countdown({ startTime, onFinish }: Props) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime()
      const start = new Date(startTime).getTime()
      const diff = start - now

      if (diff <= 0) {
        onFinish() // Avisa que o tempo acabou!
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    const timer = setInterval(calculate, 1000)
    calculate() // Roda a primeira vez imediatamente

    return () => clearInterval(timer)
  }, [startTime, onFinish])

  return <span>Começa em: {timeLeft}</span>
}
