import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../app/config/firebase";
import { resolveRoleByEmail } from "../../app/config/constants";
import type { RegisterInput } from "./types";

export async function registerWithEmail(input: RegisterInput) {
  const cred = await createUserWithEmailAndPassword(
    auth,
    input.email,
    input.password,
  );

  const uid = cred.user.uid;
  const role = resolveRoleByEmail(input.email);

  // Do not block registration forever if Firestore write is slow/unavailable.
  await Promise.race([
    setDoc(doc(db, "users", uid), {
      uid,
      email: input.email,
      fullName: input.fullName,
      mobile: input.mobile,
      role,
      createdAt: serverTimestamp(),
    }),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("profile-write-timeout")), 7000);
    }),
  ]).catch((error) => {
    console.warn("User profile write skipped:", error);
  });

  return cred.user;
}

export function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export function forgotPasswordWithEmail(email: string) {
  return sendPasswordResetEmail(auth, email);
}
