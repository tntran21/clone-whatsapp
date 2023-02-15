import type { AppProps } from "next/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/config/firebase";

import Login from "./login";
import Loading from "@/components/Loading";

import ProgessContextProvider from "@/contexts/progessContext";
import "@/styles/globals.css";
import { useEffect } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export default function App({ Component, pageProps }: AppProps) {
  const [loggedInUser, loading, _error] = useAuthState(auth);

  useEffect(() => {
    const setUserInDb = async () => {
      try {
        // set data to collection/ if !collection aut create new collection
        await setDoc(
          doc(db, "users", loggedInUser?.uid as string),
          {
            email: loggedInUser?.email,
            lastSeen: serverTimestamp(),
            photoURL: loggedInUser?.photoURL,
          },
          { merge: true } // just update what is changed
        );
      } catch (error) {
        console.log("ERROR SETTING USER INFO IN DB", error);
      }
    };

    if (loggedInUser) {
      setUserInDb();
    }
  }, [loggedInUser]);

  if (loading) return <Loading />;

  if (!loggedInUser) return <Login />;

  return (
    <ProgessContextProvider>
      <Component {...pageProps} />
    </ProgessContextProvider>
  );
}
