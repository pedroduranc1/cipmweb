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

export class Cursos {

    async getCursos() {
        try {
            // Comprobar si el usuario existe en la colección 'users'
            let cursosData;
            const cursoRef = doc(db, "cursos");
            const cursoSnap = await getDoc(cursoRef);
            
            cursosData = { ...cursoSnap.data()};
            // Devolver los datos del usuario
            return cursosData;
          } catch (error) {
            throw `Error de firebase : ${error}`;
          }
    }
}