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
      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ArrowDownRight className="h-4 w-4" />
      Solicitar Retiro
    </button>
  )
}

