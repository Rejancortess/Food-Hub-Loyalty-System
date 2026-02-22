import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../app/config/firebase";
import { ROLES } from "../../app/config/constants";
import type { RegisterInput } from "./types";

export async function registerWithEmail(input: RegisterInput) {
  const cred = await createUserWithEmailAndPassword(
    auth,
    input.email,
    input.password,
  );

  const uid = cred.user.uid;
  const role = input.role ?? ROLES.CLIENT;

  await setDoc(doc(db, "users", uid), {
    uid,
    email: input.email,
    fullName: input.fullName,
    mobile: input.mobile,
    role,
    createdAt: serverTimestamp(),
  });

  return cred.user;
}

export function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}
