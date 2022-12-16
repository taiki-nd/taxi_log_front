import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Platform } from 'react-native';
import { DataTable, Text } from "react-native-paper";
import { BarChart, LineChart } from 'react-native-chart-kit';
import { AccentColor, BackColor, BasicColor, SeaColor, TomatoColor } from '../styles/common/color';
import axios from 'axios';
import { auth } from '../auth/firebase';
import { errorCodeTransition, method } from '../utils/const';
import { Dropdown } from '../components/parts/Dropdown';
import { SmallButton } from '../components/parts/SmallButton';
import { Record } from '../models/Record';
import { StandardSpace } from '../components/parts/Space';
import { getMonthlyAnalysisPeriod, GetYearAndMonth } from '../utils/commonFunc/common';
import { DateTransition } from '../utils/commonFunc/record/DateTranstion';
import { SmallButtonCustom } from '../components/parts/SmallButtonCustom';

export const HomeScreen = (props: any) => {
  // props
  const { navigation } = props;

  //state
  const [uid, setUid] = useState('');
  const [closeDay, setCloseDay] = useState(0);
  const [payDay, setPayDay] = useState(0);
  const [toDay, setToDay] = useState(0);

  const [analysisStartYear, setAnalysisStartYear] = useState(0);
  const [analysisStartMonth, setAnalysisStartMonth] = useState(0);
  const [analysisStartDay, setAnalysisStartDay] = useState(0);
  const [analysisFinishYear, setAnalysisFinishYear] = useState(0);
  const [analysisFinishMonth, setAnalysisFinishMonth] = useState(0);
  const [analysisFinishDay, setAnalysisFinishDay] = useState(0);

  const [monthlySalesYear, setMonthlySalesYear] = useState(0);
  const [monthlySalesMonth, setMonthlySalesMonth] = useState(0);
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
    (async () => {
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
  
      // ドロップダウンリストの作成
      const headers = {'uuid': currentUser.uid}
      const user = await axios({
        method: method.GET,
        url: 'user/get_user_form_uid',
        headers: headers,
        data: null,
        params: null,
      }).then((response) => {
        var user = response.data.data
        console.log("user", user);
        return user;
      }).catch(error => {
        console.error("error", error);
        return "error";
      });

      var close_day = user.close_day
      var pay_day = user.pay_day
      setCloseDay(user.close_day);
      setPayDay(user.pay_days);

      var day = new Date();
      var today = day.getDay()
      var year = day.getFullYear()
      var month = day.getMonth() + 1
      setToDay(today);

      var year_and_month = GetYearAndMonth(year, month, today, close_day, pay_day);

      setMonthlySalesYear(year_and_month[0]);
      setMonthlySalesMonth(year_and_month[1]);
  
      var itemsYear: any[] = [];
      for (var i = 0; i < 10; i++) {
        itemsYear.push({label: `${year+1-i}`, value: year+1-i})
      }
      setItemsYear(itemsYear);
  
      var itemsMonth: any[] = [];
      for (var i = 0; i < 12; i++) {
        itemsMonth.push({label: `${i+1}`, value: i+1})
      }
      setItemsMonth(itemsMonth);

      getAnalysisPeriod(year, month, today, close_day);
      getMonthlySalesSum(currentUser.uid, user.close_day, user.pay_day, 'first');
      getMonthlySales(currentUser.uid, user.close_day, user.pay_day, 'first');
      recordsIndex(currentUser.uid, user.close_day, user.pay_day, 'first');
    })()
  }, []);

  const getMonthlySalesData = (uid: string, status: string) => {
    getAnalysisPeriod(monthlySalesYear, monthlySalesMonth, toDay, closeDay);
    getMonthlySalesSum(uid, closeDay, payDay, status)
    getMonthlySales(uid, closeDay, payDay, status)
    recordsIndex(uid, closeDay, payDay, status)
  }

  /**
   * getAnalysisPeriod
   */
  const getAnalysisPeriod = (year: number, month: number, today: number, close_day: number) => {
    console.log('getAnalysisPeriod', year, month, today, close_day)
    const days = getMonthlyAnalysisPeriod(year, month, today, close_day);
    console.log('days', days);
    setAnalysisStartYear(days.start_year);
    setAnalysisStartMonth(days.start_month);
    setAnalysisStartDay(days.start_day);
    setAnalysisFinishYear(days.finish_year);
    setAnalysisFinishMonth(days.finish_month);
    setAnalysisFinishDay(days.finish_day);
  }

  /**
   * getMonthlySalesSum
   * 月次総売上データの取得
   */
  const getMonthlySalesSum = async (uid: string, close_day: number, pay_day: number, status: string) => {

    console.log('getMonthlySalesSum')
    // headers
    const headers = {'uuid': uid}

    // params
    var params: any = {}
    if (status === 'first'){
      var day = new Date();
      var today = day.getDay()
      var year = day.getFullYear()
      var month = day.getMonth() + 1

      var year_and_month = GetYearAndMonth(year, month, today, close_day, pay_day)

      params ={
        'year': year_and_month[0],
        'month': year_and_month[1]
      }
    } else if (status === 'second') {
      params ={
        'year': monthlySalesYear,
        'month': monthlySalesMonth
      }
    }

    await axios({
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
  const getMonthlySales = async (uid: string, close_day: number, pay_day: number, status: string) => {
    // headers
    const headers = {'uuid': uid}

    // params
    var params: any = {}
    if (status === 'first'){
      var day = new Date();
      var today = day.getDay()
      var year = day.getFullYear()
      var month = day.getMonth() + 1

      var year_and_month = GetYearAndMonth(year, month, today, close_day, pay_day)

      params ={
        'year': year_and_month[0],
        'month': year_and_month[1]
      }
    } else if (status === 'second') {
      params ={
        'year': monthlySalesYear,
        'month': monthlySalesMonth
      }
    }

    await axios({
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
  const recordsIndex = async (uid: string, close_day: number, pay_day: number, status: string) => {

    // headers
    const headers = {'uuid': uid}
    
    // params
    var params: any = {}
    if (status === 'first'){
      var day = new Date();
      var today = day.getDay()
      var year = day.getFullYear()
      var month = day.getMonth() + 1

      var year_and_month = GetYearAndMonth(year, month, today, close_day, pay_day)

      params ={
        'year': year_and_month[0],
        'month': year_and_month[1]
      }
    } else if (status === 'second') {
      params ={
        'year': monthlySalesYear,
        'month': monthlySalesMonth
      }
    }

    await axios({
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

  return (
    <View style={styles.mainBody}>
      {
        Platform.OS === 'ios'
        ? 
          <View>
            <StandardSpace/>
            <StandardSpace/>
          </View>
        :
          <View></View>
      }
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
        <View>
          <Text style={styles.standardTextStyle}>解析期間</Text>
          <Text style={styles.standardTextStyle}>{`${analysisStartYear}/${analysisStartMonth}/${analysisStartDay} -> ${analysisFinishYear}/${analysisFinishMonth}/${analysisFinishDay}`}</Text>
        </View>
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
                <DataTable.Title>action</DataTable.Title>
              </DataTable.Header>
              {
                records.map((record: Record) => {
                  return(
                    <View key={record.id}>
                      <DataTable.Row style={styles.tableRow}>
                        <DataTable.Cell><Text style={styles.tableCell}>{DateTransition(record.date)}</Text></DataTable.Cell>
                        <DataTable.Cell><Text style={styles.tableCell}>{record.daily_sales}</Text></DataTable.Cell>
                        <DataTable.Cell>
                          <SmallButtonCustom
                            displayText='dailyReport'
                            color={SeaColor}
                            onPress={() => navigation.navigate('RecordsShow', {record_id: record.id, user_id: record.user_id})}
                          />
                        </DataTable.Cell>
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
  standardTextStyle: {
    color: BasicColor,
    fontSize: 14
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