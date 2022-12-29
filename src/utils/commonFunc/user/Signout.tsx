import { signOut } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../../auth/firebase';

export const FuncSignout = (props: any) => {
  const { navigation } = props;
  signOut(auth).then(() => {
    console.log('signout')
    AsyncStorage.removeItem('taxi_log_user_id')
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