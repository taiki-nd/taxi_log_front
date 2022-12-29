import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { RadioButton } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StandardTextInput } from '../components/parts/StandardTextInput';
import { StandardLabel } from '../components/parts/StandardLabel';
import { StandardButton } from '../components/parts/StandardButton';
import { StandardTextLink } from '../components/parts/StandardTextLink';
import { AccentColor, BackColor, BasicColor, TomatoColor } from '../styles/common/color';
import moment from 'moment';
import axios from 'axios';
import { errorCodeTransition, method } from '../utils/const';
import { auth } from '../auth/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetSigninUser } from '../utils/commonFunc/user/GetSigninUser';

export const RecordsCreate = (props: any) => {
  // props
  const { navigation } = props;

  // state
  const [id, setId] = useState('');
  const [userId, setUserId] = useState(Number);
  const [uid, setUid] = useState('');
  const [date, setDate] = useState(moment);
  const [day, setDay] = useState('');
  const [styleFlg, setStyleFlg] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [area, setArea] = useState('');
  const [startHour, setStartHour] = useState(Number);
  const [runningTime, setRunningTime] = useState(Number);
  const [runningKm, setRunningKm] = useState(Number);
  const [occupancyRate, setOccupancyRate] = useState(Number);
  const [numberOfTime, setNumberOfTime] = useState(Number);
  const [taxFlg, setTaxFlg] = useState('');
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
      console.log("id レコード作成ページ初期表示", id)
      if (id === null) {
        const status = await GetSigninUser();
        if (status === false) {
          navigation.navigate("Signin");
        }
      } else {
        setId(id);
      }

      // headers
      const headers = {'id': String(id)}
      // params
      const params = {'id': id}

      await axios({
        method: method.GET,
        url: `/users/${id}`,
        headers: headers,
        data: null,
        params: params,
      }).then((response) => {
        console.log("data", response.data);
        setUserId(response.data.data.id);
        setStyleFlg(response.data.data.style_flg);
        setPrefecture(response.data.data.prefecture);
        setArea(response.data.data.area);
        if (response.data.data.is_tax){
          setTaxFlg('true');
        } else {
          setTaxFlg('false');
        }
      }).catch(error => {
        console.log("error get sigin user recordsCreate", error);
        var errorCode = error.response.data.info.code;
        var message: string[] = [];
        message = errorCodeTransition(errorCode);
        setErrorMessages(message);
      });
    })()
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
   * createRecord
   */
  const createRecord = useCallback(async (e: SyntheticEvent) => {
    e.preventDefault();
    console.log("pressed createRecord button");

    setButtonDisabled(true);

    // taxFlg変換
    var isTax = false;
    if (taxFlg === "true") {
      isTax = true;
    }

    console.log(date);

    // jsonData
    var jsonData = {
      date: moment(date),
      day_of_week: day,
      style_flg: styleFlg,
      prefecture: prefecture,
      area: area,
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


    // headers
    const headers = {'id': String(id)}
    // params
    const params = {'id': id}

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
          routes: [{ name: 'Home' }]
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
                scrollable
                style={{height:100, paddingTop: 10, paddingBottom: 10}}
                daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: BasicColor}}
                calendarColor={BackColor}
                calendarHeaderStyle={{color: BasicColor}}
                dateNumberStyle={{color: BasicColor}}
                dateNameStyle={{color: BasicColor}}
                iconContainer={{flex: 0.1}}
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
              <StandardTextInput label="始業開始時刻" placeholder="15" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setStartHour(i)}/>
              {
                startHourMessage !== '' ? <Text style={styles.dialogWarn}>{startHourMessage}</Text> : <View></View>
              }
              <StandardTextInput label="走行時間" placeholder="17" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setRunningTime(i)}/>
              {
                runningTimeMessage !== '' ? <Text style={styles.dialogWarn}>{runningTimeMessage}</Text> : <View></View>
              }
              <StandardTextInput label="走行距離" placeholder="285" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setRunningKm(i)}/>
              {
                runningKmMessage !== '' ? <Text style={styles.dialogWarn}>{runningKmMessage}</Text> : <View></View>
              }
              <StandardTextInput label="乗車率" placeholder="55.8" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setOccupancyRate(i)}/>
              <StandardTextInput label="乗車回数" placeholder="38" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setNumberOfTime(i)}/>
              {
                numberOfTimeMessage !== '' ? <Text style={styles.dialogWarn}>{numberOfTimeMessage}</Text> : <View></View>
              }
              <StandardTextInput label="売上" placeholder="58000" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setDailySales(i)}/>
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
              <StandardButton displayText="Create Record" disabled={buttonDisabled} onPress={createRecord} id={userId} uid={uid} />
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
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  dialogWarn: {
    color: TomatoColor,
    textAlign: 'center',
    fontSize: 10,
  }
});