
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

export const doSignInWithEmailAndPassWord = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
}

export const doSignOut = () => {
  return signOut(auth);
}
