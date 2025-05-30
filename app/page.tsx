'use client'

import { useEffect, useState } from 'react'

export default function Page() {
  const [datosCrudos, setDatosCrudos] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await fetch('https://v1.nocodeapi.com/juanklobo1/google_sheets/qkfUKGKozXlyDoDc?tabId=Hoja1')
        const json = await res.json()
        if (json.data) {
          setDatosCrudos(json.data)
        } else {
          setError("No se encontró 'data' en la respuesta")
        }
      } catch (err) {
        setError("Error al conectar con la API")
        console.error(err)
      }
    }

    fetchDatos()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#fafafa' }}>
      <h1>🛠️ Debug de datos desde Google Sheets</h1>
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(datosCrudos, null, 2)}
      </pre>
    </div>
  )
}
