import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Platform } from 'react-native';
import { DataTable, Text } from "react-native-paper";
import { BarChart, LineChart } from 'react-native-chart-kit';
import { AccentColor, BackColor, BasicColor, SeaColor, TomatoColor } from '../styles/common/color';
import axios from 'axios';
import { method } from '../utils/const';
import { Dropdown } from '../components/parts/Dropdown';
import { SmallButton } from '../components/parts/SmallButton';
import { Record } from '../models/Record';
import { StandardSpace } from '../components/parts/Space';
import { getMonthlyAnalysisPeriod, GetYearAndMonth } from '../utils/commonFunc/common';
import { DateTransition } from '../utils/commonFunc/record/DateTranstion';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetSigninUser } from '../utils/commonFunc/user/GetSigninUser';

export const HomeScreen = (props: any) => {
  // props
  const { navigation } = props;

  //state
  const [uid, setUid] = useState('');
  const [id, setId] = useState('');
  const [closeDay, setCloseDay] = useState(0);
  const [payDay, setPayDay] = useState(0);
  const [toDay, setToDay] = useState(0);
  const [monthlyTarget, setMonthlyTarget] = useState(0);
  const [monthlySalesSumLast, setMonthlySalesSumLast] = useState(0);

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
      const id = await AsyncStorage.getItem("taxi_log_user_id")
      console.log("id ホーム画面初期起動", id)
      if (id === null) {
        const status = await GetSigninUser();
        if (status === false) {
          navigation.navigate("Signin");
        }
      } else {
        setId(id);
      }
  
      // ドロップダウンリストの作成
      const headers = {'id': String(id)}
      const params = {'id': id}
      const user = await axios({
        method: method.GET,
        url: `/users/${id}`,
        headers: headers,
        data: null,
        params: params,
      }).then((response) => {
        var user = response.data.data
        console.log("user", user);
        return user;
      }).catch(error => {
        console.error("error here", error);
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

      setMonthlyTarget(user.monthly_target)

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
      getAnalysisDataForHome(id, user.close_day, user.pay_day, 'first')
    })()
  }, []);

  const getMonthlySalesData = async (user_id: string, status: string) => {
    await getAnalysisPeriod(monthlySalesYear, monthlySalesMonth, toDay, closeDay);
    await getAnalysisDataForHome(user_id, closeDay, payDay, status)
  }

  /**
   * getAnalysisPeriod
   */
  const getAnalysisPeriod = (year: number, month: number, today: number, close_day: number) => {
    const days = getMonthlyAnalysisPeriod(year, month, today, close_day);
    setAnalysisStartYear(days.start_year);
    setAnalysisStartMonth(days.start_month);
    setAnalysisStartDay(days.start_day);
    setAnalysisFinishYear(days.finish_year);
    setAnalysisFinishMonth(days.finish_month);
    setAnalysisFinishDay(days.finish_day);
  }

  /**
   * Home画面用分析データ取得
   * getAnalysisDataForHome
   */
  const getAnalysisDataForHome = async (id: any, close_day: number, pay_day: number, status: string) => {
    console.log('run getAnalysisDataForHome')
    // header
    const headers = {'id': id}

    // params
    var params: any = {}
    if (status === 'first'){
      var day = new Date();
      var today = day.getDay()
      var year = day.getFullYear()
      var month = day.getMonth() + 1

      var year_and_month = GetYearAndMonth(year, month, today, close_day, pay_day)

      params ={
        'id': id,
        'year': year_and_month[0],
        'month': year_and_month[1]
      }
    } else if (status === 'second') {
      params ={
        'id': id,
        'year': monthlySalesYear,
        'month': monthlySalesMonth
      }
    }

    await axios({
      method: method.GET,
      url: '/analysis/home',
      headers: headers,
      data: null,
      params: params,
    }).then((response) => {
      console.log("data analysis for home", response.data);
      // labelsの成形
      var displayLabels_dates_sum: string[] = [];
      response.data.data.dates.forEach((label: string) => {
        var date = new Date(label);
        const dateOnlyDate = String(date.getDate());
        displayLabels_dates_sum.push(dateOnlyDate);
      })
      // データがからの場合の処理
      if (displayLabels_dates_sum.length === 0 ) {
        setMessageForMonthlySalesSum(['表示するデータがありません']);
        setMessageForMonthlySales(['表示するデータがありません']);
        return;
      }
      
      setMessageForMonthlySalesSum([]);
      setMessageForMonthlySales([]);
      ///
      /// AnalysisSalesSum
      ///
      setMonthlySalesSumLabels(displayLabels_dates_sum);
      setMonthlySalesSumData(response.data.data.home_sales_sum);
      setMonthlySalesSumLast(response.data.data.home_sales_sum.slice(-1)[0]);
      ///
      /// AnalysisSales
      ///
      setMonthlySalesLabels(displayLabels_dates_sum)
      setMonthlySalesData(response.data.data.home_sales)
      ///
      /// GetRecords
      ///
      setRecords(response.data.data.records);
    
    }).catch(error => {
      console.log('getAnalysisDataForHome api error', error)
      /*
      var errorCode: string[];
      if (error.code === "ERR_BAD_REQUEST"){
        errorCode = [""]
      } else if (error.response.data.info.code === undefined ){
        errorCode = [""]
      } else {
        errorCode = error.response.data.info.code;
      }
      var message: string[] = [];
      message = errorCodeTransition(errorCode);
      setErrorMessages(message);
      setDialogTitle('月次総売上のデータ取得の失敗');
      */
      setMessageForMonthlySalesSum(['データの取得に失敗しました']);
      setMessageForMonthlySales(['データの取得に失敗しました']);
      //setVisibleFailedDialog(true);
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
          onPress={() => getMonthlySalesData(id, 'second')}
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
            <View>
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
              <DataTable>
                <DataTable.Header style={styles.tableHeader}>
                  <DataTable.Title>月額目標</DataTable.Title>
                  <DataTable.Title>月額総売上</DataTable.Title>
                  <DataTable.Title>達成率</DataTable.Title>
                </DataTable.Header>
                  <DataTable.Row style={styles.tableRow}>
                    <DataTable.Cell><Text style={styles.tableCell}>{monthlyTarget}円</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{monthlySalesSumLast}円</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{Math.round((monthlySalesSumLast/monthlyTarget)*100)}%</Text></DataTable.Cell>
                  </DataTable.Row>
              </DataTable>
            </View>
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
                          <Icon
                            name="export"
                            size={25}
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