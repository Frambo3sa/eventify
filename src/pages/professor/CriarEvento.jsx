// src/pages/professor/CriarEvento.jsx
import { useState } from "react";
import { createEvent } from "../../services/firestore";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ProfessorCriarEvento() {
  const [title, setTitle] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [vagas, setVagas] = useState("");
  const [bannerBase64, setBannerBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  // Converte imagem para Base64
  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerBase64(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const startAt = new Date(`${date} ${time}`).toISOString();

      const evData = {
        title,
        discipline,
        description,
        location,
        startAt,
        bannerUrl: bannerBase64,
        maxVagas: vagas ? Number(vagas) : null,
        createdBy: auth.currentUser.uid,
      };

      await createEvent(evData);

      setLoading(false);
      nav("/professor/home");
    } catch (err) {
      setLoading(false);
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
      {/* HEADER */}
      <header className="bg-[#135F85] text-white p-4 flex items-center shadow">
        <button onClick={() => nav("/professor/home")}>
          <ArrowLeft size={28} className="mr-3" />
        </button>
        <h1 className="text-xl font-bold">Criar Evento</h1>
      </header>

      {/* FORM CONTAINER */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow mt-6 border border-[#135F85] w-full">
        <form onSubmit={handleSubmit}>

          <label className="block font-semibold text-[#135F85] mb-1">Título</label>
          <input
            className="w-full border border-[#135F85] p-2 rounded mb-4"
            placeholder="Ex: Aula de Reposição"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="block font-semibold text-[#135F85] mb-1">Disciplina</label>
          <input
            className="w-full border border-[#135F85] p-2 rounded mb-4"
            placeholder="Ex: Matemática"
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
          />

          <label className="block font-semibold text-[#135F85] mb-1">Descrição</label>
          <textarea
            className="w-full border border-[#135F85] p-2 rounded mb-4"
            placeholder="Descrição do evento"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="block font-semibold text-[#135F85] mb-1">Local</label>
          <input
            className="w-full border border-[#135F85] p-2 rounded mb-4"
            placeholder="Ex: Sala 12"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* DATA + HORA */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block font-semibold text-[#135F85] mb-1">Data</label>
              <input
                type="date"
                className="w-full border border-[#135F85] p-2 rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label className="block font-semibold text-[#135F85] mb-1">Hora</label>
              <input
                type="time"
                className="w-full border border-[#135F85] p-2 rounded"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <label className="block font-semibold text-[#135F85] mb-1">Número de vagas</label>
          <input
            className="w-full border border-[#135F85] p-2 rounded mb-4"
            placeholder="Deixe vazio para ilimitado"
            value={vagas}
            onChange={(e) => setVagas(e.target.value)}
          />

          {/* BANNER */}
          <label className="block font-semibold text-[#135F85] mb-1">Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="mb-4"
          />

          {/* BOTÃO */}
          <button
            className="bg-[#135F85] text-white px-4 py-2 rounded-xl w-full shadow hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? "Criando..." : "Criar Evento"}
          </button>
        </form>
      </div>
    </div>
  );
}
