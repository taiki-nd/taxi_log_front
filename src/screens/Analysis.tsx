import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from "react-native-paper";
import { LineChart } from 'react-native-chart-kit';
import { AccentColor, BackColor, BasicColor } from '../styles/common/color';
import axios from 'axios';
import { auth } from '../auth/firebase';
import { errorCodeTransition, method } from '../utils/const';
import { DateTransition } from '../utils/commonFunc/record/DateTranstion';

export const Analysis = (props: any) => {
  // props
  const { navigation, route } = props;

  //state
  const [uid, setUid] = useState('')
  const [monthlySalesSumData, setMonthlySalesSumData] = useState<number[]>([0, 0, 0]);
  const [monthlySalesSumLabels, setMonthlySalesSumLabels] = useState<string[]>(['1', '2', '3']);

  const [dialogTitle, setDialogTitle] = useState('');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  console.log(monthlySalesSumData, monthlySalesSumLabels)
  useEffect(() => {
    var currentUser = auth.currentUser
    if (currentUser) {
      setUid(currentUser.uid);
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Signin' }]
      });
      return
    }
    getMonthlySalesSum(currentUser.uid);
  }, []);

  /**
   * getMonthlySalesSum
   * 月次総売上データの取得
   */
  const getMonthlySalesSum = (uid: string) => {
    // headers
    const headers = {'uuid': uid}

    // params
    var today = new Date();
    const params ={
      'year': today.getFullYear(),
      'month': today.getMonth()+1
    }

    axios({
      method: method.GET,
      url: '/analysis/sales_sum',
      headers: headers,
      data: null,
      params: params,
    }).then((response) => {
      console.log("data", response.data);
      // labelsの成形
      var displayLabels: string[] = [];
      response.data.labels.forEach((label: string) => {
        var date = new Date(label);
        const dateOnlyDate = String(date.getDate());
        displayLabels.push(dateOnlyDate);
      })
      setMonthlySalesSumLabels(displayLabels)
      // データの取得
      setMonthlySalesSumData(response.data.data)
    }).catch(error => {
      var errorCode = error.response.data.info.code;
      var message: string[] = [];
      message = errorCodeTransition(errorCode);
      setErrorMessages(message);
      setDialogTitle('月次総売上のデータ取得の失敗')
      //setVisibleFailedDialog(true);
    });
  }

  return (
    <View style={styles.mainBody}>
      <View>
        <Text variant="titleMedium" style={styles.subTitle}>月次総売上</Text>
        <LineChart
          data={{
              labels: monthlySalesSumLabels,
              datasets: [{
                  data: monthlySalesSumData
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