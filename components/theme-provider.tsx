"use client"

import * as React from "react"

function ThemeProvider({
  children,
  ...props
}: React.PropsWithChildren) {
  return <>{children}</>
}

export { ThemeProvider }
