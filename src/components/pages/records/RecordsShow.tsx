import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, DataTable } from "react-native-paper";
import { auth } from "../../../auth/firebase";
import { BackColor } from "../../../styles/common/color";
import { DateTransition, DayTransition } from "../../../utils/commonFunc/record/DateTranstion";
import { errorCodeTransition, method } from "../../../utils/const";
import { StandardSpace } from "../../parts/Space";

export const RecordsShow = (props: any) => {
    // props
    const { navigation, route } = props;

    // 変数
    var record_id = route.params.record_id;
    var user_id = route.params.user_id;

    // state
    const [userId, setUserId] = useState(Number);
    const [uid, setUid] = useState('');
    const [date, setDate] = useState(moment);
    const [day, setDay] = useState('');
    const [styleFlg, setStyleFlg] = useState('');
    const [startHour, setStartHour] = useState(Number);
    const [runningTime, setRunningTime] = useState(Number);
    const [runningKm, setRunningKm] = useState(Number);
    const [occupancyRate, setOccupancyRate] = useState(Number);
    const [numberOfTime, setNumberOfTime] = useState(Number);
    const [taxFlg, setTaxFlg] = useState('');
    const [dailySales, setDailySales] = useState(Number);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

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
  
      // headers
      const headers = {'uuid': currentUser.uid}
  
      // params
      const params = {
        user_id: user_id,
      }
  
      axios({
        method: method.GET,
        url: `/records/${record_id}`,
        headers: headers,
        data: null,
        params: params,
      }).then((response) => {
        console.log("data", response.data);
        // データの取得
        setUserId(response.data.data.id);
        setDate(response.data.data.date);
        setDay(response.data.data.day_of_week);
        setStyleFlg(response.data.data.style_flg);
        setStartHour(response.data.data.start_hour);
        setRunningTime(response.data.data.running_time);
        setRunningKm(response.data.data.running_km);
        setOccupancyRate(response.data.data.occupancy_rate);
        setNumberOfTime(response.data.data.number_of_time);
        if (response.data.data.is_tax){
          setTaxFlg('true');
        } else {
          setTaxFlg('false');
        }
        setDailySales(response.data.data.daily_sales);
      }).catch(error => {
        var errorCode = error.response.data.info.code;
        var message: string[] = [];
        message = errorCodeTransition(errorCode);
        setErrorMessages(message);
      });
    }, []);

    /**
     * averageSalesPerHour
     * @returns {number}
     */
    const averageSalesPerHour = () => {
      return Math.round(dailySales/runningTime);
    }

    /**
     * averageSalesPerCustomer
     * @returns {number}
     */
    const averageSalesPerCustomer = () => {
      return Math.round(dailySales/numberOfTime);
    }

    /**
     * averageSalesPerKm
     * @returns {number}
     */
    const averageSalesPerKm = () => {
      return Math.round(dailySales/runningKm);
    }
  
    return (
      <View style={styles.mainBody}>
        <Text variant="titleLarge">{DateTransition(String(date))}({DayTransition(day)})の売上記録</Text>

        <DataTable>
          <DataTable.Header>
            <DataTable.Title>売上</DataTable.Title>
            <DataTable.Title>売上達成率</DataTable.Title>
            <DataTable.Title>実車率</DataTable.Title>
          </DataTable.Header>
          <DataTable.Row>
            <DataTable.Cell>{dailySales}円</DataTable.Cell>
            <DataTable.Cell>todo%</DataTable.Cell>
            <DataTable.Cell>{occupancyRate}%</DataTable.Cell>
          </DataTable.Row>
        </DataTable>

        <StandardSpace/>

        <DataTable>
          <DataTable.Header>
            <DataTable.Title>走行時間</DataTable.Title>
            <DataTable.Title>平均単価/時間</DataTable.Title>
          </DataTable.Header>
          <DataTable.Row>
            <DataTable.Cell>{runningTime}時間</DataTable.Cell>
            <DataTable.Cell>{averageSalesPerHour()}円</DataTable.Cell>
          </DataTable.Row>
        </DataTable>

        <StandardSpace/>
        
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>組数</DataTable.Title>
            <DataTable.Title>平均単価/組</DataTable.Title>
          </DataTable.Header>
          <DataTable.Row>
            <DataTable.Cell>{numberOfTime}組</DataTable.Cell>
            <DataTable.Cell>{averageSalesPerCustomer()}円</DataTable.Cell>
          </DataTable.Row>
        </DataTable>

        <StandardSpace/>

        <DataTable>
          <DataTable.Header>
            <DataTable.Title>走行距離</DataTable.Title>
            <DataTable.Title>平均単価/km</DataTable.Title>
          </DataTable.Header>
          <DataTable.Row>
            <DataTable.Cell>{runningKm}km</DataTable.Cell>
            <DataTable.Cell>{averageSalesPerKm()}円</DataTable.Cell>
          </DataTable.Row>
        </DataTable>

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
    radioButtonStyle: {
      marginLeft: 35,
      marginRight: 35,
    },
    errorTextStyle: {
      color: 'red',
      textAlign: 'center',
      fontSize: 14,
    },
  });