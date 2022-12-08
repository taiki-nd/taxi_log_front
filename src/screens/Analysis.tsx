import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text } from "react-native-paper";
import { BarChart, LineChart } from 'react-native-chart-kit';
import { AccentColor, BackColor, BasicColor, TomatoColor } from '../styles/common/color';
import axios from 'axios';
import { auth } from '../auth/firebase';
import { errorCodeTransition, method } from '../utils/const';
import DropDownPicker from 'react-native-dropdown-picker';
import { Dropdown } from '../components/parts/Dropdown';
import { StandardSpace } from '../components/parts/Space';
import { SmallButtonCustom } from '../components/parts/SmallButtonCustom';
import { SmallButton } from '../components/parts/SmallButton';

export const Analysis = (props: any) => {
  // props
  const { navigation, route } = props;

  //state
  const [uid, setUid] = useState('')

  const [startYear, setStartYear] = useState(0)
  const [startMonth, setStartMonth] = useState(0)
  const [finishYear, setFinishYear] = useState(0)
  const [finishMonth, setFinishMonth] = useState(0)

  const [averageSales, setAverageSales] = useState<number[]>([0, 0, 0])
  const [monthlySalesSumMonth, setMonthlySalesSumMonth] = useState(0)
  const [monthlySalesSumData, setMonthlySalesSumData] = useState<number[]>([0, 0, 0]);
  const [monthlySalesSumLabels, setMonthlySalesSumLabels] = useState<string[]>(['1', '2', '3']);

  const [monthlySalesYear, setMonthlySalesYear] = useState(0)
  const [monthlySalesMonth, setMonthlySalesMonth] = useState(0)
  const [monthlySalesData, setMonthlySalesData] = useState<number[]>([0, 0, 0]);
  const [monthlySalesLabels, setMonthlySalesLabels] = useState<string[]>(['1', '2', '3']);

  const [dialogTitle, setDialogTitle] = useState('');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [messageForMonthlySalesSum, setMessageForMonthlySalesSum] = useState<string[]>([]);
  const [messageForMonthlySales, setMessageForMonthlySales] = useState<string[]>([]);

  const [openStartYear, setOpenStartYear] = useState(false);
  const [openStartMonth, setOpenStartMonth] = useState(false);
  const [openFinishYear, setOpenFinishYear] = useState(false);
  const [openFinishMonth, setOpenFinishMonth] = useState(false);
  const [itemsYear, setItemsYear] = useState<any[]>([]);
  const [itemsMonth, setItemsMonth] = useState<any[]>([]);

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

    getAnalysisData(currentUser.uid, 'first');
  }, []);

  /**
   * getMonthlySalesSum
   * 月次総売上データの取得
   */
  const getAnalysisData = (uid: string, status: string) => {
    // headers
    const headers = {'uuid': uid}

    // params
    var params: any = {}
    if (status === 'first'){
      var today = new Date();
      params ={
        'start_year': today.getFullYear()-1,
        'start_month': today.getMonth()+1,
        'finish_year': today.getFullYear(),
        'finish_month': today.getMonth()+1
      }
    } else if (status === 'second') {
      params ={
        'start_year': startYear,
        'start_month': startMonth,
        'finish_year': finishYear,
        'finish_month': finishMonth
      }
    }

    axios({
      method: method.GET,
      url: '/analysis/analysis',
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
      // データがからの場合の処理
      if (displayLabels.length === 0) {
        setMessageForMonthlySalesSum(['表示するデータがありません']);
        return;
      }
      setMessageForMonthlySalesSum([]);
      // データの取得
      setMonthlySalesSumLabels(displayLabels)
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
      <ScrollView>
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
            setValue={setStartYear}
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
        <StandardSpace />
        <View style={styles.flex}>
          <SmallButton
            displayText='Start Analysis'
            disabled={false}
            onPress={() => getAnalysisData(uid, 'second')}
          />
        </View>
        <StandardSpace />

        <Text variant="titleMedium" style={styles.subTitle}>曜日別平均売上</Text>
        {
          messageForMonthlySales.length !== 0 ? (
            messageForMonthlySales.map((message: string, index: number) => { 
              return(
                <View style={styles.messageStyle} key={index}>
                  <Text style={styles.messageTextStyle}>{message}</Text>
                </View>
              )
            })
          ) : (
            <BarChart
              data={{
                  labels: monthlySalesLabels,
                  datasets: [{
                      data: monthlySalesData
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
          messageForMonthlySales.length !== 0 ? (
            messageForMonthlySales.map((message: string, index: number) => { 
              return(
                <View style={styles.messageStyle} key={index}>
                  <Text style={styles.messageTextStyle}>{message}</Text>
                </View>
              )
            })
          ) : (
            <BarChart
              data={{
                  labels: monthlySalesLabels,
                  datasets: [{
                      data: monthlySalesData
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
          messageForMonthlySales.length !== 0 ? (
            messageForMonthlySales.map((message: string, index: number) => { 
              return(
                <View style={styles.messageStyle} key={index}>
                  <Text style={styles.messageTextStyle}>{message}</Text>
                </View>
              )
            })
          ) : (
            <BarChart
              data={{
                  labels: monthlySalesLabels,
                  datasets: [{
                      data: monthlySalesData
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