import React, { SyntheticEvent, useCallback, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Image, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BackColor } from '../../../styles/common/color';
import { StandardButton } from '../../parts/StandardButton';
import { StandardTextInput } from '../../parts/StandardTextInput';
import { StandardTextLink } from '../../parts/StandardTextLink';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../auth/firebase';

export const Signup = (props: any) => {
  // state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /**
   * Signup処理
   */
  const funcSignup = useCallback(async (e: SyntheticEvent) => {
    e.preventDefault();
    console.log("signup start")
    // passwordの確認
    if (password !== confirmPassword) {
      console.log("password not match");
    } else {
      // firebaseへのuser登録
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const uid = user.uid;
          console.log("uid", uid);
        })
        .catch((error) => {
          console.error('firebase error code:', error.code);
          console.error('firebase error message:', error.message);
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
              {/* Google */}
              <StandardTextInput placeholder="abc@abc.com" keyboardType="email-address" secureTextEntry={false} onChangeText={(text: string) => setEmail(text)}/>
              <StandardTextInput placeholder="Enter password" keyboardType="default" secureTextEntry={true} onChangeText={(text: string) => setPassword(text)}/>
              <StandardTextInput placeholder="Confirm password" keyboardType="default" secureTextEntry={true} onChangeText={(text: string) => setConfirmPassword(text)}/>
              {/*errortext != '' ? (
                <Text style={styles.errorTextStyle}>
                  {errortext}
                </Text>
              ) : null*/}
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