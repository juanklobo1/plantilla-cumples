'use client'

import { useEffect, useState } from 'react'
import { format, parse } from 'date-fns'
import { es } from 'date-fns/locale'

type Cumple = {
  nombre: string
  fechaTexto: string
  fecha: Date
  instagram?: string
  celular?: string
}

export default function Page() {
  const [cumples, setCumples] = useState<Cumple[]>([])
  const [grupo, setGrupo] = useState('Cumples del grupo')

  useEffect(() => {
    const cargarCumples = async () => {
      const res = await fetch(
        'https://v1.nocodeapi.com/juanklobo1/google_sheets/GdSBunLpOHdsbPZF?tabId=Hoja1'
      )
      const { data } = await res.json()

      if (!data || data.length < 2) {
        console.log('❌ No se encontraron datos válidos')
        return
      }

      // Leer el título desde la celda I2
      const filaGrupo = data.find((fila: any[]) => fila[8] === 'grupo')
      if (filaGrupo) setGrupo(filaGrupo[9])

      // Leer encabezados
      const encabezados = data[0]
      const idxNombre = encabezados.indexOf('Nombre completo')
      const idxFecha = encabezados.indexOf('Fecha de cumpleaños')
      const idxInstagram = encabezados.indexOf('Instagram u otra red social (opcional)')
      const idxCelular = encabezados.indexOf('Número de celular (opcional)')

      const hoy = new Date()
      const lista = data
        .slice(1)
        .filter((fila: any[]) => fila[idxNombre] && fila[idxFecha])
        .map((fila: any[]) => {
          const fechaTexto = fila[idxFecha]
          const fecha = parseFecha(fechaTexto)
          return {
            nombre: fila[idxNombre],
            fechaTexto,
            fecha,
            instagram: fila[idxInstagram],
            celular: fila[idxCelular],
          }
        })
        .filter((c: Cumple) => {
          const fechaEsteAño = new Date(hoy.getFullYear(), c.fecha.getMonth(), c.fecha.getDate())
          return fechaEsteAño >= hoy || isHoy(c.fecha, hoy)
        })
        .sort((a: Cumple, b: Cumple) => {
          const fa = new Date(hoy.getFullYear(), a.fecha.getMonth(), a.fecha.getDate())
          const fb = new Date(hoy.getFullYear(), b.fecha.getMonth(), b.fecha.getDate())
          return fa.getTime() - fb.getTime()
        })

      setCumples(lista)
    }

    cargarCumples()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4">
      <h1 className="text-2xl font-bold mb-4">{grupo}</h1>

      <h2 className="text-lg font-semibold mb-2">🔜 Próximos cumpleaños</h2>
      {cumples.length === 0 ? (
        <p className="mb-6">No hay próximos cumpleaños cargados.</p>
      ) : (
        <ul className="mb-6">
          {cumples.map((c, i) => (
            <li key={i} className="mb-1 text-center">
              {format(c.fecha, 'dd/MM')} – {c.nombre}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-4 mt-4 flex-wrap justify-center">
        <a
          href="https://calendar.google.com/calendar/u/0/r?cid=cumples@grupo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl shadow bg-gray-100"
        >
          📆 Ver calendario
        </a>
        <a
          href="https://wa.me/5491167195617?text=Hola%20Admin%2C%20tengo%20una%20consulta%20sobre%20los%20cumples"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl shadow bg-gray-100"
        >
          💬 Avisar a admin por WhatsApp
        </a>
      </div>
    </main>
  )
}

function parseFecha(texto: string): Date {
  const partes = texto.split('/')
  if (partes.length === 3) {
    const [dia, mes, año] = partes.map((p) => parseInt(p))
    return new Date(año, mes - 1, dia)
  }
  return new Date(NaN)
}

function isHoy(fecha: Date, hoy: Date): boolean {
  return (
    fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth()
  )
}
