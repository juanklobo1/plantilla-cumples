export const metadata = {
  title: 'Plantilla Cumples',
  description: 'App base para cumpleaños',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
