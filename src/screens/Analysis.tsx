import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BackColor } from '../styles/common/color';

export const Analysis = (props: any) => {
  console.log("route", props.route);
  useEffect(() => {
    console.log('Home Mount');
    return () => {
      console.log('Home Unmount');
    };
  }, []);
  return (
    <View style={styles.background}>
      <Text>分析</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: BackColor
  }
});