// src/pages/professor/HomeProfessor.jsx
import  { useEffect, useState } from "react";
import { getEvents } from "../../services/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

export default function HomeProfessor(){
  const [events, setEvents] = useState([]);
  const nav = useNavigate();

  useEffect(()=>{
    (async ()=>{
      const all = await getEvents();
      // show only events created by this professor
      const user = auth.currentUser;
      if(!user) return;
      const mine = all.filter(e => e.createdBy === user.uid);
      setEvents(mine);
    })();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Meus Eventos</h2>
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={()=>nav("/professor/criar")}>Criar evento</button>
      </div>

      {events.length === 0 ? (
        <div className="bg-white p-6 rounded shadow">Nenhum evento criado.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map(ev => (
            <div key={ev.id} className="bg-white p-4 rounded shadow">
              <img src={ev.bannerUrl} alt="" className="w-full h-40 object-cover rounded mb-2"/>
              <h3 className="font-semibold">{ev.title}</h3>
              <p>{ev.discipline} • {new Date(ev.startAt).toLocaleString()}</p>
              <div className="mt-2">
                <button className="text-blue-600 mr-2" onClick={()=>nav(`/professor/evento/${ev.id}/inscritos`)}>Inscritos</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
