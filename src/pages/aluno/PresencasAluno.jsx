// src/pages/aluno/PresencasAluno.jsx
import { useEffect, useState } from "react";
import { getPresencesByStudent } from "../../services/firestore";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, CalendarDays, CheckCircle, User } from "lucide-react";

export default function PresencasAluno() {
  const [presences, setPresences] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const studentId = auth.currentUser.uid;
      const data = await getPresencesByStudent(studentId);
      setPresences(data);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-20 flex flex-col">

      {/* HEADER */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => nav(-1)}
          className="text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={26} />
        </button>

        <h2 className="text-2xl font-bold text-blue-700 mx-auto">
          Minhas Presenças
        </h2>

        <div className="w-6" /> {/* Espaço para centralizar */}
      </div>

      {/* LISTA */}
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 flex-1 overflow-y-auto">
        {presences.length === 0 ? (
          <p className="text-gray-600 text-center mt-6">
            Você ainda não possui presenças registradas.
          </p>
        ) : (
          presences.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-green-50 rounded-xl mb-3 border border-green-200 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={20} className="text-green-600" />
                <h3 className="text-lg font-semibold text-green-700">
                  Presença Confirmada
                </h3>
              </div>

              <p className="font-semibold text-gray-800">
                {p.event?.title || "Evento removido"}
              </p>

              <p className="text-sm text-gray-600">
                {p.event?.discipline}
              </p>

              <p className="text-sm text-gray-700 mt-1">
                <strong>Professor:</strong>{" "}
                {p.professor?.name ||
                  p.professor?.email ||
                  "Professor removido"}
              </p>

              <p className="text-sm text-gray-700">
                <strong>Marcada em:</strong>{" "}
                {new Date(p.markedAt).toLocaleString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      <div className="py-3 bg-white shadow-xl border-t fixed bottom-0 left-0 right-0 flex justify-around">

        {/* HOME */}
        <button
          onClick={() => nav("/aluno/home")}
          className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition"
        >
          <Home size={22} />
          <span className="text-xs">Home</span>
        </button>

        {/* AGENDA */}
        <button
          onClick={() => nav("/aluno/agenda")}
          className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition"
        >
          <CalendarDays size={22} />
          <span className="text-xs">Agenda</span>
        </button>

        {/* PRESENÇAS (ATIVO) */}
        <button
          onClick={() => nav("/aluno/presencas")}
          className="flex flex-col items-center text-blue-600 font-semibold transition"
        >
          <CheckCircle size={22} />
          <span className="text-xs">Presenças</span>
        </button>

        {/* PERFIL */}
        <button
          onClick={() => nav("/aluno/perfil")}
          className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition"
        >
          <User size={22} />
          <span className="text-xs">Perfil</span>
        </button>

      </div>
    </div>
  );
}
