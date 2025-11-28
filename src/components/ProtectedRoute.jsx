// src/components/ProtectedRoute.jsx
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getUserDoc } from "../services/auth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }
      const userDoc = await getUserDoc(user.uid);
      if (userDoc && userDoc.role === role) setAllowed(true);
      else setAllowed(false);
      setLoading(false);
    });
    return () => unsub();
  }, [role]);

  if (loading) return <div>Carregando...</div>;
  if (!allowed) return <Navigate to="/login" replace />;
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  role: PropTypes.oneOf(["professor", "aluno"]).isRequired
};
