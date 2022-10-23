import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableWithoutFeedback, Image, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BackColor } from '../../../styles/common/color';
import { StandardButton } from '../../parts/StandardButton';
import { StandardTextInput } from '../../parts/StandardTextInput';
import { StandardTextLink } from '../../parts/StandardTextLink';
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from '../../../auth/firebase';
import { errorCode, firebaseErrorTransition } from '../../../utils/const';

export const Signup = (props: any) => {
  // props
  const { navigation } = props;

  // state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // signin状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
    });
    return unsubscribe;
  }, []);

  /**
   * Signup処理
   */
  const funcSignup = useCallback(async (e: SyntheticEvent) => {
    e.preventDefault();
    // passwordの確認
    if (password !== confirmPassword) {
      console.error("password not match");
      setErrorMessage(errorCode.passwordNotMatch);
    } else {
      // firebaseへのuser登録
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const uid = user.uid;
          console.log("uid", uid);
          // navigation.navigate("遷移先")
        })
        .catch((error) => {
          console.error('firebase error message:', firebaseErrorTransition(error));
          setErrorMessage(firebaseErrorTransition(error));
        });
    }
  }, [email, password, confirmPassword]);

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
              <StandardTextInput placeholder="Confirm password" keyboardType="default" secureTextEntry={true} onChangeText={(text: string) => setConfirmPassword(text)}/>
              {errorMessage != '' ? (
                <Text style={styles.errorTextStyle}>
                  {errorMessage}
                </Text>
              ) : null}
              <StandardButton displayText={'SIGNUP'} onPress={funcSignup}/>
              <StandardTextLink displayText="Signin here" onPress={() => moveScreen("Signin")}/>
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