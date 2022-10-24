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

export const Signup2 = () => {
  // state
  const [styleFlg, setStyleFlg] = useState("");
  const [taxFlg, setTaxFlg] = useState(false);


  console.log("styleFlg", styleFlg);
  console.log("taxFlg", taxFlg);

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
              <StandardButton displayText="Create Account"/>
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