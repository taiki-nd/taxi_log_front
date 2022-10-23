import { signOut } from '@firebase/auth';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../auth/firebase';
import { StandardButton } from '../components/parts/StandardButton';
import { BackColor } from '../styles/common/color';

export const Setting = (props: any) => {
  console.log("route", props.route);
  useEffect(() => {
    console.log('Home Mount');
    return () => {
      console.log('Home Unmount');
    };
  }, []);

  /**
   * funcSignout
   * サインアウト処理
   */
  const funcSignout = () => {
    signOut(auth).then(() => {
      console.log('signout')
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