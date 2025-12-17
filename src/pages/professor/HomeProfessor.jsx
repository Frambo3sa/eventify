// src/pages/professor/HomeProfessor.jsx
import { useEffect, useState } from "react";
import { getEvents, deleteEvent } from "../../services/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import {
  ArrowLeft,
  User,
  Calendar,
  PlusCircle,
  List,
  Trash2
} from "lucide-react";

export default function HomeProfessor() {
  const [events, setEvents] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const all = await getEvents();
    const user = auth.currentUser;
    if (!user) return;

    const mine = all.filter((e) => e.createdBy === user.uid);
    setEvents(mine);
  }

  async function handleDelete(eventId) {
    const confirm = window.confirm(
      "Tem certeza que deseja excluir este evento?\nEssa ação não pode ser desfeita."
    );

    if (!confirm) return;

    try {
      await deleteEvent(eventId);
      setEvents(events.filter((e) => e.id !== eventId));
      alert("Evento excluído com sucesso!");
    } catch (err) {
      alert("Erro ao excluir evento.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
      {/* TOPO */}
      <header className="flex items-center justify-between p-4 bg-[#135F85] text-white shadow">
        <button onClick={() => nav("/login")}>
          <ArrowLeft size={28} />
        </button>

        <h1 className="text-xl font-bold">Área do Professor</h1>

        <button onClick={() => nav("/professor/perfil")}>
          <User size={28} />
        </button>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-1 flex flex-col items-center p-6">

        {/* BOTÕES PRINCIPAIS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-6">

          <button
            onClick={() => nav("/professor/home")}
            className="bg-[#135F85] text-white p-6 rounded-2xl shadow-xl flex flex-col items-center"
          >
            <List size={40} className="mb-2" />
            <span className="text-lg font-semibold">Meus Eventos</span>
          </button>

          <button
            onClick={() => nav("/professor/criar")}
            className="bg-[#F2C75B] text-[#135F85] p-6 rounded-2xl shadow-xl flex flex-col items-center"
          >
            <PlusCircle size={40} className="mb-2" />
            <span className="text-lg font-bold">Criar Evento</span>
          </button>

          <button
            onClick={() => nav("/professor/agenda")}
            className="bg-[#A3D3A1] text-[#135F85] p-6 rounded-2xl shadow-xl flex flex-col items-center"
          >
            <Calendar size={40} className="mb-2" />
            <span className="text-lg font-semibold">Agenda</span>
          </button>
        </div>

        {/* LISTA */}
        <h2 className="text-2xl font-semibold mt-10 text-[#135F85]">
          Meus Eventos Criados
        </h2>

        {events.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow w-full max-w-xl mt-4 text-center border border-[#135F85]">
            Nenhum evento criado.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mt-4 w-full max-w-4xl">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white p-4 rounded-xl shadow border border-[#135F85]"
              >
                {ev.bannerUrl && (
                  <img
                    src={ev.bannerUrl}
                    alt="Banner"
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                )}

                <h3 className="font-semibold text-lg text-[#135F85]">
                  {ev.title}
                </h3>

                <p className="text-gray-700">
                  {ev.discipline} •{" "}
                  {new Date(ev.startAt).toLocaleString("pt-BR")}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <button
                    className="text-[#135F85] underline"
                    onClick={() =>
                      nav(`/professor/evento/${ev.id}/inscritos`)
                    }
                  >
                    Ver Inscritos
                  </button>

                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#135F85] text-white flex justify-around items-center p-4 shadow-inner">
        <button onClick={() => nav("/professor/home")} className="flex flex-col items-center">
          <List size={26} />
          <span className="text-sm">Eventos</span>
        </button>

        <button onClick={() => nav("/professor/criar")} className="flex flex-col items-center">
          <PlusCircle size={26} />
          <span className="text-sm">Criar</span>
        </button>

        <button onClick={() => nav("/professor/agenda")} className="flex flex-col items-center">
          <Calendar size={26} />
          <span className="text-sm">Agenda</span>
        </button>
      </footer>
    </div>
  );
}
