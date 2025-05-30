'use client'

import { useEffect, useState } from 'react'
import { format, isToday, isPast, isWithinInterval, subDays, parse } from 'date-fns'

export default function Page() {
  const [datos, setDatos] = useState<any[]>([])
  const [grupo, setGrupo] = useState('Cumples del grupo')

  const parseFecha = (fecha: any) => {
    if (typeof fecha === 'string') {
      try {
        return parse(fecha, 'd/M/yyyy', new Date())
      } catch {
        return new Date('2100-01-01')
      }
    }

    if (typeof fecha === 'number') {
      const epoch = new Date(1899, 11, 30)
      return new Date(epoch.getTime() + fecha * 86400000)
    }

    return new Date('2100-01-01')
  }

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await fetch('https://v1.nocodeapi.com/juanklobo1/google_sheets/qkfUKGKozXlyDoDc?tabId=Hoja1')
        const { data } = await res.json()

        if (!data || data.length < 2) return

        const grupoValue = data[1]?.grupo?.trim()
        if (grupoValue) setGrupo(grupoValue)

        const lista = data.slice(1).map((row: any) => ({
          nombre: row['nombre completo']?.trim(),
          fecha: row['fecha de cumpleaños'],
          instagram: row['instagram u otra red social (opcional)'],
          celular: row['número de celular (opcional)'],
        }))

        setDatos(lista)
      } catch (err) {
        console.error('Error al cargar datos:', err)
      }
    }

    fetchDatos()
  }, [])

  const hoy = new Date()
  const ayer = subDays(hoy, 1)
  const anteayer = subDays(hoy, 2)

  const ordenarPorFecha = (a: any, b: any) => {
    const fechaA = parseFecha(a.fecha)
    const fechaB = parseFecha(b.fecha)
    return fechaA.getMonth() === fechaB.getMonth()
      ? fechaA.getDate() - fechaB.getDate()
      : fechaA.getMonth() - fechaB.getMonth()
  }

  const cumpleañosHoy = datos.filter(d => isToday(parseFecha(d.fecha)))
  const cumpleañosAyer = datos.filter(d => isWithinInterval(parseFecha(d.fecha), { start: anteayer, end: ayer }))
  const cumpleañosProximos = datos
    .filter(d => {
      const fecha = parseFecha(d.fecha)
      return !isPast(fecha) || isToday(fecha)
    })
    .sort(ordenarPorFecha)

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#fffbe6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>{grupo}</h1>

        {cumpleañosHoy.length > 0 && (
          <div>
            <h2>🎉 Cumpleaños de hoy</h2>
            {cumpleañosHoy.map((d, i) => (
              <div key={i} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '6px', marginBottom: '10px' }}>
                <strong>{d.nombre}</strong> ({format(parseFecha(d.fecha), 'dd/MM')})
                {d.instagram && <div>Instagram: {d.instagram}</div>}
              </div>
            ))}
          </div>
        )}

        {cumpleañosAyer.length > 0 && (
          <div>
            <h2>📅 Cumples recientes</h2>
            {cumpleañosAyer.map((d, i) => (
              <div key={i} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '6px', marginBottom: '10px' }}>
                <strong>{d.nombre}</strong> ({format(parseFecha(d.fecha), 'dd/MM')})
              </div>
            ))}
          </div>
        )}

        <div>
          <h2>🔜 Próximos cumpleaños</h2>
          {cumpleañosProximos.map((d, i) => (
            <div key={i} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '6px', marginBottom: '10px' }}>
              <strong>{d.nombre}</strong> ({format(parseFecha(d.fecha), 'dd/MM')})
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <button onClick={() => window.open('https://calendar.google.com/', '_blank')} style={btnEstilo}>📆 Ver calendario</button>
          <button onClick={() => window.open('https://wa.me/5491167195617?text=Hola%20Admin%2C%20consulto%20por%20los%20cumples.', '_blank')} style={btnEstilo}>💬 Avisar a admin por WhatsApp</button>
        </div>
      </div>
    </div>
  )
}

const btnEstilo = {
  padding: '10px',
  borderRadius: '8px',
  backgroundColor: '#f0f0f0',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px'
}
