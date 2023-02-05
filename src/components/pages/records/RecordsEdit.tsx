import axios from "axios";
import moment from "moment";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import CalendarStrip from 'react-native-calendar-strip';
import { StyleSheet, View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RadioButton } from "react-native-paper";
import { AccentColor, BackColor, BasicColor, TomatoColor } from "../../../styles/common/color";
import { errorCodeTransition, method } from "../../../utils/const";
import { StandardButton } from "../../parts/StandardButton";
import { StandardLabel } from "../../parts/StandardLabel";
import { StandardTextInput } from "../../parts/StandardTextInput";
import { StandardTextLink } from "../../parts/StandardTextLink";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetSigninUser } from "../../../utils/commonFunc/user/GetSigninUser";

export const RecordsEdit = (props: any) => {
  // props
  const { navigation, route } = props;

  // 変数
  var record_id = route.params.record_id;
  var user_id = route.params.user_id;
  
  // state
  const [id, setId] = useState('');
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
  const [dailySales, setDailySales] = useState(Number);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const [startHourMessage, setStartHourMessage] = useState('');
  const [runningTimeMessage, setRunningTimeMessage] = useState('');
  const [runningKmMessage, setRunningKmMessage] = useState('');
  const [numberOfTimeMessage, setNumberOfTimeMessage] = useState('');

  var int_pattern = /^([1-9]\d*|0)$/

  // signinユーザー情報の取得
  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem("taxi_log_user_id")
      console.log("id レコード編集ページ初期表示", id)
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

      // headers
      const headers = {'id': String(id)}
      // params
      const params = {
        user_id: user_id,
        'id': id
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
        setDate(moment(response.data.data.date));
        setDay(response.data.data.day_of_week);
        setStyleFlg(response.data.data.style_flg);
        setStartHour(response.data.data.start_hour);
        setRunningTime(response.data.data.running_time);
        setRunningKm(response.data.data.running_km);
        setOccupancyRate(response.data.data.occupancy_rate);
        setNumberOfTime(response.data.data.number_of_time);
        setDailySales(response.data.data.daily_sales);
      }).catch(error => {
        var errorCode = error.response.data.info.code;
        var message: string[] = [];
        message = errorCodeTransition(errorCode);
        setErrorMessages(message);
      });
    })();
  }, []);

  // 必須項目チェックによるボタン活性化処理
  useEffect(() => {
    if (date !== undefined
      && styleFlg !== ''
      && startHour !== undefined
      && runningTime !== undefined
      && occupancyRate !== undefined
      && runningKm !== 0
      && numberOfTime !== undefined
      && dailySales !== 0){
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [date, day, styleFlg, startHour, runningTime, runningKm ,occupancyRate, numberOfTime, dailySales]);

  /**
   * 小数入力時の対応
   */
  useEffect(() => {
    if (int_pattern.test(String(startHour))) {
      setStartHourMessage('')
    } else {
      setStartHourMessage('業務開始時刻に無効な値が入力されています。1〜31の整数を入力して下さい。')
    
    }
  }, [startHour])

  useEffect(() => {
    if (int_pattern.test(String(runningTime))) {
      setRunningTimeMessage('')
    } else {
      setRunningTimeMessage('走行時間に無効な値が入力されています。1〜31の整数を入力して下さい。')
    }
  }, [runningTime])

  useEffect(() => {
    if (int_pattern.test(String(runningKm))) {
      setRunningKmMessage('')
    } else {
      setRunningKmMessage('走行距離に無効な値が入力されています。1以上の整数を入力して下さい。')
    }
  }, [runningKm])

  useEffect(() => {
    if (int_pattern.test(String(numberOfTime))) {
      setNumberOfTimeMessage('')
    } else {
      setNumberOfTimeMessage('乗車回数に無効な値が入力されています。0以上の整数を入力して下さい。')
    }
  }, [numberOfTime])

  /**
   * 曜日の取得
   */
  useEffect(() => {
    var week_chars = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.']
    var week_day = date.toDate().getDay();
    setDay(week_chars[week_day])
  }, [date])

  /**
   * updateRecord
   */
  const updateRecord = useCallback(async (e: SyntheticEvent) => {
    e.preventDefault();

    setButtonDisabled(true);

    // headers
    const headers = {'id': id}

    // jsonData
    var jsonData = {
      date: moment(date),
      day_of_week: day,
      style_flg: styleFlg,
      start_hour: Number(startHour),
      running_time: Number(runningTime),
      running_km: Number(runningKm),
      occupancy_rate: Number(occupancyRate),
      number_of_time: Number(numberOfTime),
      daily_sales: Number(dailySales),
    }

    // params
    var params = {
      user_id: user_id,
      id: id
    }

    try {
      await axios({
        method: method.PUT,
        url: `/records/${record_id}`,
        headers: headers,
        data: jsonData,
        params: params,
      }).then((response) => {
        console.log("data", response.data);
        // ボタンの活性化
        setButtonDisabled(false);
        // ユーザー登録画面への遷移
        navigation.navigate('RecordsShow', {record_id: record_id, user_id: user_id})
      }).catch(error => {
        var errorCode = error.response.data.info.code;
        var message: string[] = [];
        console.log(errorCode);
        message = errorCodeTransition(errorCode);
        setErrorMessages(message);
        // ボタンの活性化
        setButtonDisabled(true);
      });
    } catch (ex: any) {

    }
  }, [userId, uid, date, day, styleFlg, startHour, runningTime, runningKm ,occupancyRate, numberOfTime, dailySales]);

  /**
   * moveScreen
   * @param screen 
   */
  const moveScreen = (screen: any) => {
    navigation.reset({
      index: 0,
      routes: [{ name: screen }]
    });
  }

  /**
   * getStartingDate
   */
  const getStartingDate = () => {
    return moment(date).subtract(3, 'days')
  }

  return (
    <View style={styles.mainBody}>
      <View>
        <KeyboardAwareScrollView>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
              <CalendarStrip
                selectedDate={date}
                scrollable
                style={{height:100, paddingTop: 10, paddingBottom: 10}}
                daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: BasicColor}}
                calendarColor={BackColor}
                calendarHeaderStyle={{color: BasicColor}}
                dateNumberStyle={{color: BasicColor}}
                dateNameStyle={{color: BasicColor}}
                iconContainer={{flex: 0.1}}
                startingDate={getStartingDate()}
                markedDates={[date]}
                onDateSelected={value => {
                  setDate(value);
                }}
              />
              <StandardLabel displayText={"勤務形態"}/>
              <RadioButton.Group onValueChange={value => setStyleFlg(value)} value={styleFlg}>
                <RadioButton.Item label="隔日勤務" value="every_other_day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="日勤" value="day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="夜勤" value="night" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="他" value="other" style={styles.radioButtonStyle} color={AccentColor}/>
              </RadioButton.Group>
              <StandardTextInput label="始業開始時刻" defaultValue={String(startHour)} placeholder="15" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setStartHour(i)}/>
              {
                startHourMessage !== '' ? <Text style={styles.dialogWarn}>{startHourMessage}</Text> : <View></View>
              }
              <StandardTextInput label="走行時間" defaultValue={String(runningTime)} placeholder="17" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setRunningTime(i)}/>
              {
                runningTimeMessage !== '' ? <Text style={styles.dialogWarn}>{runningTimeMessage}</Text> : <View></View>
              }
              <StandardTextInput label="走行距離" defaultValue={String(runningKm)} placeholder="285" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setRunningKm(i)}/>
              {
                runningKmMessage !== '' ? <Text style={styles.dialogWarn}>{runningKmMessage}</Text> : <View></View>
              }
              <StandardTextInput label="乗車率" defaultValue={String(occupancyRate)} placeholder="55.8" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setOccupancyRate(i)}/>
              <StandardTextInput label="乗車回数" defaultValue={String(numberOfTime)} placeholder="38" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setNumberOfTime(i)}/>
              {
                numberOfTimeMessage !== '' ? <Text style={styles.dialogWarn}>{numberOfTimeMessage}</Text> : <View></View>
              }
              <StandardTextInput label="売上" defaultValue={String(dailySales)} placeholder="58000" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setDailySales(i)}/>
              {errorMessages.length != 0 ? (
                errorMessages.map((errorMessage: string, index: number) => { 
                  return(
                    <Text style={styles.errorTextStyle} key={index}>
                      {errorMessage}
                    </Text>
                  )})
                  ) : null}
              <StandardButton displayText="Update Record" disabled={buttonDisabled} onPress={updateRecord} id={userId} uid={uid} />
              <StandardTextLink displayText="Cancel" onPress={() => moveScreen("Home")}/>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </View>
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
    color: TomatoColor,
    textAlign: 'center',
    fontSize: 14,
  },
  dialogWarn: {
    color: TomatoColor,
    textAlign: 'center',
    fontSize: 10,
  }
});