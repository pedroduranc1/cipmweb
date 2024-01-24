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

  async obtenerColecciones() {
    try {
      const coleccionesSnapshot = await listCollections(db)

      // Array para almacenar los nombres de todas las colecciones
      const todasLasColecciones = [];

      // Recorre las colecciones y agrega sus nombres al array
      coleccionesSnapshot.forEach((coleccion) => {
        todasLasColecciones.push(coleccion.id);
      });

      // Excluir dos colecciones específicas
      const coleccionesExcluidas = ['cursos', 'videos'];
      const coleccionesFiltradas = todasLasColecciones.filter(
        (coleccion) => !coleccionesExcluidas.includes(coleccion)
      );

      console.log('Todas las colecciones:', todasLasColecciones);
      console.log('Colecciones filtradas:', coleccionesFiltradas);
    } catch (error) {
      console.error('Error al obtener colecciones:', error);
    }
  }

  async obteColecciones() {
    const q = query(db);

    const snapshot = await getDocs(q);

    const collections = snapshot.docs.map(doc => doc.id);

    console.log(collections)
    return collections
  }
}