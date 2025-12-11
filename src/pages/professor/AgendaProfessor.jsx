// src/pages/professor/AgendaProfessor.jsx
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { getEvents } from "../../services/firestore";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
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

      // Somente eventos criados pelo professor logado
      const mine = all.filter((ev) => ev.createdBy === user.uid);
      setEvents(mine);
    })();
  }, []);

  // Eventos do dia selecionado
  function eventsOnDate(d) {
    const dayStr = new Date(d).toDateString();
    return events.filter(
      (ev) => new Date(ev.startAt).toDateString() === dayStr
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4 p-4">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Agenda do Professor</h2>
        <Calendar value={date} onChange={setDate} />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">
          Eventos em {date.toDateString()}
        </h3>

        {eventsOnDate(date).length === 0 ? (
          <p>Nenhum evento neste dia.</p>
        ) : (
          eventsOnDate(date).map((ev) => (
            <div
              key={ev.id}
              className="border-b py-3 flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{ev.title}</div>
                <div className="text-sm text-gray-500">
                  {ev.discipline} • {new Date(ev.startAt).toLocaleTimeString()}
                </div>
              </div>

              <button
                className="text-blue-600"
                onClick={() => nav(`/professor/evento/${ev.id}/inscritos`)}
              >
                Ver
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
