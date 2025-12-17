// src/pages/aluno/HomeAluno.jsx
import { useEffect, useState } from "react";
import {
  getEvents,
  getSubscriptionsByEvent,
  subscribeToEvent,
} from "../../services/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import {
  ArrowLeft,
  CalendarDays,
  User,
  CheckCircle,
  Eye,
} from "lucide-react";

export default function HomeAluno() {
  const [events, setEvents] = useState([]);
  const [mySubs, setMySubs] = useState([]);
  const [filter, setFilter] = useState("all"); // all | subscribed | not
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

  // 🔍 FILTRO DE EVENTOS
  const filteredEvents = events.filter((ev) => {
    if (filter === "subscribed") return mySubs.includes(ev.id);
    if (filter === "not") return !mySubs.includes(ev.id);
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24 flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => nav(-1)}
          className="text-blue-700 hover:text-blue-900"
        >
          <ArrowLeft size={26} />
        </button>

        <h2 className="text-2xl font-bold text-blue-700">
          Eventos
        </h2>

        <button
          onClick={() => nav("/aluno/perfil")}
          className="text-blue-700 hover:text-blue-900"
        >
          <User size={28} />
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition
            ${filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border"}
          `}
        >
          Todos
        </button>

        <button
          onClick={() => setFilter("subscribed")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition
            ${filter === "subscribed"
              ? "bg-green-600 text-white"
              : "bg-white text-green-600 border"}
          `}
        >
          Inscritos
        </button>

        <button
          onClick={() => setFilter("not")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition
            ${filter === "not"
              ? "bg-gray-700 text-white"
              : "bg-white text-gray-700 border"}
          `}
        >
          Não inscritos
        </button>
      </div>

      {/* LISTAGEM */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white p-4 rounded shadow text-center text-gray-700">
          Nenhum evento encontrado.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredEvents.map((ev) => {
            const isSubscribed = mySubs.includes(ev.id);

            return (
              <div
                key={ev.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border hover:shadow-2xl transition"
              >
                {ev.bannerUrl && (
                  <img
                    src={ev.bannerUrl}
                    alt="Banner"
                    className="w-full h-44 object-cover"
                  />
                )}

                <div className="p-4">
                  <h3 className="font-bold text-xl text-blue-700">
                    {ev.title}
                  </h3>

                  <p className="text-gray-600 mt-1">
                    {ev.discipline} •{" "}
                    {new Date(ev.startAt).toLocaleString("pt-BR")}
                  </p>

                  {isSubscribed && (
                    <span className="inline-block mt-2 text-xs font-semibold text-green-600">
                      ✔ Você está inscrito
                    </span>
                  )}

                  <div className="mt-4 flex gap-2">
                    <button
                      className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                      onClick={() => nav(`/aluno/evento/${ev.id}`)}
                    >
                      <Eye size={18} />
                      Ver
                    </button>

                    {!isSubscribed && (
                      <button
                        className="flex items-center gap-1 border border-blue-600 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-50 transition"
                        onClick={() => handleSubscribe(ev.id)}
                      >
                        <CheckCircle size={18} />
                        Inscrever
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FOOTER */}
      <div className="py-3 bg-white shadow-lg border-t flex justify-around fixed bottom-0 left-0 right-0 z-50">
        <button
          onClick={() => nav("/aluno/presencas")}
          className="flex flex-col items-center text-blue-600"
        >
          <CheckCircle size={22} />
          <span className="text-xs mt-1">Presenças</span>
        </button>

        <button
          onClick={() => nav("/aluno/agenda")}
          className="flex flex-col items-center text-blue-600"
        >
          <CalendarDays size={22} />
          <span className="text-xs mt-1">Agenda</span>
        </button>

        <button
          onClick={() => nav("/aluno/perfil")}
          className="flex flex-col items-center text-blue-600"
        >
          <User size={22} />
          <span className="text-xs mt-1">Perfil</span>
        </button>
      </div>
    </div>
  );
}
