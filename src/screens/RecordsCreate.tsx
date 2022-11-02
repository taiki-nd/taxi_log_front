import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { RadioButton } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StandardTextInput } from '../components/parts/StandardTextInput';
import { StandardLabel } from '../components/parts/StandardLabel';
import { StandardButton } from '../components/parts/StandardButton';
import { StandardTextLink } from '../components/parts/StandardTextLink';
import { AccentColor, BackColor, BasicColor } from '../styles/common/color';
import moment from 'moment';

export const RecordsCreate = (props: any) => {
  // props
  const { navigation } = props;

  // state
  const [date, setDate] = useState(moment);
  const [day, setDay] = useState('');
  const [styleFlg, setStyleFlg] = useState('');
  const [startHour, setStartHour] = useState(Number);
  const [runningTime, setRunningTime] = useState(Number);
  const [occupancyRate, setOccupancyRate] = useState(Number);
  const [numberOfTime, setNumberOfTime] = useState(Number);
  const [isTax, setIsTax] = useState(Boolean);
  const [dailySales, setDailySales] = useState(Number);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // 必須項目チェックによるボタン活性化処理
  useEffect(() => {
    if (date !== undefined
      && day !== ''
      && styleFlg !== ''
      && startHour !== undefined
      && runningTime !== undefined
      && occupancyRate !== undefined
      && numberOfTime !== undefined
      && dailySales !== 0){
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [date, day, styleFlg, startHour, runningTime, occupancyRate, numberOfTime]);

  const createRecord = () => {
    console.log("pressed createRecord button");
  }

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
                  console.log(value);
                }}
              />
              <StandardLabel displayText={"曜日"}/>
              <RadioButton.Group onValueChange={value => setDay(value)} value={day}>
                <RadioButton.Item label="月" value="every_other_day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="火" value="day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="水" value="night" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="木" value="other" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="金" value="other" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="土" value="other" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="日" value="other" style={styles.radioButtonStyle} color={AccentColor}/>
              </RadioButton.Group>
              <StandardLabel displayText={"勤務形態"}/>
              <RadioButton.Group onValueChange={value => setStyleFlg(value)} value={styleFlg}>
                <RadioButton.Item label="隔日勤務" value="every_other_day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="日勤" value="day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="夜勤" value="night" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="他" value="other" style={styles.radioButtonStyle} color={AccentColor}/>
              </RadioButton.Group>
              <StandardTextInput label="始業開始時刻" placeholder="15" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setStartHour(i)}/>
              <StandardTextInput label="走行時間" placeholder="17" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setRunningTime(i)}/>
              <StandardTextInput label="乗車率" placeholder="55" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setOccupancyRate(i)}/>
              <StandardTextInput label="乗車回数" placeholder="38" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setNumberOfTime(i)}/>
              <StandardTextInput label="売上" placeholder="58000" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setDailySales(i)}/>
              
              {/*errorMessages.length != 0 ? (
                errorMessages.map((errorMessage: string, index: number) => { 
                  return(
                    <Text style={styles.errorTextStyle} key={index}>
                      {errorMessage}
                    </Text>
                  )})
                  ) : null*/}
              <StandardButton displayText="Create Record" disabled={buttonDisabled} onPress={createRecord}/>
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
});