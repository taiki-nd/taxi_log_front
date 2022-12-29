import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text } from "react-native-paper";
import { BarChart } from 'react-native-chart-kit';
import { BackColor, BasicColor, TomatoColor } from '../styles/common/color';
import axios from 'axios';
import { auth } from '../auth/firebase';
import { errorCodeTransition, method } from '../utils/const';
import { Dropdown } from '../components/parts/Dropdown';
import { StandardSpace } from '../components/parts/Space';
import { SmallButton } from '../components/parts/SmallButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetSigninUser } from '../utils/commonFunc/user/GetSigninUser';

export const Analysis = (props: any) => {
  // props
  const { navigation, route } = props;

  //state
  const [uid, setUid] = useState('');
  const [id, setId] = useState('');

  const [startYear, setStartYear] = useState(0);
  const [startMonth, setStartMonth] = useState(0);
  const [finishYear, setFinishYear] = useState(0);
  const [finishMonth, setFinishMonth] = useState(0);

  const [averageSales, setAverageSales] = useState<number[]>([0, 0, 0]);
  const [averageOccupancyRate, setAverageOccupancyRate] = useState<number[]>([0, 0, 0]);
  const [dayLabel, setDayLabel] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);

  const [dialogTitle, setDialogTitle] = useState('');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [messageForAverageSales, setMessageForAverageSales] = useState<string[]>([]);
  const [messageForAverageOccupancyRate, setMessageForAverageOccupancyRate] = useState<string[]>([]);

  const [openStartYear, setOpenStartYear] = useState(false);
  const [openStartMonth, setOpenStartMonth] = useState(false);
  const [openFinishYear, setOpenFinishYear] = useState(false);
  const [openFinishMonth, setOpenFinishMonth] = useState(false);
  const [itemsYear, setItemsYear] = useState<any[]>([]);
  const [itemsMonth, setItemsMonth] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      // sigin状況の確認
      const id = await AsyncStorage.getItem("taxi_log_user_id")
      console.log("id 解析画面初期起動", id)
      if (id === null) {
        const status = await GetSigninUser();
        if (status === false) {
          navigation.navigate("Signin");
        }
      } else {
        setId(id);
      }
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

      // ドロップダウンデータの取得
      var today = new Date();
      setStartYear(today.getFullYear()-1);
      setStartMonth(today.getMonth()+1);
      setFinishYear(today.getFullYear());
      setFinishMonth(today.getMonth()+1);
      console.log(today.getMonth()+1)

      var itemsYear: any[] = [];
      for (var i = 0; i < 10; i++) {
        itemsYear.push({label: `${today.getFullYear()+1-i}`, value: today.getFullYear()+1-i})
      }
      setItemsYear(itemsYear);

      var itemsMonth: any[] = [];
      for (var i = 0; i < 12; i++) {
        itemsMonth.push({label: `${i+1}`, value: i+1})
      }
      setItemsMonth(itemsMonth);

      // 解析データの取得
      getAnalysisData(id, 'first');
    })()
  }, []);

  /**
   * getAnalysisData
   * 解析データの取得
   */
  const getAnalysisData = (id: any, status: string) => {
    // headers
    const headers = {'id': id}

    // params
    var params: any = {}
    if (status === 'first'){
      var today = new Date();
      params ={
        'id': id,
        'start_year': today.getFullYear()-1,
        'start_month': today.getMonth()+1,
        'finish_year': today.getFullYear(),
        'finish_month': today.getMonth()+1
      }
    } else if (status === 'second') {
      params = {
        'id': id,
        'start_year': startYear,
        'start_month': startMonth,
        'finish_year': finishYear,
        'finish_month': finishMonth
      }
    }

    console.log('params', params)

    axios({
      method: method.GET,
      url: '/analysis/analysis',
      headers: headers,
      data: null,
      params: params,
    }).then((response) => {
      console.log(response.data)
      if (response.data.average_sales_per_day.length === 0) {
        setMessageForAverageSales(['表示するデータがありません']);
      } else {
        setAverageSales(response.data.average_sales_per_day)
      }
      if (response.data.average_occupancy_rate_per_day.length === 0) {
        setMessageForAverageOccupancyRate(['表示するデータがありません']);
      } else {
        setAverageOccupancyRate(response.data.average_occupancy_rate_per_day)
      }
    }).catch(error => {
      var errorCode = error.response.data.info.code;
      var message: string[] = [];
      message = errorCodeTransition(errorCode);
      setErrorMessages(message);
      setDialogTitle('解析データの取得失敗')
      //setVisibleFailedDialog(true);
    });
  }

  return (
    <View style={styles.mainBody}>
      <View style={styles.flex}>
        <Dropdown
          placeholder='年'
          width='24%'
          open={openStartYear}
          value={startYear}
          items={itemsYear}
          setOpen={setOpenStartYear}
          setValue={setStartYear}
          setItems={setItemsYear}
        />
        <Dropdown
          placeholder='月'
          width='18%'
          open={openStartMonth}
          value={startMonth}
          items={itemsMonth}
          setOpen={setOpenStartMonth}
          setValue={setStartMonth}
          setItems={setItemsMonth}
        />
        <Dropdown
          placeholder='年'
          width='24%'
          open={openFinishYear}
          value={finishYear}
          items={itemsYear}
          setOpen={setOpenFinishYear}
          setValue={setFinishYear}
          setItems={setItemsYear}
        />
        <Dropdown
          placeholder='月'
          width='18%'
          open={openFinishMonth}
          value={startMonth}
          items={itemsMonth}
          setOpen={setOpenFinishMonth}
          setValue={setStartMonth}
          setItems={setItemsMonth}
        />
      </View>
      <ScrollView>
        <StandardSpace />
        <View style={styles.flex}>
          <SmallButton
            displayText='Start Analysis'
            disabled={false}
            onPress={() => getAnalysisData(id, 'second')}
          />
        </View>
        <StandardSpace />

        <Text variant="titleMedium" style={styles.subTitle}>曜日別平均売上</Text>
        {
          messageForAverageSales.length !== 0 ? (
            messageForAverageSales.map((message: string, index: number) => { 
              return(
                <View style={styles.messageStyle} key={index}>
                  <Text style={styles.messageTextStyle}>{message}</Text>
                </View>
              )
            })
          ) : (
            <BarChart
              data={{
                  labels: dayLabel,
                  datasets: [{
                      data: averageSales
                  }]
              }}
              width={Dimensions.get("window").width * 0.95} // from react-native
              height={220}
              fromZero={true}
              yAxisLabel='¥'
              yAxisSuffix=''
              chartConfig={{
                backgroundColor: BackColor,
                backgroundGradientFrom: BackColor,
                backgroundGradientTo: BackColor,
                decimalPlaces: 0,
                color: (opacity = 0.5) => `rgba(63, 62, 52, ${opacity})`,
                barPercentage: 0.2
              }}
              style={{
                marginVertical: 8,
              }}
            />
          )
        }
        <StandardSpace />

        <Text variant="titleMedium" style={styles.subTitle}>曜日別平均実車率</Text>
        {
          messageForAverageOccupancyRate.length !== 0 ? (
            messageForAverageOccupancyRate.map((message: string, index: number) => { 
              return(
                <View style={styles.messageStyle} key={index}>
                  <Text style={styles.messageTextStyle}>{message}</Text>
                </View>
              )
            })
          ) : (
            <BarChart
              data={{
                  labels: dayLabel,
                  datasets: [{
                      data: averageOccupancyRate
                  }]
              }}
              width={Dimensions.get("window").width * 0.95} // from react-native
              height={220}
              fromZero={true}
              yAxisLabel=''
              yAxisSuffix='%'
              chartConfig={{
                backgroundColor: BackColor,
                backgroundGradientFrom: BackColor,
                backgroundGradientTo: BackColor,
                decimalPlaces: 0,
                color: (opacity = 0.5) => `rgba(63, 62, 52, ${opacity})`,
                barPercentage: 0.2
              }}
              style={{
                marginVertical: 8,
              }}
            />
          )
        }
        <StandardSpace />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    padding: '3%',
    flex: 1,
    backgroundColor: BackColor,
    alignContent: 'center',
  },
  subTitle: {
    color: BasicColor,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  messageStyle: {
    height: 220,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageTextStyle: {
    color: TomatoColor,
    fontSize: 14,
  }
});