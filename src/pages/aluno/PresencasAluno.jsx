import { useEffect, useState } from "react";
import { getPresencesByStudent } from "../../services/firestore";
import { auth } from "../../firebase";

export default function PresencasAluno() {
  const [presences, setPresences] = useState([]);

  useEffect(() => {
    (async () => {
      const studentId = auth.currentUser.uid;
      const data = await getPresencesByStudent(studentId);
      setPresences(data);
    })();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Minhas Presenças</h2>

      <div className="bg-white p-4 rounded shadow">
        {presences.length === 0 ? (
          <p>Você ainda não tem presenças registradas.</p>
        ) : (
          presences.map((p) => (
            <div
              key={p.id}
              className="border-b py-3 flex flex-col gap-1 mb-3"
            >
              <div className="font-semibold text-lg">
                {p.event?.title || "Evento removido"}
              </div>

              <div className="text-sm text-gray-600">
                {p.event?.discipline}
              </div>

              <div className="text-sm">
                <strong>Professor:</strong>{" "}
                {p.professor?.name || p.professor?.email || "Professor removido"}
              </div>

              <div className="text-sm text-gray-700">
                <strong>Marcada em:</strong>{" "}
                {new Date(p.markedAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
