import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { TransitionButton } from '../components/parts/TransitionButton';
import { BackColor } from '../styles/common/color';

export const HomeScreen = ({ navigation }: any) => {
  console.log("props", navigation)
  useEffect(() => {
    console.log('Home Mount');
    return () => {
      console.log('Home Unmount');
    };
  }, []);
  return (
    <View style={styles.background}>
      <Text>ホーム画面</Text>
      <TransitionButton display={"Signup"} navigation={navigation} screen={'Signup'}/>
      <TransitionButton display={"Signin"} navigation={navigation} screen={'Signin'}/>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: BackColor
  }
});