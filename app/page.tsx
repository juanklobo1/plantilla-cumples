"use client";
import { useEffect, useState } from "react";

type Cumple = {
  nombre: string;
  fecha: string;
  instagram?: string;
  foto?: string;
};

export default function Page() {
  const [cumples, setCumples] = useState<Cumple[]>([]);

  useEffect(() => {
    fetch("https://v1.nocodeapi.com/juanklobo1/google_sheets/GdSBunLpOHdsbPZF?tabId=Respuestas")
      .then((res) => res.json())
      .then((data) => {
        const valores = data.data || [];
        const resultados = valores.slice(1).map((fila: string[]) => ({
          nombre: fila[1],
          fecha: fila[2],
          instagram: fila[3],
          foto: fila[4],
        }));
        setCumples(resultados);
      });
  }, []);

  const hoy = new Date().toISOString().slice(5, 10);

  return (
    <main className="p-6 font-sans bg-yellow-100 min-h-screen text-gray-900">
      <h1 className="text-2xl font-bold mb-4">🎉 Cumpleaños del Coro</h1>
      <ul>
        {cumples.map((cumple, index) => {
          const esHoy = cumple.fecha?.slice(5, 10) === hoy;
          return (
            <li key={index} className={`mb-4 p-4 rounded-xl shadow ${esHoy ? 'bg-white border-l-4 border-green-500' : 'bg-yellow-50'}`}>
              <p className="text-lg font-semibold">{cumple.nombre}</p>
              <p className="text-sm text-gray-600">📅 {cumple.fecha}</p>
              {cumple.instagram && (
                <a
                  href={cumple.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Ver perfil
                </a>
              )}
              {cumple.foto && (
                <div className="mt-2">
                  <img
                    src={cumple.foto}
                    alt={cumple.nombre}
                    className="w-24 h-24 object-cover rounded-full"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
