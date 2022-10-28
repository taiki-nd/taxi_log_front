import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableWithoutFeedback, Image, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {  BackColor } from '../../../styles/common/color';
import { StandardButton } from '../../parts/StandardButton';
import { StandardTextInput } from '../../parts/StandardTextInput';
import { StandardTextLink } from '../../parts/StandardTextLink';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from '../../../auth/firebase';
import { firebaseErrorTransition } from '../../../utils/const';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        AsyncStorage.setItem("uid", user.uid);
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
      .then((userCredential) => {
        // ボタンの活性化
        setButtonDisabled(true);
        const user = userCredential.user;
        const uid = user.uid;
        AsyncStorage.setItem("uid", uid);
        console.log(uid);
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.log('error', error.code);
        console.error('firebase error message:', firebaseErrorTransition(error));
        setErrorMessages(firebaseErrorTransition(error));
        // ボタンの活性化
        setButtonDisabled(true);
      });
  }, [email, password]);

  /**
   * moveScreen
   * @param screen 
   */
  const moveScreen = (screen: any) => {
    props.navigation.navigate(screen)
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
                errorMessages.map((errorMessage: string) => { 
                  return(
                    <Text style={styles.errorTextStyle}>
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