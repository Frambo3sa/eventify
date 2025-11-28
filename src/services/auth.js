// src/services/auth.js
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function registerUser({ name, email, password, role }) {
  // role: 'professor' | 'aluno'
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, {
    name,
    email,
    role,
    createdAt: new Date()
  });

  return userCredential.user;
}

export async function loginUser({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  // you can read user doc later to check role
  return cred.user;
}

export async function logoutUser() {
  return await signOut(auth);
}

export async function getUserDoc(uid) {
  const docRef = doc(db, "users", uid);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}
