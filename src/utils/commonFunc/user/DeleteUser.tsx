import { auth } from "../../../auth/firebase";
import { deleteUser } from "firebase/auth";

export const FuncDeleteUser = () => {
  const user = auth.currentUser;
  if (user !== null) {
    deleteUser(user)
    .then(() => {
      console.log('Successfully deleted user');
    })
    .catch((error: any) => {
      console.log('Error deleting user:', error);
    });
  }
}