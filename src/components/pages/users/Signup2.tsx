import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AccentColor, BackColor } from '../../../styles/common/color';
import { StandardButton } from '../../parts/StandardButton';
import { StandardTextInput } from '../../parts/StandardTextInput';
import { getUid } from '../../../auth/firebase';
import {  errorCodeTransition, method } from '../../../utils/const';
import { StandardLabel } from '../../parts/StandardLabel';
import axios from 'axios';
import { StandardTextLink } from '../../parts/StandardTextLink';

export const Signup2 = (props: any) => {
  // props
  const { navigation } = props;

  // state
  const [nickname, setnickname] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [company, setCompany] = useState('');
  const [styleFlg, setStyleFlg] = useState('');
  const [closeDay, setCloseDay] = useState(Number);
  const [dailyTarget, setDailyTarget] = useState(Number);
  const [monthlyTarget, setMonthlyTarget] = useState(Number);
  const [taxFlg, setTaxFlg] = useState('false');
  const [openFlg, setOpenFlg] = useState('close');
  const [admin, setAdmin] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // 必須項目チェックによるボタン活性化処理
  useEffect(() => {
    if (nickname !== ''
      && prefecture !== ''
      && company !== ''
      && styleFlg !== ''
      && closeDay !== 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [nickname, prefecture, company, styleFlg, closeDay]);

  /**
   * createAccount
   */
  const createAccount = useCallback( async (e: SyntheticEvent) => {
    e.preventDefault();
    
    // ボタンの非活性化
    setButtonDisabled(true);

    // taxFlg変換
    var isTax = false;
    if (taxFlg === "true") {
      isTax = true;
    }

    //UsersCreate
    try {
      // get uid
      const uid = String(await getUid());

      // headers
      const headers = {'uuid': uid}

      // jsonDataの作成
      var jsonData = {
        uuid: uid,
        nickname: nickname,
        prefecture: prefecture,
        company: company,
        style_flg: styleFlg,
        close_day: Number(closeDay),
        daily_target: Number(dailyTarget),
        monthly_target: Number(monthlyTarget),
        is_tax: isTax,
        open_flg: openFlg,
        is_admin: admin,
      }

      // apiメソッドの呼び出し
      // const resp = await apiVerOne(method.POST, '/users', headers, null, jsonData);
      // console.log("resp", resp);
      await axios({
        method: method.POST,
        url: '/users',
        headers: headers,
        data: jsonData,
        params: null,
      }).then((response) => {
        console.log("data", response.data);
        // ボタンの活性化
        setButtonDisabled(true);
        // ユーザー登録画面への遷移
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }]
        });
      }).catch(error => {
        var errorCode = error.response.data.info.code;
        var message: string[] = [];
        message = errorCodeTransition(errorCode);
        setErrorMessages(message);
        // ボタンの活性化
        setButtonDisabled(true);
      });
      
    } catch (ex: any) {
      console.error("ex", ex);
    }
  }, [nickname, prefecture, company, styleFlg, closeDay, dailyTarget, monthlyTarget, taxFlg]);

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
              <StandardTextInput label="ニックネーム" placeholder="3〜30文字" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setnickname(text)}/>
              <StandardTextInput label="営業区域" placeholder="東京23区武三地区" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setPrefecture(text)}/>
              <StandardTextInput label="所属会社" placeholder="株式会社〇〇" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setCompany(text)}/>
              <StandardLabel displayText={"勤務形態"}/>
              <RadioButton.Group onValueChange={value => setStyleFlg(value)} value={styleFlg}>
                <RadioButton.Item label="隔日勤務" value="every_other_day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="日勤" value="day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="夜勤" value="night" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="他" value="other" style={styles.radioButtonStyle} color={AccentColor}/>
              </RadioButton.Group>
              <StandardTextInput label="締め日(月末の場合は31)" placeholder="15" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setCloseDay(i)}/>
              <StandardTextInput label="目標売上（1日あたり）" placeholder="65000" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setDailyTarget(i)}/>
              <StandardTextInput label="目標売上（1ヶ月あたり）" placeholder="720000" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setMonthlyTarget(i)}/>
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
              <StandardButton displayText="Create Account" disabled={buttonDisabled} onPress={createAccount}/>
              <StandardTextLink displayText="Signin here" onPress={() => moveScreen("Signin")}/>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}

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