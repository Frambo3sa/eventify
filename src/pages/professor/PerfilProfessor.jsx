// src/pages/professor/PerfilProfessor.jsx
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";

export default function PerfilProfessor() {
  const [professor, setProfessor] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      setProfessor({
        nome: user.displayName || "Professor",
        email: user.email,
        uid: user.uid,
      });
    }
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    nav("/login");
  };

  if (!professor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#135F85]">
        Carregando informações...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
      {/* HEADER */}
      <header className="flex items-center justify-between p-4 bg-[#135F85] text-white shadow">
        <button onClick={() => nav("/professor/home")}>
          <ArrowLeft size={28} />
        </button>

        <h1 className="text-xl font-bold">Meu Perfil</h1>

        <div className="w-7" /> {/* espaçamento para alinhar o título */}
      </header>

      {/* CONTEÚDO */}
      <main className="flex-1 p-6 flex flex-col items-center text-[#135F85]">

        <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-[#135F85]">

          <h2 className="text-2xl font-bold text-center mb-4">
            Informações do Professor
          </h2>

          {/* Nome */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-600">Nome:</p>
            <p className="text-lg font-medium">{professor.nome}</p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-600">E-mail:</p>
            <p className="text-lg font-medium">{professor.email}</p>
          </div>

          {/* UID */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-600">ID do Usuário:</p>
            <p className="text-md break-all">{professor.uid}</p>
          </div>

          {/* Botão de logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-[#F2C75B] text-[#135F85] py-3 rounded-xl font-bold shadow hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <LogOut size={22} />
            Sair da Conta
          </button>

        </div>
      </main>
    </div>
  );
}
