// src/pages/professor/AgendaProfessor.jsx
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { getEvents } from "../../services/firestore";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  PlusCircle,
  CalendarDays,
  User,
} from "lucide-react";

import "react-calendar/dist/Calendar.css";

export default function AgendaProfessor() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const all = await getEvents();
      const user = auth.currentUser;
      if (!user) return;

      const mine = all.filter((ev) => ev.createdBy === user.uid);
      setEvents(mine);
    })();
  }, []);

  function eventsOnDate(d) {
    const dayStr = new Date(d).toDateString();
    return events.filter(
      (ev) => new Date(ev.startAt).toDateString() === dayStr
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24 flex flex-col">

      {/* Seta para voltar */}
      <button
        onClick={() => nav(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft size={22} />
        <span className="text-lg font-medium">Voltar</span>
      </button>

      {/* Título */}
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Agenda do Professor
      </h2>

      {/* Conteúdo */}
      <div className="grid md:grid-cols-2 gap-4 flex-1">

        {/* Calendário */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Selecione uma data
          </h3>

          <Calendar
            value={date}
            onChange={setDate}
            className="rounded-lg shadow-sm"
          />
        </div>

        {/* Lista de eventos */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Eventos em {date.toLocaleDateString()}
          </h3>

          {eventsOnDate(date).length === 0 ? (
            <p className="text-gray-600">Nenhum evento neste dia.</p>
          ) : (
            eventsOnDate(date).map((ev) => (
              <div
                key={ev.id}
                className="p-4 bg-blue-50 rounded-lg mb-3 border border-blue-200 shadow-sm"
              >
                <h4 className="font-semibold text-blue-700">{ev.title}</h4>
                <p className="text-sm text-gray-600">{ev.discipline}</p>
                <p className="text-sm text-gray-500">
                  {new Date(ev.startAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <button
                  className="mt-3 bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => nav(`/professor/evento/${ev.id}/inscritos`)}
                >
                  Ver Inscritos
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FOOTER NAV BONITO COM ÍCONES */}
      <div className="mt-6 py-3 bg-white shadow-lg border-t flex justify-around fixed bottom-0 left-0 right-0 z-50">

        {/* HOME */}
        <button
          onClick={() => nav("/professor/home")}
          className="flex flex-col items-center text-blue-600 hover:text-blue-800 transition"
        >
          <Home size={22} />
          <span className="text-xs mt-1">Home</span>
        </button>

        {/* CRIAR */}
        <button
          onClick={() => nav("/professor/criar-evento")}
          className="flex flex-col items-center text-blue-600 hover:text-blue-800 transition"
        >
          <PlusCircle size={22} />
          <span className="text-xs mt-1">Criar</span>
        </button>

        {/* AGENDA (ATIVO) */}
        <button
          onClick={() => nav("/professor/agenda")}
          className="flex flex-col items-center text-blue-700 font-semibold border-b-2 border-blue-700 pb-1"
        >
          <CalendarDays size={22} />
          <span className="text-xs mt-1">Agenda</span>
        </button>

        {/* PERFIL */}
        <button
          onClick={() => nav("/professor/perfil")}
          className="flex flex-col items-center text-blue-600 hover:text-blue-800 transition"
        >
          <User size={22} />
          <span className="text-xs mt-1">Perfil</span>
        </button>

      </div>
    </div>
  );
}
