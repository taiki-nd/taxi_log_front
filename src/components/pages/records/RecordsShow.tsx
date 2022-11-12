import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { auth } from "../../../auth/firebase";
import { BackColor } from "../../../styles/common/color";
import { DateTransition, DayTransition } from "../../../utils/commonFunc/record/DateTranstion";
import { errorCodeTransition, method } from "../../../utils/const";

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
  
    return (
      <View style={styles.mainBody}>
        <Text>{DateTransition(String(date))}({DayTransition(day)})</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    mainBody: {
      flex: 1,
      justifyContent: 'center',
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