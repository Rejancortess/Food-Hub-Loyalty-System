import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  verifyPasswordResetCode,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../app/config/firebase";
import { PATHS, resolveRoleByEmail } from "../../app/config/constants";
import type { RegisterInput } from "./types";

type PresenceStatus = "Active" | "Inactive";

async function updateUserPresence(uid: string, status: PresenceStatus) {
  await setDoc(
    doc(db, "users", uid),
    {
      status,
      lastSeenAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function registerWithEmail(input: RegisterInput) {
  const cred = await createUserWithEmailAndPassword(
    auth,
    input.email,
    input.password,
  );

  const uid = cred.user.uid;
  const role = resolveRoleByEmail(input.email);

  await setDoc(doc(db, "users", uid), {
    uid,
    email: input.email,
    fullName: input.fullName,
    mobile: input.mobile,
    points: 0,
    userBalance: 0,
    role,
    status: "Inactive",
    createdAt: serverTimestamp(),
  });

  return cred.user;
}

export function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function markUserActive(uid: string) {
  await updateUserPresence(uid, "Active");
}

export async function markUserInactive(uid: string) {
  await updateUserPresence(uid, "Inactive");
}

export async function logout() {
  const currentUser = auth.currentUser;

  if (currentUser) {
    try {
      await markUserInactive(currentUser.uid);
    } catch (error) {
      console.error("Failed to update user status before logout:", error);
    }
  }

  return signOut(auth);
}

export function forgotPasswordWithEmail(email: string) {
  return sendPasswordResetEmail(auth, email, {
    // Redirect reset flow back into this app.
    url: `${window.location.origin}${PATHS.RESET_PASSWORD}`,
    handleCodeInApp: false,
  });
}

export function verifyResetCode(code: string) {
  return verifyPasswordResetCode(auth, code);
}

export function resetPasswordWithCode(code: string, newPassword: string) {
  return confirmPasswordReset(auth, code, newPassword);
}
