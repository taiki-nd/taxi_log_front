import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { DataTable, Text } from "react-native-paper";
import { BarChart, LineChart } from 'react-native-chart-kit';
import { AccentColor, BackColor, BasicColor, TomatoColor } from '../styles/common/color';
import axios from 'axios';
import { auth } from '../auth/firebase';
import { errorCodeTransition, method } from '../utils/const';
import { Dropdown } from '../components/parts/Dropdown';
import { SmallButton } from '../components/parts/SmallButton';
import { Record } from '../models/Record';
import { StandardSpace } from '../components/parts/Space';

export const HomeScreen = (props: any) => {
  // props
  const { navigation } = props;

  //state
  const [uid, setUid] = useState('')

  const [monthlySalesYear, setMonthlySalesYear] = useState(0)
  const [monthlySalesMonth, setMonthlySalesMonth] = useState(0)
  const [monthlySalesSumData, setMonthlySalesSumData] = useState<number[]>([0, 0, 0]);
  const [monthlySalesSumLabels, setMonthlySalesSumLabels] = useState<string[]>(['1', '2', '3']);

  const [monthlySalesData, setMonthlySalesData] = useState<number[]>([0, 0, 0]);
  const [monthlySalesLabels, setMonthlySalesLabels] = useState<string[]>(['1', '2', '3']);

  const [dialogTitle, setDialogTitle] = useState('');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [messageForMonthlySalesSum, setMessageForMonthlySalesSum] = useState<string[]>([]);
  const [messageForMonthlySales, setMessageForMonthlySales] = useState<string[]>([]);

  const [openYearForSalesSum, setOpenYearForSalesSum] = useState(false);
  const [openMonthForSalesSum, setOpenMonthForSalesSum] = useState(false);
  const [itemsYear, setItemsYear] = useState<any[]>([]);
  const [itemsMonth, setItemsMonth] = useState<any[]>([]);

  const [records, setRecords] = useState<any>([]);

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
    setMonthlySalesYear(today.getFullYear());
    setMonthlySalesMonth(today.getMonth()+1);

    var itemsYear: any[] = [];
    for (var i = 0; i < 10; i++) {
      itemsYear.push({label: `${today.getFullYear()-i}`, value: today.getFullYear()-i})
    }
    setItemsYear(itemsYear);

    var itemsMonth: any[] = [];
    for (var i = 0; i < 11; i++) {
      itemsMonth.push({label: `${i+1}`, value: i+1})
    }
    setItemsMonth(itemsMonth);

    getMonthlySalesSum(currentUser.uid, 'first');
    getMonthlySales(currentUser.uid, 'first');
    recordsIndex(currentUser.uid, 'first')
  }, []);

  const getMonthlySalesData = (uid: string, status: string) => {
    getMonthlySalesSum(uid, status)
    getMonthlySales(uid, status)
    recordsIndex(uid, status)
  }

  /**
   * getMonthlySalesSum
   * 月次総売上データの取得
   */
  const getMonthlySalesSum = (uid: string, status: string) => {
    // headers
    const headers = {'uuid': uid}

    // params
    var params: any = {}
    if (status === 'first'){
      var today = new Date();
      params ={
        'year': today.getFullYear(),
        'month': today.getMonth()+1
      }
      setMonthlySalesYear(today.getFullYear());
      setMonthlySalesMonth(today.getMonth()+1);
    } else if (status === 'second') {
      params ={
        'year': monthlySalesYear,
        'month': monthlySalesMonth
      }
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

  /**
   * getMonthlySales
   * 月次売上データの取得
   */
  const getMonthlySales = (uid: string, status: string) => {
    // headers
    const headers = {'uuid': uid}

    // params
    var params: any = {}
    if (status === 'first'){
      var today = new Date();
      params ={
        'year': today.getFullYear(),
        'month': today.getMonth()+1
      }
      setMonthlySalesYear(today.getFullYear());
      setMonthlySalesMonth(today.getMonth()+1);
    } else if (status === 'second') {
      params ={
        'year': monthlySalesYear,
        'month': monthlySalesMonth
      }
    }

    axios({
      method: method.GET,
      url: '/analysis/sales',
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
        setMessageForMonthlySales(['表示するデータがありません']);
        return;
      }
      setMessageForMonthlySales([]);
      // データの取得
      setMonthlySalesLabels(displayLabels)
      setMonthlySalesData(response.data.data)
    }).catch(error => {
      var errorCode = error.response.data.info.code;
      var message: string[] = [];
      message = errorCodeTransition(errorCode);
      setErrorMessages(message);
      setDialogTitle('月次売上のデータ取得の失敗')
      //setVisibleFailedDialog(true);
    });
  }

  /**
   * recordsIndex
   * 対象期間の日報を取得
   * @param uid 
   * @param status 
   */
  const recordsIndex = (uid: string, status: string) => {

    // headers
    const headers = {'uuid': uid}
    
    // params
    var params: any = {}
    if (status === 'first'){
      var today = new Date();
      params ={
        'year': today.getFullYear(),
        'month': today.getMonth()+1
      }
      setMonthlySalesYear(today.getFullYear());
      setMonthlySalesMonth(today.getMonth()+1);
    } else if (status === 'second') {
      params ={
        'year': monthlySalesYear,
        'month': monthlySalesMonth
      }
    }

    axios({
      method: method.GET,
      url: '/analysis/records',
      headers: headers,
      data: null,
      params: params,
    }).then((response) => {
      console.log("data", response.data.data);
      setRecords(response.data.data);
    }).catch(error => {
      var errorCode = error.response.data.info.code;
      var message: string[] = [];
      message = errorCodeTransition(errorCode);
      //setErrorMessages(message);
    });
  }

  const getOnlyDate = (date: any) => {
    var d = new Date(date);
    const onlyDate = d.getDate()
    return onlyDate;
  }

  return (
    <View style={styles.mainBody}>
      <View style={styles.flex}>
        <Dropdown
          placeholder='年'
          width='30%'
          open={openYearForSalesSum}
          value={monthlySalesYear}
          items={itemsYear}
          setOpen={setOpenYearForSalesSum}
          setValue={setMonthlySalesYear}
          setItems={setItemsYear}
        />
        <Dropdown
          placeholder='月'
          width='20%'
          open={openMonthForSalesSum}
          value={monthlySalesMonth}
          items={itemsMonth}
          setOpen={setOpenMonthForSalesSum}
          setValue={setMonthlySalesMonth}
          setItems={setItemsMonth}
        />
        <SmallButton
          displayText='Start Analysis'
          disabled={false}
          onPress={() => getMonthlySalesData(uid, 'second')}
        />
      </View>
      <ScrollView>
        <StandardSpace/>
        <Text variant="titleMedium" style={styles.subTitle}>月次総売上</Text>   
        {
          messageForMonthlySalesSum.length !== 0 ? (
            messageForMonthlySalesSum.map((message: string, index: number) => { 
              return(
                <View style={styles.messageStyle} key={index}>
                  <Text style={styles.messageTextStyle}>{message}</Text>
                </View>
              )
            })
          ) : (
            <LineChart
              data={{
                  labels: monthlySalesSumLabels,
                  datasets: [{
                      data: monthlySalesSumData
                  }]
              }}
              width={Dimensions.get("window").width} // from react-native
              height={220}
              fromZero={true}
              yAxisLabel='¥'
              chartConfig={{
                  backgroundColor: BackColor,
                  backgroundGradientFrom: BackColor,
                  backgroundGradientTo: BackColor,
                  decimalPlaces: 0,
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
          )
        }

        <StandardSpace/>
        <Text variant="titleMedium" style={styles.subTitle}>月次売上</Text>
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

        <StandardSpace/>
        <Text variant="titleMedium" style={styles.subTitle}>月次売上表</Text>
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
            <DataTable>
              <DataTable.Header style={styles.tableHeader}>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Sales</DataTable.Title>
              </DataTable.Header>
              {
                records.map((record: Record) => {
                  return(
                    <View key={record.id}>
                      <DataTable.Row style={styles.tableRow}>
                        <DataTable.Cell><Text style={styles.tableCell}>{getOnlyDate(record.date)}</Text></DataTable.Cell>
                        <DataTable.Cell><Text style={styles.tableCell}>{record.daily_sales}</Text></DataTable.Cell>
                      </DataTable.Row>
                    </View>
                  )
                })
              }
            </DataTable>
          )
        }
      </ScrollView>
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
  },
  tableHeader: {
    borderBottomColor: AccentColor,
    borderBottomWidth: 1,
  },
  tableRow: {
    borderBottomColor: AccentColor,
    borderBottomWidth: 0.5,
  },
  tableCell: {
    fontSize: 12,
  }
});