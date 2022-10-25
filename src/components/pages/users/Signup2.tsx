import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AccentColor, BackColor, BasicColor } from '../../../styles/common/color';
import { StandardButton } from '../../parts/StandardButton';
import { StandardTextInput } from '../../parts/StandardTextInput';
import { StandardTextLink } from '../../parts/StandardTextLink';
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from '../../../auth/firebase';
import { errorCode, firebaseErrorTransition } from '../../../utils/const';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StandardLabel } from '../../parts/StandardLabel';
import { async } from '@firebase/util';
import axios from 'axios';
import { usePinInputDescendantsContext } from '@chakra-ui/react';

export const Signup2 = () => {
  // state
  const [nickName, setNickname] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [company, setCompany] = useState("");
  const [styleFlg, setStyleFlg] = useState("");
  const [closeDay, setCloseDay] = useState("");
  const [dailyTarget, setDailyTarget] = useState(0);
  const [monthlyTarget, setMonthlyTarget] = useState(0);
  const [taxFlg, setTaxFlg] = useState("false");
  const [openFlg, setOpenFlg] = useState("close");
  const [admin, setAdmin] = useState(false);

  /**
   * createAccount
   */
  const createAccount = useCallback( async (e: SyntheticEvent) => {
    e.preventDefault();
    console.log('start creating account');

    // headerの作成
    var header = {
      uuid: AsyncStorage.getItem("uid"),
    }

    // taxFlg変換
    var isTax = false;
    if (taxFlg === "true") {
      isTax = true;
    }

    // jsonDataの作成
    var jsonData = {
      uuid: AsyncStorage.getItem("uid"),
      nickname: nickName,
      prefecture: prefecture,
      company: company,
      style_flg: styleFlg,
      close_day: closeDay,
      daily_target: dailyTarget,
      monthly_target: monthlyTarget,
      is_tax: isTax,
      open_flg: openFlg,
      is_admin: admin,
    }

    //UsersCreate
    try {
      console.log("try to create user");
      await axios({
        method: 'post',
        url: 'http://10.0.2.2:5050/api/v1/users',
        data: jsonData,
      }).then((response) => {
        console.log(response.data);
      }).catch(error => console.log(error));
    } catch (ex: any) {
      console.error("ex", ex);
    }
  }, [])

  return (
    <View style={styles.mainBody}>
      <View>
        <KeyboardAwareScrollView>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
              <StandardLabel displayText={"ニックネーム"}/>
              <StandardTextInput placeholder="ニックネーム" keyboardType="default" secureTextEntry={false}/>
              <StandardLabel displayText={"営業区域"}/>
              <StandardTextInput placeholder="営業区域" keyboardType="default" secureTextEntry={false}/>
              <StandardLabel displayText={"所属会社"}/>
              <StandardTextInput placeholder="所属会社" keyboardType="default" secureTextEntry={false}/>
              <StandardLabel displayText={"勤務形態"}/>
              <RadioButton.Group onValueChange={value => setStyleFlg(value)} value={styleFlg}>
                <RadioButton.Item label="隔日勤務" value="every_other_day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="日勤" value="day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="夜勤" value="night" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="他" value="other" style={styles.radioButtonStyle} color={AccentColor}/>
              </RadioButton.Group>
              <StandardLabel displayText={"締め日（月末の場合は31）"}/>
              <StandardTextInput placeholder="15" keyboardType="default" secureTextEntry={false}/>
              <StandardLabel displayText={"目標売上（1日あたり）"}/>
              <StandardTextInput placeholder="65000" keyboardType="default" secureTextEntry={false}/>
              <StandardLabel displayText={"目標売上（1ヶ月あたり）"}/>
              <StandardTextInput placeholder="720000" keyboardType="default" secureTextEntry={false}/>
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