import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "@firebase/storage";

export class Cursos {

  async getCursos(isAdmin = false) {
    const q = isAdmin
      ? query(collection(db, "cursos"))
      : query(collection(db, "cursos"), where("publicado", "==", true));
    const dataSnapshot = await getDocs(q);
    return dataSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async getCurso(id) {
    const docRef = doc(db, "cursos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return "Error";
    }
  }

  async updateCurso(blogId, blogData) {
    try {
      const blogRef = doc(db, "cursos", blogId);
      await updateDoc(blogRef, blogData);
      return true;
    } catch (error) {
      console.error("Error updating blog: ", error);
      return false;
    }
  }

  async uploadCursoImage(file, uid, slug) {
    // Obtén la extensión del archivo
    const fileExtension = file.name.split(".").pop();

    // Crea el nombre del archivo en Firebase Storage
    const firebaseFileName = `${uid}.${fileExtension}`;

    const fileRef = ref(
      storage,
      `/cursoImages/${slug}/${firebaseFileName}`
    );
    const uploadTask = uploadBytesResumable(fileRef, file);

    // Espera a que la carga se complete
    await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progreso de la carga
        },
        (error) => {
          // Error
          reject(error);
        },
        () => {
          // Completado
          resolve();
        }
      );
    });

    // Obtiene la URL de descarga
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  }

  async createCurso(uid, cursoData) {
    try {
      const blogRef = doc(db, "cursos", uid);
      await setDoc(blogRef, cursoData);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteCurso(curso) {
    try {
      // Eliminar el documento del blog de la colección "blogs"
      const cursoRef = doc(db, "cursos", curso.id);
      await deleteDoc(cursoRef);

      // Eliminar la información de la imagen (u otro archivo) relacionada con el blog en Storage
      if (curso.ImgUrl !== "") {
        const storageImgRef = ref(storage, curso.ImgUrl); // blogImageRefPath debe ser la referencia al archivo en Storage
        await deleteObject(storageImgRef);
      }

      if (curso.videos && curso.videos.length > 0) {
        await Promise.all(curso.videos.map((video) => this.deleteVideo(video)));
      }

      return true;
    } catch (error) {
      console.error("Error al eliminar el Curso:", error);
      return false;
    }
  }

  async getVideosCurso(id) {
    const q = query(
      collection(db, "videos"),
      where("CursoID", "==", id),
    );

    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return docs.sort((a, b) => (a.orden ?? 9999) - (b.orden ?? 9999));
  }

  async getVideo(id) {
    const docRefVideo = doc(db, "videos", id);
    const docSnapVideo = await getDoc(docRefVideo);

    if (!docSnapVideo.exists()) throw "Error";

    return docSnapVideo.data();
  }

  async createVideoCurso(uid, VideoData) {
    try {
      const blogRef = doc(db, "videos", uid);
      await setDoc(blogRef, VideoData);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateVideo(videoId, videoData) {
    try {
      const blogRef = doc(db, "videos", videoId);
      await updateDoc(blogRef, videoData);
      return true;
    } catch (error) {
      console.error("Error updating blog: ", error);
      return false;
    }
  }

  async deleteVideo(video) {
    try {
      // Eliminar el documento del blog de la colección "blogs"
      const cursoRef = doc(db, "videos", video.id);
      await deleteDoc(cursoRef);

      // Eliminar la información de la imagen (u otro archivo) relacionada con el blog en Storage
      if (video.ImgUrl) {
        const storageImgRef = ref(storage, video.ImgUrl); // blogImageRefPath debe ser la referencia al archivo en Storage
        await deleteObject(storageImgRef);
      }

      return true;
    } catch (error) {
      console.error("Error al eliminar el Video:", error);
      return false;
    }
  }

  async getCursosCliente(userID) {
    try {
      const docRef = doc(db, "cursosCliente", userID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }

      return { cursos: [] };
    } catch (error) {
      console.log(error)
      return { cursos: [] }
    }
  }

  async getCursoCli(id) {
    const docRef = doc(db, "cursosCliente", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return "Error";
    }
  }

  async activarCurso(userID, cursoData) {
    try {
      const blogRef = doc(db, "cursosCliente", userID);
      await updateDoc(blogRef, cursoData);
      return true;
    } catch (error) {
      console.error("Error updating blog: ", error);
      return false;
    }
  }

  async desactivarCurso(userID,cursoData){
    try {
      const blogRef = doc(db, "cursosCliente", userID);
      await updateDoc(blogRef, cursoData);
      return true;
    } catch (error) {
      console.error("Error updating blog: ", error);
      return false;
    }
  }

  async getTodosVideosCurso() {
    const q = query(collection(db, "videos"), where("tipo", "==", "curso"));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async getVideosSolitarios(isAdmin = false) {
    const q = isAdmin
      ? query(collection(db, "videos"), where("tipo", "==", "solitario"))
      : query(collection(db, "videos"), where("tipo", "==", "solitario"), where("publicado", "==", true));
    const snap = await getDocs(q);
    const docs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return docs.sort((a, b) => (b.Fecha?.seconds ?? 0) - (a.Fecha?.seconds ?? 0));
  }

  async getComments(videoId) {
    const q = query(
      collection(db, "videos", videoId, "comentarios"),
      orderBy("creadoEn", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async addComment(videoId, { texto, autorId, autorNombre }) {
    const ref = collection(db, "videos", videoId, "comentarios");
    await addDoc(ref, {
      texto,
      autorId,
      autorNombre,
      creadoEn: serverTimestamp(),
    });
  }

  async updateComment(videoId, commentId, texto) {
    const ref = doc(db, "videos", videoId, "comentarios", commentId);
    await updateDoc(ref, { texto, editado: true });
  }

  async deleteComment(videoId, commentId) {
    const respuestasRef = collection(db, "videos", videoId, "comentarios", commentId, "respuestas");
    const snap = await getDocs(respuestasRef);
    await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
    await deleteDoc(doc(db, "videos", videoId, "comentarios", commentId));
  }

  async addReply(videoId, commentId, { texto, autorId, autorNombre }) {
    const ref = collection(db, "videos", videoId, "comentarios", commentId, "respuestas");
    await addDoc(ref, {
      texto,
      autorId,
      autorNombre,
      creadoEn: serverTimestamp(),
    });
  }

  async getReplies(videoId, commentId) {
    const q = query(
      collection(db, "videos", videoId, "comentarios", commentId, "respuestas"),
      orderBy("creadoEn", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async updateReply(videoId, commentId, replyId, texto) {
    const ref = doc(db, "videos", videoId, "comentarios", commentId, "respuestas", replyId);
    await updateDoc(ref, { texto, editado: true });
  }

  async deleteReply(videoId, commentId, replyId) {
    const ref = doc(db, "videos", videoId, "comentarios", commentId, "respuestas", replyId);
    await deleteDoc(ref);
  }
}