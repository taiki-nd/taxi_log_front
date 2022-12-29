import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { Button, Dialog, Paragraph, Portal, Provider, RadioButton } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AccentColor, BackColor, BasicColor, CoverColor, SeaColor, TomatoColor } from '../../../styles/common/color';
import { StandardButton } from '../../parts/StandardButton';
import { StandardTextInput } from '../../parts/StandardTextInput';
import { auth, getUid } from '../../../auth/firebase';
import {  errorCodeTransition, method } from '../../../utils/const';
import { StandardLabel } from '../../parts/StandardLabel';
import axios from 'axios';
import { StandardTextLink } from '../../parts/StandardTextLink';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetSigninUser } from '../../../utils/commonFunc/user/GetSigninUser';

export const EditAccount = (props: any) => {
  // props
  const { navigation } = props;

  // state
  const [userId, setUserId] = useState(Number);
  const [id, setId] = useState('');
  const [uid, setUid] = useState('');
  const [nickname, setNickname] = useState('');
  const [prefecture, setPrefecture] = useState('都道府県');
  const [area, setArea] = useState('営業区域');
  const [company, setCompany] = useState('');
  const [styleFlg, setStyleFlg] = useState('');
  const [closeDay, setCloseDay] = useState(Number);
  const [payDay, setPayDay] = useState(Number);
  const [dailyTarget, setDailyTarget] = useState(Number);
  const [monthlyTarget, setMonthlyTarget] = useState(Number);
  const [taxFlg, setTaxFlg] = useState('false');
  const [openFlg, setOpenFlg] = useState('close');
  const [admin, setAdmin] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [visibleCompleteDialog, setVisibleCompleteDialog] = useState(false);
  const [visibleFailedDialog, setVisibleFailedDialog] = useState(false);
  const [closeDayMessage, setCloseDayMessage] = useState('');
  const [payDayMessage, setPayDayMessage] = useState('');
  const [dailyTargetMessage, setDailyTargetMessage] = useState('');
  const [monthlyTargetMessage, setMonthlyTargetMessage] = useState('');

  const [prefectures, setPrefectures] = useState<any[]>([])
  const [visiblePrefectureDialog, setVisiblePrefectureDialog] = useState(false);

  const [visibleAreaDialog, setVisibleAreaDialog] = useState(false);
  const [areas, setAreas] = useState<any[]>([])
  const [areaDisabled, setAreaDisabled] = useState(true);

  var int_pattern = /^([1-9]\d*|0)$/

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
      setPrefectures([
        "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
        "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
        "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
        "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
        "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
        "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
        "熊本県","大分県","宮崎県","鹿児島県","沖縄県"
      ])

      const user = auth.currentUser;
      const uid = user?.uid;
      setUid(String(uid));
      // headers
      const headers = {'id': String(id)}
      // params
      const params = {'id': id}

      // user情報取得
      const user_info = axios({
        method: method.GET,
        url: `users/${id}`,
        headers: headers,
        data: null,
        params: params,
      }).then((response) => {
        var user = response.data.data
        console.log("user", user);
        setUserId(user.id);
        setNickname(user.nickname);
        setPrefecture(user.prefecture);
        setArea(user.area);
        setCompany(user.company);
        setStyleFlg(String(user.style_flg));
        setCloseDay(user.close_day);
        setPayDay(user.pay_day);
        setDailyTarget(user.daily_target);
        setMonthlyTarget(user.monthly_target);
        setTaxFlg(String(user.is_tax));
        setOpenFlg(user.open_flg);
        setAdmin(user.admin)
        return user;
      }).catch(error => {
        console.error("error", error);
        return "error";
      });
    })();
  }, []);

  // 必須項目チェックによるボタン活性化処理
  useEffect(() => {
    if (nickname !== ''
      && prefecture !== ''
      && prefecture !== '都道府県'
      && area !== ''
      && area !== '営業区域'
      && company !== ''
      && styleFlg !== ''
      && closeDay !== 0
      && payDay !== 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [nickname, prefecture, area, company, styleFlg, closeDay, payDay]);

  /**
   * 小数入力時の対応
   */
  useEffect(() => {
    if (int_pattern.test(String(closeDay))) {
      setCloseDayMessage('')
    } else {
      setCloseDayMessage('締め日に無効な値が入力されています。1〜31の整数を入力して下さい。')
    
    }
  }, [closeDay])

  useEffect(() => {
    if (int_pattern.test(String(payDay))) {
      setPayDayMessage('')
    } else {
      setPayDayMessage('給与日に無効な値が入力されています。1〜31の整数を入力して下さい。')
    }
  }, [payDay])

  useEffect(() => {
    if (int_pattern.test(String(dailyTarget))) {
      setDailyTargetMessage('')
    } else {
      setDailyTargetMessage('日額売上目標に無効な値が入力されています。0以上の整数を入力して下さい。')
    }
  }, [dailyTarget])

  useEffect(() => {
    if (int_pattern.test(String(monthlyTarget))) {
      setMonthlyTargetMessage('')
    } else {
      setMonthlyTargetMessage('月額売上目標に無効な値が入力されています。0以上の整数を入力して下さい。')
    }
  }, [monthlyTarget])

  useEffect(() =>{
    if (prefecture !== '都道府県') {
      setAreaDisabled(false);
      // 営業区域のリセット処理
      setArea('営業区域')
    } else {
      setAreaDisabled(true);
    }
  }, [prefecture]);

  /**
   * selectPrefecture
   */
  const selectPrefecture = (value: string) => {
    setPrefecture(value);

    // 営業区域選択肢の取得
    const params = {prefecture: value}
    axios({
      method: method.GET,
      url: '/areas',
      data: null,
      params: params,
    }).then((response) => {
      console.log("data", response.data);
      setAreas(response.data.data);
      // 都道府県選択ダイアログ閉じる
      setVisiblePrefectureDialog(false);
    }).catch(error => {
      var errorCode = error.response.data.info.code;
      var message: string[] = [];
      message = errorCodeTransition(errorCode);
      setErrorMessages(message);
    });
  }

  /**
   * selectArea
   */
  const selectArea = (value: string) => {
    setArea(value);
    setVisibleAreaDialog(false);
  }

  /**
   * updateAccount
   */
  const updateAccount = useCallback( async (e: SyntheticEvent) => {
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
      const headers = {'id': id}

      // params
      const params = {
        user_id: userId
      }

      // taxFlg変換
      var isTax = false;
      if (taxFlg === "true") {
        isTax = true;
      }

      // jsonDataの作成
      var jsonData = {
        uuid: uid,
        nickname: nickname,
        prefecture: prefecture,
        area: area,
        company: company,
        style_flg: styleFlg,
        pay_day: Number(payDay),
        close_day: Number(closeDay),
        daily_target: Number(dailyTarget),
        monthly_target: Number(monthlyTarget),
        is_tax: isTax,
        open_flg: openFlg,
        is_admin: admin,
      }

      // apiメソッドの呼び出し
      await axios({
        method: method.PUT,
        url: `users/${userId}`,
        headers: headers,
        data: jsonData,
        params: params,
      }).then((response) => {
        console.log("data", response.data);
        // ボタンの活性化
        setButtonDisabled(true);
        // 設定への遷移
        navigation.reset({
          index: 0,
          routes: [{ name: 'Setting' }]
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
  }, [nickname, prefecture, area, company, styleFlg, closeDay, dailyTarget, monthlyTarget, taxFlg]);

  return (
    <View style={styles.mainBody}>
      <View>
        <KeyboardAwareScrollView>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
              <StandardTextInput defaultValue={nickname} label="ニックネーム" placeholder="3〜30文字" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setNickname(text)}/>
              
              <StandardLabel displayText={"営業区域"}/>
              <ScrollView style={styles.flex} horizontal={true}>
                <StandardButton displayText={prefecture} onPress={() => setVisiblePrefectureDialog(true)} />
                <StandardButton displayText={area} onPress={() => setVisibleAreaDialog(true)} disabled={areaDisabled}/>
              </ScrollView>

              <StandardTextInput defaultValue={company} label="所属会社" placeholder="株式会社〇〇" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setCompany(text)}/>
              <StandardLabel displayText={"勤務形態"}/>
              <RadioButton.Group onValueChange={value => setStyleFlg(value)} value={styleFlg}>
                <RadioButton.Item label="隔日勤務" value="every_other_day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="日勤" value="day" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="夜勤" value="night" style={styles.radioButtonStyle} color={AccentColor}/>
                <RadioButton.Item label="他" value="other" style={styles.radioButtonStyle} color={AccentColor}/>
              </RadioButton.Group>
              <StandardTextInput defaultValue={String(closeDay)} label="締め日(月末の場合は31)" placeholder="15" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setCloseDay(i)}/>
              {
                closeDayMessage !== '' ? <Text style={styles.dialogWarn}>{closeDayMessage}</Text> : <View></View>
              }
              <StandardTextInput defaultValue={String(payDay)} label="給与日(月末の場合は31)" placeholder="15" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setPayDay(i)}/>
              <Text style={styles.mentionText}>* 月次売上関連のグラフ作成に必要なため</Text>
              {
                payDayMessage !== '' ? <Text style={styles.dialogWarn}>{payDayMessage}</Text> : <View></View>
              }
              <StandardTextInput defaultValue={String(dailyTarget)} label="目標売上（1日あたり）" placeholder="65000" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setDailyTarget(i)}/>
              {
                dailyTargetMessage !== '' ? <Text style={styles.dialogWarn}>{dailyTargetMessage}</Text> : <View></View>
              }
              <StandardTextInput defaultValue={String(monthlyTarget)} label="目標売上（1ヶ月あたり）" placeholder="720000" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setMonthlyTarget(i)}/>
              {
                monthlyTargetMessage !== '' ? <Text style={styles.dialogWarn}>{monthlyTargetMessage}</Text> : <View></View>
              }
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
              <StandardButton displayText="Update Account" disabled={buttonDisabled} onPress={updateAccount}/>
              <StandardTextLink displayText="Cancel" onPress={() => navigation.navigate('Setting')}/>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
        <Provider>
          <Portal>
            <Dialog visible={visiblePrefectureDialog} onDismiss={() => setVisiblePrefectureDialog(false)} style={styles.radioDialog}>
              <Dialog.Title style={styles.text}>都道府県選択</Dialog.Title>
              <ScrollView>
                <Dialog.Content>
                  <Paragraph style={styles.text}>都道府県を選択してください</Paragraph>
                  <RadioButton.Group onValueChange={(value) => selectPrefecture(value)} value={prefecture}>
                    {
                      prefectures.map((prefecture, index) => {
                        return (
                          <RadioButton.Item key={index} label={prefecture} value={prefecture} style={styles.radioButtonStyle} color={AccentColor}/>
                        )
                      })
                    }
                  </RadioButton.Group>
                </Dialog.Content>
              </ScrollView>
              <Dialog.Actions>
                <Button onPress={() => setVisiblePrefectureDialog(false)} textColor={SeaColor}>閉じる</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <Portal>
            <Dialog visible={visibleAreaDialog} onDismiss={() => setVisibleAreaDialog(false)} style={styles.radioDialog}>
              <Dialog.Title style={styles.text}>営業区域選択</Dialog.Title>
              <ScrollView>
                <Dialog.Content>
                  <Paragraph style={styles.text}>営業区域選択を選択してください</Paragraph>
                    <RadioButton.Group onValueChange={(value) => selectArea(value)} value={area}>
                      {
                        areas.map((area, index) => {
                          return (
                            <RadioButton.Item key={index} label={area} value={area} style={styles.radioButtonStyle} color={AccentColor}/>
                          )
                        })
                      }
                    </RadioButton.Group>
                </Dialog.Content>
              </ScrollView>
              <Dialog.Actions>
                <Button onPress={() => setVisibleAreaDialog(false)} textColor={SeaColor}>閉じる</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </Provider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    padding: '3%',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: BackColor,
    alignContent: 'center',
  },
  flex: {
    flexDirection: 'row',
  },
  radioButtonStyle: {
    marginLeft: 35,
    marginRight: 35,
  },
  mentionText:{
    marginLeft: 70,
    fontSize: 10,
    color: TomatoColor
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
  },
  radioDialog: {
    height: '80%',
    backgroundColor: CoverColor,
  },
  text :{
    color: BasicColor,
  },
  dialog: {
    backgroundColor: CoverColor,
  }
});
