import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableWithoutFeedback, Image, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BackColor, TomatoColor } from '../../../styles/common/color';
import { StandardButton } from '../../parts/StandardButton';
import { StandardTextInput } from '../../parts/StandardTextInput';
import { StandardTextLink } from '../../parts/StandardTextLink';
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from '../../../auth/firebase';
import { errorCodeTransition, firebaseErrorTransition } from '../../../utils/const';
import { DialogOneButton } from '../../parts/DialogOneButton';

export const EditUser = (props: any) => {
  // props
  const { navigation } = props;

  // state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorPasswordMessages, setErrorPasswordMessages] = useState<string[]>([]);
  const [PasswordButtonDisabled, setPasswordButtonDisabled] = useState(true);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [visibleDialog, setVisibleDialog] = useState(false);

  // 必須項目チェックによるボタン活性化処理
  useEffect(() => {
    var pattern = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;
    var errArray: string[] = []
    if (email !== '') {
      if (pattern.test(email)) {
        var index = errArray.indexOf('invalid_email');
        errArray.splice(index, 1);
        setErrorPasswordMessages(errorCodeTransition([]))
        if (password !== '') {
          setPasswordButtonDisabled(false);
        } else {
          setPasswordButtonDisabled(true);
        }
      } else {
        errArray.push('invalid_email')
        setErrorPasswordMessages(errorCodeTransition(errArray))
        setPasswordButtonDisabled(true);
      }
    }

    if (newPassword !== '' && confirmNewPassword !== '') {
      if (newPassword !== confirmNewPassword) {
        setPasswordButtonDisabled(true);
        errArray.push('password_not_match')
        setErrorPasswordMessages(errorCodeTransition(errArray))
      } else {
        var index = errArray.indexOf('password_not_match');
        errArray.splice(index, 1);
        setPasswordButtonDisabled(false);
      }
    }

    if (password !== '') {
      setPasswordButtonDisabled(true);
    }
  }, [email, password, newPassword, confirmNewPassword]);

  /*
   * changeEmail
   */
  const changeEmail = () => {
    const user = auth.currentUser;
    if (user?.email) {
      const credential = EmailAuthProvider.credential(user.email, password);
      reauthenticateWithCredential(user, credential).then(() => {
        if (user !== null){
          updateEmail(user, email).then(() => {
            // Email updated
            setDialogTitle('メールアドレスの更新が完了しました');
            setDialogMessage(`[${email}]に更新されました`);
          }).catch((error) => {
            console.error('firebase error message:', firebaseErrorTransition(error));
              setErrorPasswordMessages(firebaseErrorTransition(error));
              // ボタンの活性化
              setPasswordButtonDisabled(false);
          });
        }
      });
    }
  }

  // signin状態の監視
  /*
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }]
        });
      }
    });
    return unsubscribe;
  }, []);
  */

  /**
   * Signup処理
   */
  /*
  const funcSignup = useCallback(async (e: SyntheticEvent) => {
    e.preventDefault();

    // ボタンの非活性化
    setButtonDisabled(true);

    // passwordの確認
    if (password !== confirmPassword) {
      console.error("password not match");
      var errorCode: string[] = [];
      errorCode.push('password_not_match')
      setErrorMessages(errorCodeTransition(errorCode));
    } else {
      // firebaseへのuser登録
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // ボタンの活性化
          setButtonDisabled(true);
          const user = userCredential.user;
          const uid = user.uid;
          console.log("uid", uid);
          // メール認証画面への遷移
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignupEmail' }]
          });
        })
        .catch((error) => {
          console.error('firebase error message:', firebaseErrorTransition(error));
          setErrorMessages(firebaseErrorTransition(error));
          // ボタンの活性化
          setButtonDisabled(false);
        });
    }
  }, [email, password, confirmPassword]);
*/
  /**
   * moveScreen
   * @param screen 
   */
  const moveScreen = (screen: any) => {
    navigation.reset({
      index: 0,
      routes: [{ name: screen }]
    });
  }

  return (
    <View style={styles.mainBody}>
      <View>
        <KeyboardAwareScrollView>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
              <StandardTextInput label="新しいメースアドレス" placeholder="abc@abc.com" keyboardType="email-address" secureTextEntry={false} onChangeText={(text: string) => setEmail(text)}/>
              <StandardTextInput label="現在のパスワード" placeholder="password" keyboardType="default" secureTextEntry={true} onChangeText={(text: string) => setPassword(text)}/>
              <StandardTextInput label="新しいパスワード" placeholder="new password" keyboardType="default" secureTextEntry={true} onChangeText={(text: string) => setNewPassword(text)}/>
              <StandardTextInput label="新しいパスワード確認用" placeholder="confirm new password" keyboardType="default" secureTextEntry={true} onChangeText={(text: string) => setConfirmNewPassword(text)}/>
              {errorPasswordMessages.length != 0 ? (
                errorPasswordMessages.map((errorMessage: string, index: number) => { 
                  return(
                    <Text style={styles.errorTextStyle} key={index}>
                      {errorMessage}
                    </Text>
                  )})
              ) : null}
              <StandardButton displayText={'更新'} disabled={PasswordButtonDisabled} onPress={moveScreen}/>
              <StandardTextLink displayText="cancel" onPress={() => moveScreen("Setting")}/>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </View>
      <DialogOneButton
        title={dialogTitle}
        description={dialogMessage}
        displayButton1="OK"
        visible={visibleDialog}
        funcButton1={() => setVisibleDialog(false)}
        onDismiss={() => setVisibleDialog(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: BackColor,
    alignContent: 'center',
  },
  logo: {
    resizeMode: 'contain',
    width: 300,
    height: 200,
  },
  errorTextStyle: {
    color: TomatoColor,
    textAlign: 'center',
    fontSize: 14,
  },
});