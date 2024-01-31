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
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";


export class User {
  async getMe(uid) {
    try {
      // Comprobar si el usuario existe en la colección 'users'
      let userData;
      const userRef = doc(db, uid, "EstudentsInfo");
      const userSnap = await getDoc(userRef);

      userData = { ...userSnap.data(), uid };
      // Devolver los datos del usuario
      return userData;
    } catch (error) {
      throw `Error de firebase : ${error}`;
    }
  }

  async getUser(uid) {
    try {
      // Comprobar si el usuario existe en la colección 'users'
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        // El usuario existe, devolver sus datos
        const userData = { ...userSnap.data(), uid };
        return userData;
      } else {
        // El usuario no existe, devolver mensaje indicando que no existe
        return "No existe usuario";
      }
    } catch (error) {
      throw `Error de Firebase: ${error}`;
    }
  }

  async isPremium(uid) {

    let isPremium = false;

    const docRef = doc(db, uid, 'isPremium');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      isPremium = docSnap.data().isPremium;
    } else {
      isPremium = false;
    }

    return isPremium;

  }

  async getUsers() {
    const q = query(
      collection(db, "users")
    );
    const dataSnapshot = await getDocs(q);
    const newData = dataSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return newData;
  }

  async createUserWeb(uid, cursoData) {
    try {
      const blogRef = doc(db, "users", uid);
      await setDoc(blogRef, cursoData);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async createUser(userData) {
    try {
      const { email, password } = userData;
      //crea el email y password en firebase auth
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const { uid } = userCredentials.user;

      let UserWebData = {
        email: userData.email,
      };

      let UserAppData = {
        nombre: userData?.nombre,
        apellido: userData?.apellido,
        email: userData?.email
      }

      const userDocRef = doc(db, "users", uid);
      await setDoc(userDocRef, UserWebData);

      const userAppDocRef = doc(db,uid,"EstudentsInfo")

      await setDoc(userAppDocRef,UserAppData)

      return true;
    } catch (error) {
      console.log(error.message)

      return error.message;
    }
  }
}