"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useDispatch } from "react-redux";
import { setUser, clearUser, setSubscription } from "@/redux/slices/userSlice";
import { doc, getDoc } from "firebase/firestore";

const GUEST_EMAIL = "guest12345000@gmail.com";

export default function AuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email || "" }));
        if (user.email === GUEST_EMAIL) {
          dispatch(setSubscription("premium"));
        } else {
          try {
            const docRef = doc(db, "users", user.uid, "subscription", "status");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              dispatch(setSubscription(docSnap.data().plan));
            } else {
              dispatch(setSubscription("basic"));
            }
          } catch (err) {
            console.error(err);
          }
        }
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return null;
}
