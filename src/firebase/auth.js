
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

export const doSignInWithEmailAndPassWord = (email, password) => {
  const revertEmail = email+"@gmail.com"
  return signInWithEmailAndPassword(auth, revertEmail, password);
}

export const doSignOut = () => {
  return signOut(auth);
}
