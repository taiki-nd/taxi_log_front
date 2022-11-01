import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableWithoutFeedback, Image, Keyboard, StatusBar } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {  BackColor } from '../../../styles/common/color';
import { StandardButton } from '../../parts/StandardButton';
import { StandardTextInput } from '../../parts/StandardTextInput';
import { StandardTextLink } from '../../parts/StandardTextLink';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from '../../../auth/firebase';
import { firebaseErrorTransition, method } from '../../../utils/const';
import axios from 'axios';

export const Signin = (props: any) => {
  // props
  const { navigation } = props;

  // state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // 必須項目チェックによるボタン活性化処理
  useEffect(() => {
    if (email !== '' && password !== '') {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [email, password]);

  // signin状態の監視
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

  /**
   * Signin処理
   */
  const funcSignin = useCallback(async (e: SyntheticEvent) => {
    e.preventDefault();

    // ボタンの非活性化
    setButtonDisabled(true);

    // signin処理
    signInWithEmailAndPassword(auth, email, password)
      .then( async (userCredential) => {
        // ボタンの活性化
        setButtonDisabled(true);
        const user = userCredential.user;
        const uid = user.uid;
        console.log(uid);
        console.log("メール認証開始/メール認証ステータス", user.emailVerified)
        if (!user.emailVerified) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignupEmail' }]
          });
          return;
        }
        // userの登録情報の確認
        var status: boolean;
        status = await isUserRegistered(uid)
        console.log('status', status);
        if (status) {
          moveScreen('Home');
          return;
        }
        moveScreen('Signup2')
      })
      .catch((error) => {
        console.error('firebase error message:', firebaseErrorTransition(error));
        setErrorMessages(firebaseErrorTransition(error));
        // ボタンの活性化
        setButtonDisabled(true);
      });
  }, [email, password]);

  /**
   * isUserRegistered
   * DBにユーザー登録されているか確認
   */
  const isUserRegistered = async (uid: string): Promise<boolean> => {
    var status = false
    console.log('check isUserRegistered')
    // headers
    const headers = {'uuid': uid}
    await axios({
      method: method.GET,
      url: 'user/get_user_form_uid',
      headers: headers,
      data: null,
      params: null,
    }).then((response) => {
      console.log("data", response.data);
      status = true;
    }).catch(error => {
      console.log("error", error);
      status = false;
    });
    return status
  }

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
              <View style={{alignItems: 'center'}}>
                <Image source={require('../../../assets/logo.png')} style={styles.logo}></Image>
              </View>
              <StandardTextInput label="Email" placeholder="abc@abc.com" keyboardType="email-address" secureTextEntry={false} onChangeText={(text: string) => setEmail(text)}/>
              <StandardTextInput label="Password" placeholder="Enter password" keyboardType="default" secureTextEntry={true} onChangeText={(text: string) => setPassword(text)}/>
              {errorMessages.length != 0 ? (
                errorMessages.map((errorMessage: string, index: number) => { 
                  return(
                    <Text style={styles.errorTextStyle} key={index}>
                      {errorMessage}
                    </Text>
                  )})
              ) : null}
              <StandardButton displayText={"SIGNIN"} disabled={buttonDisabled} onPress={funcSignin}/>
              <StandardTextLink displayText="Signup here" onPress={() => moveScreen("Signup")}/>
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
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});