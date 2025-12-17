// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

/* Login / register */
import Login from "./pages/login/Login";
import RegisterAluno from "./pages/login/RegisterAluno";
import RegisterProfessor from "./pages/login/RegisterProfessor";

/* Aluno */
import HomeAluno from "./pages/aluno/HomeAluno";
import AgendaAluno from "./pages/aluno/AgendaAluno";
import EventoAluno from "./pages/aluno/EventoAluno";
import PresencasAluno from "./pages/aluno/PresencasAluno";
import PerfilAluno from "./pages/aluno/PerfilAluno";

/* Professor */
import HomeProfessor from "./pages/professor/HomeProfessor";
import CriarEvento from "./pages/professor/CriarEvento";
import AgendaProfessor from "./pages/professor/AgendaProfessor";
import InscritosEvento from "./pages/professor/InscritosEvento";
import PerfilProfessor from "./pages/professor/PerfilProfessor";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register-aluno" element={<RegisterAluno />} />
      <Route path="/register-professor" element={<RegisterProfessor />} />
      <Route path="/aluno/presencas" element={<PresencasAluno />} />

      {/* Aluno */}
      <Route path="/aluno/home" element={
        <ProtectedRoute role="aluno"><HomeAluno /></ProtectedRoute>
      } />
      <Route path="/aluno/agenda" element={
        <ProtectedRoute role="aluno"><AgendaAluno /></ProtectedRoute>
      } />
      <Route path="/aluno/evento/:id" element={
        <ProtectedRoute role="aluno"><EventoAluno /></ProtectedRoute>
      } />
      <Route path="/aluno/perfil" element={<PerfilAluno />} />

      {/* Professor */}
      <Route path="/professor/home" element={
        <ProtectedRoute role="professor"><HomeProfessor /></ProtectedRoute>
      } />
      <Route path="/professor/criar" element={
        <ProtectedRoute role="professor"><CriarEvento /></ProtectedRoute>
      } />
      <Route path="/professor/agenda" element={
        <ProtectedRoute role="professor"><AgendaProfessor /></ProtectedRoute>
      } />
      <Route path="/professor/evento/:id/inscritos" element={
        <ProtectedRoute role="professor"><InscritosEvento /></ProtectedRoute>
      } />
      <Route path="/professor/perfil" element={<PerfilProfessor />} />
    </Routes>
  );
}
