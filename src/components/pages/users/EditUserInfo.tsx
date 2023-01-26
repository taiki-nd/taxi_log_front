import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableWithoutFeedback, Image, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BackColor, TomatoColor } from '../../../styles/common/color';
import { StandardButton } from '../../parts/StandardButton';
import { StandardTextInput } from '../../parts/StandardTextInput';
import { StandardTextLink } from '../../parts/StandardTextLink';
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from '../../../auth/firebase';
import { errorCodeTransition, firebaseErrorTransition } from '../../../utils/const';

export const EditUser = (props: any) => {
  // props
  const { navigation } = props;

  // state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorEmailMessages, setErrorEmailMessages] = useState<string[]>([]);
  const [errorPasswordMessages, setErrorPasswordMessages] = useState<string[]>([]);
  const [EmailButtonDisabled, setEmailButtonDisabled] = useState(true);
  const [PasswordButtonDisabled, setPasswordButtonDisabled] = useState(true);

  // 必須項目チェックによるボタン活性化処理
  useEffect(() => {
    var pattern = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;
    if (email !== '') {
      if (pattern.test(email)) {
        setErrorEmailMessages(errorCodeTransition([]))
        setEmailButtonDisabled(false);
      } else {
        setErrorEmailMessages(errorCodeTransition(['invalid_email']))
        setEmailButtonDisabled(true);
      }
    } else {
      setEmailButtonDisabled(true);
    }
  }, [email]);

  useEffect(() => {
    if (password !== '' && newPassword !== '' && confirmNewPassword !== '') {
      if (newPassword === confirmNewPassword) {
        setErrorPasswordMessages(errorCodeTransition([]))
        setPasswordButtonDisabled(false);
      } else {
        setPasswordButtonDisabled(true);
        setErrorPasswordMessages(errorCodeTransition(['password_not_match']))
      }
    } else {
      setPasswordButtonDisabled(true);
    }
  }, [password, newPassword, confirmNewPassword]);

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
              {errorEmailMessages.length != 0 ? (
                errorEmailMessages.map((errorMessage: string, index: number) => { 
                  return(
                    <Text style={styles.errorTextStyle} key={index}>
                      {errorMessage}
                    </Text>
                  )})
              ) : null}
              <StandardButton displayText={'メースアドレス変更'} disabled={EmailButtonDisabled} onPress={moveScreen}/>
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
              <StandardButton displayText={'パスワード変更'} disabled={PasswordButtonDisabled} onPress={moveScreen}/>
              <StandardTextLink displayText="cancel" onPress={() => moveScreen("Setting")}/>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </View>
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