'use client'

import { useEffect, useState } from 'react'
import { format, isToday, isAfter } from 'date-fns'
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
    const partes = texto?.trim().split('/')
    if (partes.length === 3) {
      const [dia, mes, anio] = partes.map(p => parseInt(p))
      if (!isNaN(dia) && !isNaN(mes) && !isNaN(anio)) {
        return new Date(anio, mes - 1, dia)
      }
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
        const nombre = fila['Nombre completo']?.trim()
        const fechaTexto = fila['Fecha de cumpleaños']?.trim()
        const instagram = fila['Instagram u otra red social (opcional)']?.trim()
        const celular = fila['Número de celular (opcional)']?.toString().trim()

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

      const hoyCumple = nuevosCumples.filter(c => isToday(c.fecha))

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
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 text-gray-800 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">{grupo}</h1>

        {cumplesHoy.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-center">🎉 Cumpleaños de hoy</h2>
            <ul className="list-disc pl-6">
              {cumplesHoy.map((c, i) => (
                <li key={i} className="mb-1">
                  <strong>{c.nombre}</strong> – {format(c.fecha, 'dd/MM', { locale: es })}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-center">🔜 Próximos cumpleaños</h2>
          <ul className="list-disc pl-6">
            {cumplesFuturos.length > 0 ? (
              cumplesFuturos.map((c, i) => (
                <li key={i} className="mb-1">
                  <strong>{c.nombre}</strong> – {format(c.fecha, 'dd/MM', { locale: es })}
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500">No hay próximos cumpleaños cargados.</li>
            )}
          </ul>
        </section>

        <div className="flex justify-center gap-4">
          <button onClick={abrirCalendario} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow">
            📆 Ver calendario
          </button>
          <button onClick={abrirWhatsApp} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow">
            💬 Avisar a admin por WhatsApp
          </button>
        </div>
      </div>
    </main>
  )
}
