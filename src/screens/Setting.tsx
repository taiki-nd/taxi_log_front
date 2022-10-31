import { signOut } from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../auth/firebase';
import { StandardButton } from '../components/parts/StandardButton';
import { BackColor } from '../styles/common/color';
import { FuncSignout } from '../utils/commonFunc/user/Signout';

export const Setting = (props: any) => {
  /**
   * funcSignout
   * サインアウト処理
   */
  const funcSignout = () => {
    FuncSignout(props);
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