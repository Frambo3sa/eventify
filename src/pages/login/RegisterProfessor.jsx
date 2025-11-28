// src/pages/login/RegisterProfessor.jsx
import { useState } from "react";
import { registerUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function RegisterProfessor(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    try{
      await registerUser({ name, email, password, role: "professor" });
      navigate("/login");
    }catch(err){
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Cadastro - Professor</h2>
        <form onSubmit={handleSubmit}>
          <input className="w-full border p-2 rounded mb-3" placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full border p-2 rounded mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border p-2 rounded mb-3" type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <button className="w-full bg-green-700 text-white p-2 rounded">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}
