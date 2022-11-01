import { signOut } from '@firebase/auth';
import { auth } from '../../../auth/firebase';

export const FuncSignout = (props: any) => {
  const { navigation } = props;
  signOut(auth).then(() => {
    console.log('signout')
    navigation.reset({
      index: 0,
      routes: [{ name: 'Signin' }]
    });
    return true;
  }).catch((error: any) => {
    console.error('firebase error message:', error.code, error.message);
    return false;
  });
}