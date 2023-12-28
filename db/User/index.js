import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
  } from "firebase/firestore";
import { db } from "../firebase";

export class User{
    async getMe(uid) {
        try {
          // Comprobar si el usuario existe en la colección 'users'
          let userData;
          const userRef = doc(db, uid,"EstudentsInfo");
          const userSnap = await getDoc(userRef);
    
          userData = { ...userSnap.data(), uid };
    
          // Devolver los datos del usuario
          return userData;
        } catch (error) {
          throw `Error de firebase : ${error}`;
        }
      }
}