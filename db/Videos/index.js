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

export class Videos {

    async getVideos(uid) {
        const q = query(collection(db, "videos"), where("CursoID", "==", uid));

        const querySnapshot = await getDocs(q);
        const videosData = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });

        return videosData;
    }
}