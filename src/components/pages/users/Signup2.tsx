import React, { SyntheticEvent, useCallback, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AccentColor, BackColor } from '../../../styles/common/color';
import { StandardButton } from '../../parts/StandardButton';
import { StandardTextInput } from '../../parts/StandardTextInput';
import { getUid } from '../../../auth/firebase';
import {  method } from '../../../utils/const';
import { StandardLabel } from '../../parts/StandardLabel';
import axios from 'axios';

export const Signup2 = () => {
  // state
  const [nickName, setNickname] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [company, setCompany] = useState('');
  const [styleFlg, setStyleFlg] = useState('');
  const [closeDay, setCloseDay] = useState(Number);
  const [dailyTarget, setDailyTarget] = useState(Number);
  const [monthlyTarget, setMonthlyTarget] = useState(Number);
  const [taxFlg, setTaxFlg] = useState('false');
  const [openFlg, setOpenFlg] = useState('close');
  const [admin, setAdmin] = useState(false);

  /**
   * createAccount
   */
  const createAccount = useCallback( async (e: SyntheticEvent) => {
    e.preventDefault();
    console.log('start creating account');

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
        nickname: nickName,
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
      }).catch(error => {
        console.error("error", error.request._response);
      });
      
    } catch (ex: any) {
      console.error("ex", ex);
    }
  }, [nickName, prefecture, company, styleFlg, closeDay, dailyTarget, monthlyTarget, taxFlg]);

  return (
    <View style={styles.mainBody}>
      <View>
        <KeyboardAwareScrollView>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
              <StandardLabel displayText={"ニックネーム"}/>
              <StandardTextInput placeholder="ニックネーム" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setNickname(text)}/>
              <StandardLabel displayText={"営業区域"}/>
              <StandardTextInput placeholder="営業区域" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setPrefecture(text)}/>
              <StandardLabel displayText={"所属会社"}/>
              <StandardTextInput placeholder="所属会社" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setCompany(text)}/>
              <StandardLabel displayText={"勤務形態"}/>
              <RadioButton.Group onValueChange={value => setStyleFlg(value)} value={styleFlg}>
                <RadioButton.Item label="隔日勤務" value="every_other_day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="日勤" value="day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="夜勤" value="night" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="他" value="other" style={styles.radioButtonStyle} color={AccentColor}/>
              </RadioButton.Group>
              <StandardLabel displayText={"締め日（月末の場合は31）"}/>
              <StandardTextInput placeholder="15" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setCloseDay(i)}/>
              <StandardLabel displayText={"目標売上（1日あたり）"}/>
              <StandardTextInput placeholder="65000" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setDailyTarget(i)}/>
              <StandardLabel displayText={"目標売上（1ヶ月あたり）"}/>
              <StandardTextInput placeholder="720000" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setMonthlyTarget(i)}/>
              <StandardLabel displayText={"標準入力価格設定"}/>
              <RadioButton.Group onValueChange={value => setTaxFlg(value)} value={taxFlg}>
                <RadioButton.Item label="税込みで入力" value="true" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="税抜きで入力" value="false" style={styles.radioButtonStyle} color={AccentColor}/>
              </RadioButton.Group>
              {/*errorMessage != '' ? (
                <Text style={styles.errorTextStyle}>
                  {errorMessage}
                </Text>
              ) : null*/}
              <StandardButton displayText="Create Account" onPress={createAccount}/>
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