import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { DataTable, Text } from "react-native-paper";
import { BarChart } from 'react-native-chart-kit';
import { AccentColor, BackColor, BasicColor, TomatoColor } from '../styles/common/color';
import axios from 'axios';
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
  const [dailyAverageSales, setDailyAverageSales] = useState(0)
  const [dailyAverageOccupancyRate, setDailyAverageOccupancyRate] = useState(0)
  const [maxOccupancyRate, setMaxOccupancyRate] = useState(0)
  const [maxSales, setMaxSales] = useState(0)
  const [periodCustomerUnitSales, setPeriodCustomerUnitSales] = useState(0)
  const [periodDistanceUnitSales, setPeriodDistanceUnitSales] = useState(0)
  const [periodTimeUnitSales, serPeriodTimeUnitSales] = useState(0)

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
        console.log("status", status);
        if (status === false) {
          const id_after_check_server = await AsyncStorage.getItem("taxi_log_user_id")
          if (id_after_check_server === null) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Signup2' }]
            });
            return;
          }
          navigation.navigate("Signin");
          return;
        }
      } else {
        setId(id);
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
      if (response.data.period_data.dailyAverageSales) {
        setDailyAverageSales(response.data.period_data.dailyAverageSales)
      }
      if (response.data.period_data.dailyAverageOccupancyRate) {
        setDailyAverageOccupancyRate(response.data.period_data.dailyAverageOccupancyRate)
      }
      if (response.data.period_data.maxOccupancyRate) {
        setMaxOccupancyRate(response.data.period_data.maxOccupancyRate)
      }
      if (response.data.period_data.maxSales) {
        setMaxSales(response.data.period_data.maxSales)
      }
      if (response.data.period_data.periodCustomerUnitSales) {
        setPeriodCustomerUnitSales(response.data.period_data.periodCustomerUnitSales)
      }
      if (response.data.period_data.periodDistanceUnitSales) {
        setPeriodDistanceUnitSales(response.data.period_data.periodDistanceUnitSales)
      }
      if (response.data.period_data.periodTimeUnitSales) {
        serPeriodTimeUnitSales(response.data.period_data.periodTimeUnitSales)
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
          value={finishMonth}
          items={itemsMonth}
          setOpen={setOpenFinishMonth}
          setValue={setFinishMonth}
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
        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>平均売上</DataTable.Title>
            <DataTable.Title>最高売上</DataTable.Title>
          </DataTable.Header>
          <DataTable.Row style={styles.tableRow}>
            <DataTable.Cell><Text style={styles.tableCell}>{dailyAverageSales}円</Text></DataTable.Cell>
            <DataTable.Cell><Text style={styles.tableCell}>{maxSales}円</Text></DataTable.Cell>
          </DataTable.Row>
        </DataTable>
        <StandardSpace />

        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>平均実車率</DataTable.Title>
            <DataTable.Title>最高実車率</DataTable.Title>
          </DataTable.Header>
          <DataTable.Row style={styles.tableRow}>
            <DataTable.Cell><Text style={styles.tableCell}>{dailyAverageOccupancyRate}%</Text></DataTable.Cell>
            <DataTable.Cell><Text style={styles.tableCell}>{maxOccupancyRate}%</Text></DataTable.Cell>
          </DataTable.Row>
        </DataTable>
        <StandardSpace />

        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>時間単価</DataTable.Title>
            <DataTable.Title>客単価</DataTable.Title>
            <DataTable.Title>距離単価</DataTable.Title>
          </DataTable.Header>
          <DataTable.Row style={styles.tableRow}>
            <DataTable.Cell><Text style={styles.tableCell}>{periodTimeUnitSales}円</Text></DataTable.Cell>
            <DataTable.Cell><Text style={styles.tableCell}>{periodCustomerUnitSales}円</Text></DataTable.Cell>
            <DataTable.Cell><Text style={styles.tableCell}>{periodDistanceUnitSales}円</Text></DataTable.Cell>
          </DataTable.Row>
        </DataTable>
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
  },
  tableHeader: {
    borderBottomColor: AccentColor,
    borderBottomWidth: 0.5,
  },
  tableRow: {
    borderBottomColor: AccentColor,
    borderBottomWidth: 0,
  },
  tableCell: {
    fontSize: 12,
  }
});