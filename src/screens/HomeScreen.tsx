import { onAuthStateChanged } from '@firebase/auth';
import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../auth/firebase';
import { TransitionButton } from '../components/parts/TransitionButton';
import { BackColor } from '../styles/common/color';

export const HomeScreen = (props: any) => {
  // props
  const { navigation } = props
  
  // signin状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (!user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Signin' }]
        });
      }
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.background}>
      <Text>ホーム画面</Text>
      <TransitionButton display={"Signup"} navigation={navigation} screen={'Signup'}/>
      <TransitionButton display={"Signin"} navigation={navigation} screen={'Signin'}/>
      <TransitionButton display={"Signup2"} navigation={navigation} screen={'Signup2'}/>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: BackColor
  }
});