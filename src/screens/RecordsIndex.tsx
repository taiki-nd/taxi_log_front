import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AccentColor, BackColor, BasicColor } from '../styles/common/color';

export const RecordsIndex = (props: any) => {
  console.log("route", props.route);
  useEffect(() => {
    console.log('Home Mount');
    return () => {
      console.log('Home Unmount');
    };
  }, []);
  return (
    <View style={styles.background}>
      <Text>レコード一覧</Text>
      <Text
        onPress={() => props.navigation.navigate('RecordsUpdate', {userId: 1})}
        style={styles.button_standard}
      >
        Edit
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: BackColor
  },

  button_standard: {
    alignSelf: "center",
    backgroundColor: BasicColor,
    color: AccentColor,
    padding: 5,
  }
});