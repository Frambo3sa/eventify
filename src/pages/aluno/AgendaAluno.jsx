// src/pages/aluno/AgendaAluno.jsx
import  { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { getEvents } from "../../services/firestore";
import { useNavigate } from "react-router-dom";

export default function AgendaAluno(){
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const nav = useNavigate();

  useEffect(()=>{
    (async ()=>{
      const all = await getEvents();
      setEvents(all);
    })();
  }, []);

  function eventsOnDate(d) {
    const dayStr = new Date(d).toDateString();
    return events.filter(ev => new Date(ev.startAt).toDateString() === dayStr);
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <Calendar value={date} onChange={setDate} />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Eventos em {date.toDateString()}</h3>
        {eventsOnDate(date).length === 0 ? <p>Nenhum evento nesse dia.</p> : eventsOnDate(date).map(ev => (
          <div key={ev.id} className="border-b py-3 flex justify-between items-center">
            <div>
              <div className="font-medium">{ev.title}</div>
              <div className="text-sm text-gray-500">{ev.discipline} • {new Date(ev.startAt).toLocaleTimeString()}</div>
            </div>
            <button className="text-blue-600" onClick={()=>nav(`/aluno/evento/${ev.id}`)}>Ver</button>
          </div>
        ))}
      </div>
    </div>
  );
}
