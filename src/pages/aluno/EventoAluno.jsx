// src/pages/aluno/EventoAluno.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEventById,
  subscribeToEvent,
  getSubscriptionsByEvent
} from "../../services/firestore";
import { auth } from "../../firebase";

import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Home,
  CalendarDays,
  CheckCircle,
  User
} from "lucide-react";

export default function EventoAluno() {
  const { id } = useParams();
  const nav = useNavigate();

  const [ev, setEv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inscrito, setInscrito] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Carregar evento + verificar inscrição
  useEffect(() => {
    (async () => {
      const eventData = await getEventById(id);
      setEv(eventData);

      const subs = await getSubscriptionsByEvent(id);
      const userId = auth.currentUser?.uid;

      if (subs.some(s => s.studentId === userId)) setInscrito(true);

      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="p-4">Carregando...</div>;
  if (!ev) return <div className="p-4">Evento não encontrado</div>;

  // Função de inscrição
  async function handleSubscribe() {
    try {
      setSubmitting(true);
      const studentId = auth.currentUser.uid;

      await subscribeToEvent({ eventId: id, studentId });
      alert("Inscrição realizada com sucesso!");

      setInscrito(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-20">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md">

        <button
          onClick={() => nav(-1)}
          className="text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={26} />
        </button>

        <h2 className="text-xl font-bold text-blue-700">Evento</h2>

        {/* Ícone de perfil */}
        <button onClick={() => nav("/aluno/perfil")}>
          <User size={26} className="text-blue-600" />
        </button>
      </div>

      {/* BANNER */}
      {ev.bannerUrl && (
        <div className="relative">
          <img
            src={ev.bannerUrl}
            className="w-full h-60 object-cover"
          />

          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-end p-4">
            <h1 className="text-white text-2xl font-bold drop-shadow-lg">
              {ev.title}
            </h1>
          </div>
        </div>
      )}

      {/* CARD DE INFORMAÇÕES */}
      <div className="p-4 flex-1">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">

          {/* Título */}
          <h2 className="text-xl font-bold text-gray-800 mb-3">{ev.title}</h2>

          {/* Data e hora */}
          <div className="text-gray-600 text-sm flex gap-4 mb-3">
            <span className="flex items-center gap-1">
              <CalendarIcon size={18} />
              {new Date(ev.startAt).toLocaleDateString()}
            </span>

            <span className="flex items-center gap-1">
              <Clock size={18} />
              {new Date(ev.startAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>
          </div>

          {/* Local */}
          <p className="flex items-center gap-2 text-gray-700 mb-4">
            <MapPin size={18} className="text-blue-600" />
            {ev.location || "Local não informado"}
          </p>

          {/* Descrição */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-1">
              Sobre o evento:
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {ev.description || "Sem descrição disponível."}
            </p>
          </div>

          {/* Botão de inscrição */}
          <button
            disabled={inscrito || submitting}
            onClick={handleSubscribe}
            className={`w-full py-3 rounded-xl text-white font-semibold transition ${
              inscrito
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {inscrito
              ? "Você já está inscrito"
              : submitting
              ? "Realizando inscrição..."
              : "Realizar Inscrição"}
          </button>

        </div>
      </div>

      {/* FOOTER PADRÃO */}
      <div className="py-3 bg-white shadow-xl border-t fixed bottom-0 left-0 right-0 flex justify-around">

        <button
          onClick={() => nav("/aluno/home")}
          className="flex flex-col items-center text-gray-600 hover:text-blue-600"
        >
          <Home size={22} />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => nav("/aluno/agenda")}
          className="flex flex-col items-center text-gray-600 hover:text-blue-600"
        >
          <CalendarDays size={22} />
          <span className="text-xs">Agenda</span>
        </button>

        <button
          onClick={() => nav("/aluno/presencas")}
          className="flex flex-col items-center text-gray-600 hover:text-blue-600"
        >
          <CheckCircle size={22} />
          <span className="text-xs">Presenças</span>
        </button>

        <button
          onClick={() => nav("/aluno/perfil")}
          className="flex flex-col items-center text-gray-600 hover:text-blue-600"
        >
          <User size={22} />
          <span className="text-xs">Perfil</span>
        </button>

      </div>

    </div>
  );
}
