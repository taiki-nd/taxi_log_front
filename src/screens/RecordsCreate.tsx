import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BackColor } from '../styles/common/color';

export const RecordsCreate = (props: any) => {
  useEffect(() => {
    console.log('Home Mount');
    return () => {
      console.log('Home Unmount');
    };
  }, []);
  return (
    <View style={styles.background}>
      <Text>レコード作成</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: BackColor
  }
});