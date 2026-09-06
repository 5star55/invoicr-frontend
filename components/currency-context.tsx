"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type Currency = "USD" | "EUR" | "GBP" | "NGN"

type CurrencyContextValue = {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatCurrency: (value: number | string) => string
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("NGN")

  useEffect(() => {
    const storedCurrency = window.localStorage.getItem("invoicr_currency")
    if (
      storedCurrency === "USD" ||
      storedCurrency === "EUR" ||
      storedCurrency === "GBP" ||
      storedCurrency === "NGN"
    ) {
      setCurrencyState(storedCurrency)
    }
  }, [])

  function setCurrency(nextCurrency: Currency) {
    setCurrencyState(nextCurrency)
    window.localStorage.setItem("invoicr_currency", nextCurrency)
  }

  function formatCurrency(value: number | string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)

  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider")
  }

  return context
}
