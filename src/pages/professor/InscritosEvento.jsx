// src/pages/professor/InscritosEvento.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSubscriptionsByEvent,
  getEventById,
  markPresence,
  getUserById
} from "../../services/firestore";
import { auth } from "../../firebase";
import { FiArrowLeft } from "react-icons/fi"; // ÍCONE CORRETO

export default function InscritosEvento() {
  const { id } = useParams();
  const [subs, setSubs] = useState([]);
  const [event, setEvent] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const e = await getEventById(id);
      setEvent(e);

      const s = await getSubscriptionsByEvent(id);

      // adicionar nome do aluno
      const enriched = [];
      for (const sub of s) {
        const user = await getUserById(sub.studentId);
        enriched.push({
          ...sub,
          studentName: user?.name || "Aluno sem nome"
        });
      }

      setSubs(enriched);
    })();
  }, [id]);

  async function handleMark(subId) {
    try {
      await markPresence(subId, auth.currentUser.uid);

      const updated = subs.map((s) =>
        s.id === subId ? { ...s, presence: true } : s
      );

      setSubs(updated);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="p-4">
      {/* CABEÇALHO COM SETA */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => nav(-1)}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <FiArrowLeft size={22} />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inscritos no Evento</h2>
          <p className="text-gray-600 -mt-1">{event?.title || "Carregando..."}</p>
        </div>
      </div>

      {/* CARD */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        {subs.length === 0 ? (
          <p className="text-gray-600">Nenhum inscrito ainda.</p>
        ) : (
          <div className="space-y-4">
            {subs.map((s) => (
              <div
                key={s.id}
                className="flex justify-between items-center border-b pb-4"
              >
                {/* INFO DO ALUNO */}
                <div>
                  <div className="font-semibold text-gray-900">{s.studentName}</div>
                  <div className="text-xs text-gray-500">
                    Inscrito em:{" "}
                    {new Date(
                      s.subscribedAt?.toDate?.() || s.subscribedAt
                    ).toLocaleString("pt-BR")}
                  </div>
                </div>

                {/* AÇÃO */}
                <div>
                  {s.presence ? (
                    <span className="text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full">
                      Presença confirmada
                    </span>
                  ) : (
                    <button
                      className="bg-blue-600 text-white px-4 py-1 rounded-lg shadow hover:bg-blue-700 transition"
                      onClick={() => handleMark(s.id)}
                    >
                      Marcar presença
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
