"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group text-black bg-white"
      // style={
      //   {
      //     "--normal-bg": "var(--popover)",
      //     "--normal-text": "var(--popover-foreground)",
      //     "--normal-border": "var(--border)",
      //   } as React.CSSProperties
      // }
        toastOptions={{
    className: "text-black dark:text-white", // ✅ affects all
  }}
      {...props}
    />
  )
}

export { Toaster }
