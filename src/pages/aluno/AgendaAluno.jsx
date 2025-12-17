// src/pages/aluno/AgendaAluno.jsx
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import {
  getEvents,
  getSubscriptionsByEvent,
  subscribeToEvent,
} from "../../services/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

// ÍCONES
import { FiArrowLeft, FiHome, FiCalendar, FiUser } from "react-icons/fi";

export default function AgendaAluno() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [mySubs, setMySubs] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const all = await getEvents();
      setEvents(all);

      const uid = auth.currentUser.uid;
      const subscribed = [];

      for (const ev of all) {
        const list = await getSubscriptionsByEvent(ev.id);
        if (list.some((s) => s.studentId === uid)) {
          subscribed.push(ev.id);
        }
      }

      setMySubs(subscribed);
    })();
  }, []);

  function eventsOnDate(d) {
    const dayStr = new Date(d).toDateString();
    return events.filter(
      (ev) => new Date(ev.startAt).toDateString() === dayStr
    );
  }

  // 🔹 MARCAR DIAS COM EVENTOS NO CALENDÁRIO
  function tileClassName({ date, view }) {
    if (view === "month") {
      const hasEvent = events.some(
        (ev) =>
          new Date(ev.startAt).toDateString() === date.toDateString()
      );
      return hasEvent ? "bg-blue-100 rounded-full" : null;
    }
  }

  async function handleSubscribe(eventId) {
    try {
      await subscribeToEvent({
        eventId,
        studentId: auth.currentUser.uid,
      });
      setMySubs([...mySubs, eventId]);
      alert("Inscrição realizada com sucesso!");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pb-20">
      {/* TOPO */}
      <div className="flex items-center gap-3 p-4 bg-blue-600 text-white shadow">
        <FiArrowLeft
          size={26}
          className="cursor-pointer"
          onClick={() => nav(-1)}
        />
        <h2 className="text-xl font-semibold">Agenda</h2>
      </div>

      {/* CONTEÚDO */}
      <div className="grid md:grid-cols-2 gap-4 p-4">
        {/* CALENDÁRIO */}
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <Calendar
            value={date}
            onChange={setDate}
            tileClassName={tileClassName}
            className="rounded-xl w-full"
          />
          <p className="text-xs text-gray-500 mt-2">
            🔵 Dias marcados possuem eventos
          </p>
        </div>

        {/* EVENTOS DO DIA */}
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Eventos em {date.toDateString()}
          </h3>

          {eventsOnDate(date).length === 0 ? (
            <p className="text-gray-500">Nenhum evento nesse dia.</p>
          ) : (
            eventsOnDate(date).map((ev) => (
              <div
                key={ev.id}
                className="border-b py-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-gray-800">
                    {ev.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {ev.discipline} •{" "}
                    {new Date(ev.startAt).toLocaleTimeString()}
                  </div>

                  {mySubs.includes(ev.id) && (
                    <span className="text-green-600 text-xs font-semibold">
                      ✔ INSCRITO
                    </span>
                  )}
                </div>

                {mySubs.includes(ev.id) ? (
                  <button
                    className="px-3 py-1 border rounded-lg text-sm"
                    onClick={() => nav(`/aluno/evento/${ev.id}`)}
                  >
                    Ver
                  </button>
                ) : (
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm shadow hover:bg-blue-700"
                    onClick={() => handleSubscribe(ev.id)}
                  >
                    Inscrever
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-3 flex justify-around items-center text-gray-600">
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => nav("/aluno/home")}
        >
          <FiHome size={24} />
          <span className="text-xs mt-1">Home</span>
        </div>

        <div
          className="flex flex-col items-center cursor-pointer text-blue-600"
          onClick={() => nav("/aluno/agenda")}
        >
          <FiCalendar size={24} />
          <span className="text-xs mt-1 font-semibold">Agenda</span>
        </div>

        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => nav("/aluno/perfil")}
        >
          <FiUser size={24} />
          <span className="text-xs mt-1">Perfil</span>
        </div>
      </div>
    </div>
  );
}
