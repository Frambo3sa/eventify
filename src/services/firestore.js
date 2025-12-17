// src/services/firestore.js
import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  orderBy
} from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";

// ------- (REMOVIDO) UPLOAD DE BANNER -------
// Agora o banner é salvo em Base64 diretamente no Firestore.
// NÃO PRECISA mais usar Firebase Storage.
// Mantemos aqui apenas uma função vazia caso algum import antigo exista.
export function uploadBanner() {
  return null;
}

// ------- CRIAR EVENTO -------
export async function createEvent(eventData) {
  const colRef = collection(db, "events");
  const docRef = await addDoc(colRef, {
    ...eventData,
    createdAt: new Date()
  });
  return docRef.id;
}

// ------- LISTAR EVENTOS -------
export async function getEvents() {
  const colRef = collection(db, "events");
  const snaps = await getDocs(query(colRef, orderBy("startAt")));
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ------- EVENTO POR ID -------
export async function getEventById(id) {
  const docRef = doc(db, "events", id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// ------- INSCREVER ALUNO -------
export async function subscribeToEvent({ eventId, studentId }) {
  const colRef = collection(db, "subscriptions");
  const docRef = await addDoc(colRef, {
    eventId,
    studentId,
    subscribedAt: new Date(),
    presence: false
  });
  return docRef.id;
}

// ------- INSCRITOS DO EVENTO -------
export async function getSubscriptionsByEvent(eventId) {
  const colRef = collection(db, "subscriptions");
  const q = query(colRef, where("eventId", "==", eventId));
  const snaps = await getDocs(q);

  return snaps.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}

// ------- MARCAR PRESENÇA -------
export async function markPresence(subscriptionId, markedBy) {
  const docRef = doc(db, "subscriptions", subscriptionId);
  await updateDoc(docRef, {
    presence: true,
    markedBy,
    markedAt: new Date()
  });
}

// ------- PEGAR DADOS DO USUÁRIO -------
export async function getUserById(uid) {
  const docRef = doc(db, "users", uid);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data();
}


export async function deleteEvent(eventId) {
  const ref = doc(db, "events", eventId);
  await deleteDoc(ref);
}
// ---- PEGAR PRESENÇAS DO ALUNO ----
export async function getPresencesByStudent(studentId) {
  const colRef = collection(db, "subscriptions");
  const q = query(
    colRef,
    where("studentId", "==", studentId),
    where("presence", "==", true)
  );
  const snaps = await getDocs(q);

  const list = [];
  for (let d of snaps.docs) {
    const sub = d.data();

    const eventSnap = await getDoc(doc(db, "events", sub.eventId));
    const eventData = eventSnap.exists() ? eventSnap.data() : null;

    const profSnap = await getDoc(doc(db, "users", sub.markedBy));
    const profData = profSnap.exists() ? profSnap.data() : null;

    list.push({
      id: d.id,
      event: eventData,
      professor: profData,
      markedAt: sub.markedAt?.toDate?.() || new Date(sub.markedAt)
    });
  }

  return list;
}
