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

export const Signin = (props: any) => {
  // props
  const { navigation } = props;

  // state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    // signin処理
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        console.log(uid);
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.error('firebase error message:', firebaseErrorTransition(error));
          setErrorMessage(firebaseErrorTransition(error));
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
              <StandardTextInput placeholder="abc@abc.com" keyboardType="email-address" secureTextEntry={false} onChangeText={(text: string) => setEmail(text)}/>
              <StandardTextInput placeholder="Enter password" keyboardType="default" secureTextEntry={true} onChangeText={(text: string) => setPassword(text)}/>
              {errorMessage != '' ? (
                <Text style={styles.errorTextStyle}>
                  {errorMessage}
                </Text>
              ) : null}
              <StandardButton displayText={"SIGNIN"} onPress={funcSignin}/>
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