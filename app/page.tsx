'use client'

import { useEffect, useState } from 'react'
import { format, isToday, isAfter, parse } from 'date-fns'
import { es } from 'date-fns/locale'

interface Cumple {
  nombre: string
  fecha: Date
  fechaOriginal: string
  instagram?: string
  celular?: string
}

export default function Home() {
  const [cumples, setCumples] = useState<Cumple[]>([])
  const [cumplesHoy, setCumplesHoy] = useState<Cumple[]>([])
  const [cumplesFuturos, setCumplesFuturos] = useState<Cumple[]>([])
  const [grupo, setGrupo] = useState<string>('Cumples del grupo')

  const parseFecha = (texto: string): Date | null => {
    const partes = texto.split('/')
    if (partes.length === 3) {
      const [dia, mes, anio] = partes.map(Number)
      return new Date(anio, mes - 1, dia)
    }
    return null
  }

  useEffect(() => {
    const obtenerDatos = async () => {
      const res = await fetch('https://v1.nocodeapi.com/juanklobo1/google_sheets/QgZzyizeJJfrShJY?tabId=Hoja1')
      const json = await res.json()
      const datos = json.data

      const nuevosCumples: Cumple[] = []

      datos.forEach((fila: any) => {
        const nombre = fila['nombre completo']?.trim()
        const fechaTexto = fila['fecha de cumpleaños']?.trim()
        const instagram = fila['instagram u otra red social (opcional)']?.trim()
        const celular = fila['número de celular (opcional)']?.toString().trim()

        const fecha = parseFecha(fechaTexto)

        if (nombre && fecha) {
          nuevosCumples.push({
            nombre,
            fecha,
            fechaOriginal: fechaTexto,
            instagram,
            celular,
          })
        }

        if (fila['grupo']) {
          setGrupo(fila['grupo'])
        }
      })

      const hoy = new Date()
      const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())

      const hoyCumple = nuevosCumples.filter(c => {
        return isToday(c.fecha)
      })

      const futuros = nuevosCumples
        .filter(c => {
          const cumpleEsteAño = new Date(hoy.getFullYear(), c.fecha.getMonth(), c.fecha.getDate())
          return isAfter(cumpleEsteAño, hoySinHora)
        })
        .sort((a, b) => {
          const aDate = new Date(hoy.getFullYear(), a.fecha.getMonth(), a.fecha.getDate())
          const bDate = new Date(hoy.getFullYear(), b.fecha.getMonth(), b.fecha.getDate())
          return aDate.getTime() - bDate.getTime()
        })

      setCumples(nuevosCumples)
      setCumplesHoy(hoyCumple)
      setCumplesFuturos(futuros)
    }

    obtenerDatos()
  }, [])

  const abrirWhatsApp = () => {
    window.open('https://wa.me/5491167195617?text=Hola%20Anita!%20Quiero%20avisarte%20algo%20sobre%20los%20cumples', '_blank')
  }

  const abrirCalendario = () => {
    window.open('https://calendar.google.com/calendar/u/0/r?cid=tu_calendario_id_aqui', '_blank')
  }

  return (
    <main className="min-h-screen p-6 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">{grupo}</h1>

      {cumplesHoy.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">🎉 Cumpleaños de hoy</h2>
          <ul className="mb-6">
            {cumplesHoy.map((c, i) => (
              <li key={i} className="mb-2">
                <strong>{c.nombre}</strong> – {format(c.fecha, 'dd/MM', { locale: es })}
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="text-xl font-semibold mb-2">🔜 Próximos cumpleaños</h2>
      <ul className="mb-6">
        {cumplesFuturos.map((c, i) => (
          <li key={i} className="mb-2">
            <strong>{c.nombre}</strong> – {format(c.fecha, 'dd/MM', { locale: es })}
          </li>
        ))}
        {cumplesFuturos.length === 0 && <li>No hay próximos cumpleaños cargados.</li>}
      </ul>

      <div className="flex gap-4">
        <button onClick={abrirCalendario} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
          📆 Ver calendario
        </button>
        <button onClick={abrirWhatsApp} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md">
          💬 Avisar a admin por WhatsApp
        </button>
      </div>
    </main>
  )
}
