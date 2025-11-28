// src/pages/professor/CriarEvento.jsx
import { useState } from "react";
import { uploadBanner, createEvent } from "../../services/firestore";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function ProfessorCriarEvento() {
  const [title, setTitle] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [vagas, setVagas] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let bannerUrl = "";
      if (file) bannerUrl = await uploadBanner(file);

      const startAt = new Date(`${date} ${time}`).toISOString();

      const evData = {
        title,
        discipline,
        description,
        location,
        startAt,
        bannerUrl,
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
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Criar Evento</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Disciplina"
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded mb-3"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Local"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="flex gap-2 mb-3">
          <input
            type="date"
            className="border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="time"
            className="border p-2 rounded"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Número de vagas (vazio = ilimitado)"
          value={vagas}
          onChange={(e) => setVagas(e.target.value)}
        />

        <div className="mb-3">
          <label className="block mb-1">Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Criando..." : "Criar Evento"}
        </button>
      </form>
    </div>
  );
}
