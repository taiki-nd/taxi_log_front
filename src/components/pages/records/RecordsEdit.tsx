import axios from "axios";
import moment from "moment";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import CalendarStrip from 'react-native-calendar-strip';
import { StyleSheet, View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RadioButton } from "react-native-paper";
import { auth } from "../../../auth/firebase";
import { AccentColor, BackColor, BasicColor } from "../../../styles/common/color";
import { errorCodeTransition, method } from "../../../utils/const";
import { StandardButton } from "../../parts/StandardButton";
import { StandardLabel } from "../../parts/StandardLabel";
import { StandardTextInput } from "../../parts/StandardTextInput";
import { StandardTextLink } from "../../parts/StandardTextLink";

export const RecordsEdit = (props: any) => {
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

  // signinユーザー情報の取得
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

  // 必須項目チェックによるボタン活性化処理
  useEffect(() => {
    if (date !== undefined
      && day !== ''
      && styleFlg !== ''
      && startHour !== undefined
      && runningTime !== undefined
      && occupancyRate !== undefined
      && runningKm !== 0
      && numberOfTime !== undefined
      && dailySales !== 0
      && taxFlg !== ''){
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [date, day, styleFlg, startHour, runningTime, runningKm ,occupancyRate, numberOfTime, dailySales, taxFlg]);

  /**
   * updateRecord
   */
  const updateRecord = useCallback(async (e: SyntheticEvent) => {
    e.preventDefault();

    setButtonDisabled(true);

    // headers
    const headers = {'uuid': uid}

    // taxFlg変換
    var isTax = false;
    if (taxFlg === "true") {
      isTax = true;
    }

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
      is_tax: isTax,
      daily_sales: Number(dailySales),
      user_id: Number(userId)
    }

    console.log(jsonData);

    // params
    var params = {
      uuid: uid,
    }

    try {
      await axios({
        method: method.POST,
        url: '/records',
        headers: headers,
        data: jsonData,
        params: params,
      }).then((response) => {
        console.log("data", response.data);
        // ボタンの活性化
        setButtonDisabled(false);
        // ユーザー登録画面への遷移
        navigation.reset({
          index: 0,
          routes: [{ name: 'Records' }]
        });
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
  }, [userId, uid, date, day, styleFlg, startHour, runningTime, runningKm ,occupancyRate, numberOfTime, dailySales, taxFlg]);

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
                markedDates={[date]}
                onDateSelected={value => {
                  setDate(value);
                }}
              />
              <StandardLabel displayText={"曜日"}/>
              <RadioButton.Group onValueChange={value => setDay(value)} value={day}>
                <RadioButton.Item label="月" value="Mon." style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="火" value="Tue." style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="水" value="Wed." style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="木" value="Thu." style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="金" value="Fri." style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="土" value="Sat." style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="日" value="Sun." style={styles.radioButtonStyle} color={AccentColor}/>
              </RadioButton.Group>
              <StandardLabel displayText={"勤務形態"}/>
              <RadioButton.Group onValueChange={value => setStyleFlg(value)} value={styleFlg}>
                <RadioButton.Item label="隔日勤務" value="every_other_day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="日勤" value="day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="夜勤" value="night" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="他" value="other" style={styles.radioButtonStyle} color={AccentColor}/>
              </RadioButton.Group>
              <StandardTextInput label="始業開始時刻" defaultValue={String(startHour)} placeholder="15" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setStartHour(i)}/>
              <StandardTextInput label="走行時間" defaultValue={String(runningTime)} placeholder="17" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setRunningTime(i)}/>
              <StandardTextInput label="走行距離" defaultValue={String(runningKm)} placeholder="285" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setRunningKm(i)}/>
              <StandardTextInput label="乗車率" defaultValue={String(occupancyRate)} placeholder="55.8" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setOccupancyRate(i)}/>
              <StandardTextInput label="乗車回数" defaultValue={String(numberOfTime)} placeholder="38" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setNumberOfTime(i)}/>
              <StandardTextInput label="売上" defaultValue={String(dailySales)} placeholder="58000" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setDailySales(i)}/>
              <StandardLabel displayText={"標準入力価格設定"}/>
              <RadioButton.Group onValueChange={value => setTaxFlg(value)} value={taxFlg}>
                <RadioButton.Item label="税込みで入力" value="true" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="税抜きで入力" value="false" style={styles.radioButtonStyle} color={AccentColor}/>
              </RadioButton.Group>
              {errorMessages.length != 0 ? (
                errorMessages.map((errorMessage: string, index: number) => { 
                  return(
                    <Text style={styles.errorTextStyle} key={index}>
                      {errorMessage}
                    </Text>
                  )})
                  ) : null}
              <StandardButton displayText="Update Record" disabled={buttonDisabled} onPress={updateRecord} id={userId} uid={uid} />
              <StandardTextLink displayText="Cancel" onPress={() => moveScreen("Records")}/>
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
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});