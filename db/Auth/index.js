import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { User } from "../User";

const userCtrl = new User();
export class Auth{
    async login(email, password){
        try {
            const userCredentials = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
      
            const user = userCredentials.user;

            const UserWebData = await userCtrl.getUser(user.uid)

            if(UserWebData === "No existe usuario"){
              let userData = {
                email 
              }
  
              await userCtrl.createUserWeb(user.uid,userData)
            }

            return user;
          } catch (error) {
            const errorMessage = error.message;
            // Handle Errors here.
            // console.error("Error code:", errorCode);
            // console.error("Error message:", errorMessage);
            return errorMessage
          }
    }
}