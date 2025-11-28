// src/pages/professor/InscritosEvento.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  getSubscriptionsByEvent, 
  getEventById, 
  markPresence,
  getUserById
} from "../../services/firestore";
import { auth } from "../../firebase";

export default function InscritosEvento() {
  const { id } = useParams(); 
  const [subs, setSubs] = useState([]);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    (async () => {
      const e = await getEventById(id);
      setEvent(e);

      const s = await getSubscriptionsByEvent(id);

      // buscar nome de cada aluno
      const enriched = [];
      for (const sub of s) {
        const user = await getUserById(sub.studentId);
        enriched.push({
          ...sub,
          studentName: user?.name || "Aluno sem nome",
        });
      }

      setSubs(enriched);
    })();
  }, [id]);

  async function handleMark(subId) {
    try {
      await markPresence(subId, auth.currentUser.uid);
      const updated = subs.map(s =>
        s.id === subId ? { ...s, presence: true } : s
      );
      setSubs(updated);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        Inscritos - {event?.title}
      </h2>

      <div className="bg-white p-4 rounded shadow">
        {subs.length === 0 ? (
          <p>Nenhum inscrito ainda.</p>
        ) : (
          subs.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <div className="font-medium">{s.studentName}</div>
                <div className="text-xs text-gray-500">
                  {new Date(
                    s.subscribedAt?.toDate?.() || s.subscribedAt
                  ).toLocaleString()}
                </div>
              </div>

              <div>
                {s.presence ? (
                  <span className="text-green-600">Presença confirmada</span>
                ) : (
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => handleMark(s.id)}
                  >
                    Marcar presença
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
