// src/pages/aluno/HomeAluno.jsx
import { useEffect, useState } from "react";
import { getEvents, subscribeToEvent } from "../../services/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

export default function HomeAluno() {
  const [events, setEvents] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const all = await getEvents();
      setEvents(all);
    })();
  }, []);

  async function handleSubscribe(eventId) {
    try {
      const studentId = auth.currentUser.uid;
      await subscribeToEvent({ eventId, studentId });
      alert("Inscrição realizada com sucesso!");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Eventos Disponíveis</h2>

        {/* BOTÃO PARA VER AS PRESENÇAS */}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded shadow"
          onClick={() => nav("/aluno/presencas")}
        >
          Minhas Presenças
        </button>
      </div>

      {events.length === 0 ? (
        <div className="bg-white p-4 rounded shadow">
          Nenhum evento disponível no momento.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((ev) => (
            <div key={ev.id} className="bg-white p-4 rounded shadow">
              {ev.bannerUrl && (
                <img
                  src={ev.bannerUrl}
                  alt=""
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}

              <h3 className="font-semibold text-lg">{ev.title}</h3>
              <p className="text-sm text-gray-600">
                {ev.discipline} — {new Date(ev.startAt).toLocaleString()}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => nav(`/aluno/evento/${ev.id}`)}
                >
                  Ver detalhes
                </button>

                <button
                  className="border px-3 py-1 rounded"
                  onClick={() => handleSubscribe(ev.id)}
                >
                  Inscrever-se
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
