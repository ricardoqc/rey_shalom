'use client'

import { useState } from 'react'
import { ArrowDownRight } from 'lucide-react'

interface WithdrawalButtonProps {
  currentBalance: number
}

export function WithdrawalButton({ currentBalance }: WithdrawalButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleWithdrawal = () => {
    // TODO: Implementar lógica de retiro
    alert('Función de retiro próximamente disponible')
  }

  return (
    <button
      onClick={handleWithdrawal}
      disabled={currentBalance <= 0}
      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
    >
      <ArrowDownRight className="h-4 w-4" />
      Solicitar Retiro
    </button>
  )
}

