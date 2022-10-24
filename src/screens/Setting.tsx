import { signOut } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../auth/firebase';
import { StandardButton } from '../components/parts/StandardButton';
import { BackColor } from '../styles/common/color';

export const Setting = (props: any) => {
  // props
  const { navigation } = props;

  /**
   * funcSignout
   * サインアウト処理
   */
  const funcSignout = () => {
    signOut(auth).then(() => {
      console.log('signout')
      AsyncStorage.removeItem("uid")
      navigation.reset({
        index: 0,
        routes: [{ name: 'Signin' }]
      });
    }).catch((error: any) => {
      console.error('firebase error message:', error.code, error.message);
    });
  }
  return (
    <View style={styles.mainBody}>
      <StandardButton displayText={"SIGNOUT"} onPress={funcSignout}/>
    </View>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: BackColor,
    alignContent: 'center',
  },
});