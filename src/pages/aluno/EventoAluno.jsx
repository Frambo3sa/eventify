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
  Calendar,
  Clock,
  MapPin
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

      if (subs.some(s => s.studentId === userId)) {
        setInscrito(true);
      }

      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (!ev) return <div>Evento não encontrado</div>;

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
    <div className="max-w-xl mx-auto bg-white p-4 rounded shadow">
      {/* Header com botão voltar */}
      <button
        onClick={() => nav(-1)}
        className="flex items-center text-gray-600 mb-3"
      >
        <ArrowLeft size={22} className="mr-1" />
        Voltar
      </button>

      {/* Banner */}
      {ev.bannerUrl && (
        <img
          src={ev.bannerUrl}
          className="w-full h-52 object-cover rounded mb-4"
        />
      )}

      {/* Título */}
      <h2 className="text-xl font-semibold mb-2">{ev.title}</h2>

      {/* Data / horário */}
      <div className="text-sm text-gray-600 flex items-center gap-4 mb-3">
        <span className="flex items-center gap-1">
          <Calendar size={18} /> {new Date(ev.startAt).toLocaleDateString()}
        </span>

        <span className="flex items-center gap-1">
          <Clock size={18} />{" "}
          {new Date(ev.startAt)
            .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* Local */}
      <p className="flex items-center gap-2 text-gray-700 mb-4">
        <MapPin size={18} />
        {ev.location}
      </p>

      {/* Sobre o evento */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-1">Sobre o evento:</h3>
        <p className="text-gray-700 text-sm">{ev.description}</p>
      </div>

      {/* Botão */}
      <button
        disabled={inscrito || submitting}
        onClick={handleSubscribe}
        className={`w-full py-3 rounded text-white transition ${
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
  );
}
