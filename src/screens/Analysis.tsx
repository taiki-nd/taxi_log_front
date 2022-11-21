import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from "react-native-paper";
import { LineChart } from 'react-native-chart-kit';
import { AccentColor, BackColor, BasicColor } from '../styles/common/color';

export const Analysis = (props: any) => {
  console.log("route", props.route);
  useEffect(() => {
    console.log('Home Mount');
    return () => {
      console.log('Home Unmount');
    };
  }, []);
  return (
    <View style={styles.mainBody}>
      <View>
        <Text variant="titleMedium" style={styles.subTitle}>月次総売上</Text>
        <LineChart
          data={{
              labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
              datasets: [{
                  data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100
                  ]
              }]
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisLabel='¥'
          chartConfig={{
              backgroundColor: BackColor,
              backgroundGradientFrom: BackColor,
              backgroundGradientTo: BackColor,
              color: (opacity = 0.5) => `rgba(63, 62, 52, ${opacity})`,
              propsForDots: {
                r: "2",
                strokeWidth: "2",
                stroke: BasicColor
              }
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    padding: 10,
    flex: 1,
    backgroundColor: BackColor,
    alignContent: 'center',
  },
  subTitle: {
    color: BasicColor,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});