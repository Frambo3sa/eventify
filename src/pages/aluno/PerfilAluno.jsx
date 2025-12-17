// src/pages/aluno/PerfilAluno.jsx
import { useState } from "react";
import { auth } from "../../firebase";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function PerfilAluno() {
  const nav = useNavigate();
  const user = auth.currentUser;

  const [name, setName] = useState(user?.displayName || "");
  const [email] = useState(user?.email || "");
  const [editMode, setEditMode] = useState(false);

  async function handleSave() {
    try {
      await updateProfile(user, { displayName: name });
      alert("Nome atualizado com sucesso!");
      setEditMode(false);
    } catch (err) {
      alert(err.message);
    }
  }

  function handleLogout() {
    auth.signOut();
    nav("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 flex flex-col items-center">
      {/* HEADER */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={() => nav(-1)}
          className="text-xl font-bold text-gray-600"
        >
          ←
        </button>

        <h1 className="text-2xl font-semibold text-gray-800">
          Meu Perfil
        </h1>

        <div className="w-6"></div>
      </div>

      {/* AVATAR */}
      <img
        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${email}`}
        alt="avatar"
        className="w-28 h-28 rounded-full shadow mb-4 bg-white"
      />

      {/* CARD */}
      <div className="w-full max-w-md bg-white p-5 rounded-2xl shadow space-y-4">

        {/* NOME */}
        <div>
          <label className="font-medium text-gray-700">Nome</label>

          {editMode ? (
            <input
              className="w-full border p-2 mt-1 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p className="text-gray-900 mt-1">{name || "—"}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="font-medium text-gray-700">E-mail</label>
          <p className="text-gray-900 mt-1">{email}</p>
        </div>

        {/* BOTÃO EDITAR / SALVAR */}
        {editMode ? (
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-xl shadow"
            onClick={handleSave}
          >
            Salvar
          </button>
        ) : (
          <button
            className="w-full bg-gray-800 text-white py-2 rounded-xl shadow"
            onClick={() => setEditMode(true)}
          >
            Editar Perfil
          </button>
        )}

        {/* SAIR */}
        <button
          className="w-full bg-red-600 text-white py-2 rounded-xl shadow mt-2"
          onClick={handleLogout}
        >
          Sair da Conta
        </button>
      </div>
    </div>
  );
}
