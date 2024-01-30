import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
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

  async getCursos() {
    const q = query(
      collection(db, "cursos")
    );
    const dataSnapshot = await getDocs(q);
    const newData = dataSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return newData;
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
        curso.videos.map(async (video) => {
          await this.deleteVideo(video);
        });
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
    const blogData = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    return blogData;
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

      if(!docSnap.exists()){
        let cursoData = {
          cursos:[]
        };
        const blogRef = doc(db, "cursosCliente", userID);
        await setDoc(blogRef, cursoData);

        return cursoData
      }
    } catch (error) {
      console.log(error)
      return "Error"
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
}