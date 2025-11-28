// src/pages/login/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import { loginUser, getUserDoc } from "../../services/auth";
import { useState } from "react";

export default function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("aluno"); // select login tipo
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    try{
      const user = await loginUser({ email, password });
      // check role in users doc
      const doc = await getUserDoc(user.uid);
      if(!doc) throw new Error("Usuário sem perfil.");
      if(doc.role !== type) throw new Error(`Este usuário não é do tipo ${type}.`);
      // redirect
      if(type === "aluno") navigate("/aluno/home");
      else navigate("/professor/home");
    }catch(err){
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <div className="mb-4">
          <label className="block mb-1">Entrar como</label>
          <select value={type} onChange={(e)=>setType(e.target.value)} className="w-full border p-2 rounded">
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <input className="w-full border p-2 rounded mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border p-2 rounded mb-3" type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} />

          {error && <div className="text-red-600 mb-2">{error}</div>}

          <button className="w-full bg-blue-600 text-white p-2 rounded">Entrar</button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/register-aluno" className="text-blue-600 hover:underline mr-3">Cadastrar como aluno</Link>
          <Link to="/register-professor" className="text-blue-600 hover:underline">Cadastrar como professor</Link>
        </div>
      </div>
    </div>
  );
}
