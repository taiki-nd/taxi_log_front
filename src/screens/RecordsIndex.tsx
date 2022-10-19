import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TransitionButton } from '../components/parts/TransitionButton';
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
      <TransitionButton display={"Edit"} navigation={props.navigation} postInfo={{recordId: 1}} screen={'RecordsUpdate'}/>
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