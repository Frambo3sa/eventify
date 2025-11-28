// src/pages/aluno/EventoAluno.jsx
import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../../services/firestore";

export default function EventoAluno(){
  const { id } = useParams();
  const [ev, setEv] = useState(null);

  useEffect(()=>{
    (async ()=>{
      const e = await getEventById(id);
      setEv(e);
    })();
  }, [id]);

  if(!ev) return <div>Carregando...</div>;

  return (
    <div className="max-w-3xl bg-white p-6 rounded shadow">
      {ev.bannerUrl && <img src={ev.bannerUrl} alt="" className="w-full h-60 object-cover rounded mb-4" />}
      <h2 className="text-2xl font-semibold mb-2">{ev.title}</h2>
      <p className="text-sm text-gray-500 mb-2">{ev.discipline} • {new Date(ev.startAt).toLocaleString()}</p>
      <p className="mb-4">{ev.description}</p>
      <p><strong>Local:</strong> {ev.location}</p>
      <p><strong>Vagas:</strong> {ev.maxVagas ?? "Ilimitadas"}</p>
    </div>
  );
}
