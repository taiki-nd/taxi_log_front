import axios from 'axios';
import { deleteUser, reauthenticateWithCredential } from 'firebase/auth';
import { EmailAuthProvider } from 'firebase/auth/react-native';
import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Provider, Portal, Dialog, Paragraph, Button, RadioButton } from "react-native-paper";
import { auth } from '../auth/firebase';
import { DialogOneButton } from '../components/parts/DialogOneButton';
import { DialogTextInput } from '../components/parts/DialogTextInput';
import { ExtraButton } from '../components/parts/ExtraButton';
import { StandardSpace } from '../components/parts/Space';
import { StandardButton } from '../components/parts/StandardButton';
import { StandardLabel } from '../components/parts/StandardLabel';
import { AccentColor, BackColor, BasicColor, CoverColor, SeaColor, TomatoColor } from '../styles/common/color';
import { FuncSignout } from '../utils/commonFunc/user/Signout';
import { errorCodeTransition, method } from '../utils/const';

export const Setting = (props: any) => {
  // props
  const { navigation } = props;

  // state
  const [password, setPassword] = useState('');
  const [uid, setUid] = useState('');
  const [userId, setUserId] = useState(Number);
  const [nickname, setNickname] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [company, setCompany] = useState('');
  const [styleFlg, setStyleFlg] = useState('');
  const [closeDay, setCloseDay] = useState(Number);
  const [payDay, setPayDay] = useState(Number);
  const [dailyTarget, setDailyTarget] = useState(Number);
  const [monthlyTarget, setMonthlyTarget] = useState(Number);
  const [taxFlg, setTaxFlg] = useState('');
  const [openFlg, setOpenFlg] = useState('');
  const [admin, setAdmin] = useState(false);
  const [closeDayMessage, setCloseDayMessage] = useState('');
  const [payDayMessage, setPayDayMessage] = useState('');
  const [dailyTargetMessage, setDailyTargetMessage] = useState('');
  const [monthlyTargetMessage, setMonthlyTargetMessage] = useState('');
  const [visibleEditAccountDialog, setVisibleEditAccountDialog] = useState(false);
  const [visibleConfirmDeleteDialog, setVisibleConfirmDeleteDialog] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  var int_pattern = /^([1-9]\d*|0)$/

    // 必須項目チェックによるボタン活性化処理
    useEffect(() => {
      if (nickname !== ''
        && prefecture !== ''
        && company !== ''
        && styleFlg !== ''
        && closeDay !== 0
        && payDay !== 0) {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
      }
    }, [nickname, prefecture, company, styleFlg, closeDay, payDay]);

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

    
  useEffect(() => {
    const user = auth.currentUser;
    const uid = user?.uid;
    setUid(String(uid));
    const headers = {'uuid': String(uid)}

    // user情報取得
    const user_info = axios({
      method: method.GET,
      url: 'user/get_user_form_uid',
      headers: headers,
      data: null,
      params: null,
    }).then((response) => {
      var user = response.data.data
      console.log("user", user);
      setUserId(user.id);
      setNickname(user.nickname);
      setPrefecture(user.prefecture);
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
  }, [])

  /**
   * funcSignout
   * サインアウト処理
   */
  const funcSignout = () => {
    FuncSignout(props);
  }

  /**
   * deleteAccountConfirm
   * アカウント削除確認ダイアログ
   */
  const deleteAccountConfirm = () => {
    setVisibleConfirmDeleteDialog(true);
  }

  /**
   * cancelDeleteAccount
   * キャンセルアカウント削除
   */
  const cancelDeleteAccount = () => {
    setVisibleConfirmDeleteDialog(false);
  }

  /**
   * deleteAccount
   * アカウント削除
   */
  const deleteAccount = async () => {
    const user = auth.currentUser;
    const uid = user?.uid;
    var credential
      
    const headers = {'uuid': String(uid)}

    if (user?.email) {
      credential = EmailAuthProvider.credential(user.email, password);
      // firebaseアカウントの再認証
      reauthenticateWithCredential(user, credential).then(() => {
        deleteUser(user).then(() => {
          console.log('success delete user form firebase:', user.email);
          // user削除
          var params = {
            user_id: userId
          }
          axios({
            method: method.DELETE,
            url: `users/${userId}`,
            headers: headers,
            data: null,
            params: params,
          }).then((response) => {
            console.log("success delete user from server:", nickname);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }]
            });
          }).catch(error => {
            console.error("server user error", error);
            return "error";
          });
        }).catch((error) => {
          console.error("firebase user error", error);
          // An error ocurred
          // ...
        });
      }).catch((error) => {
        // An error ocurred
        // ...
      });

      
    } else {
      // todo
      // サインイン処理を再度実行させる
    }
    
  }

  /**
   * openEditAccountDialog
   */
  const openEditAccountDialog = () => {
    setVisibleEditAccountDialog(true);
  }

  /**
   * updateAccount
   */
  const updateAccount = () => {
    // headers
    const headers = {'uuid': uid}

    // params
    const params = {
      user_id: userId
    }

    // taxFlg変換
    var isTax = false;
    if (taxFlg === "true") {
      isTax = true;
    }

    const jsonData ={
      uuid: uid,
      nickname: nickname,
      prefecture: prefecture,
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

    axios({
      method: method.PUT,
      url: `users/${userId}`,
      headers: headers,
      data: jsonData,
      params: params,
    }).then((response) => {
      console.log('data', response.data.data);
      setVisibleEditAccountDialog(false);
      setDialogTitle('アカウント更新成功')
      setDialogMessage('アカウントの更新に成功しました。')
      setVisibleDialog(true);
    }).catch((error) => {
      console.error(error)
      var errorCode = error.response.data.info.code;
      var message: string[] = [];
      message = errorCodeTransition(errorCode);
      setErrorMessages(message);
    })
  }

  /**
   * cancelEditAccount
   */
  const cancelEditAccount = () => {
    setVisibleEditAccountDialog(false);
  }

  return (
    <View style={styles.mainBody}>
      
      <Text variant="titleLarge" style={styles.subTitle}>Edit Account</Text>
      <StandardButton displayText="Edit Account" onPress={() => openEditAccountDialog()}/>
      <StandardSpace />

      <Text variant="titleLarge" style={styles.subTitle}>Signout</Text>
      <StandardButton displayText={"SIGNOUT"} onPress={funcSignout}/>
      <StandardSpace />

      <Text variant="titleLarge" style={styles.subTitleExtra}>Delete Account</Text>
      <Text>一度アカウントを削除するとデータの復元はできません。</Text>
      <ExtraButton displayText={"Delete Account"} onPress={() => deleteAccountConfirm()}/>

      <Provider>
        <View>
          <Portal>
            <Dialog visible={visibleEditAccountDialog} style={styles.updateAccountDialog} onDismiss={() => cancelEditAccount()}>
              <Dialog.Title>Edit Account</Dialog.Title>
              <ScrollView>
                <Dialog.Content>
                  <DialogTextInput defaultValue={nickname} label="ニックネーム" placeholder="3〜30文字" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setNickname(text)}/>
                  <DialogTextInput defaultValue={prefecture} label="営業区域" placeholder="東京23区武三地区" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setPrefecture(text)}/>
                  <DialogTextInput defaultValue={company} label="所属会社" placeholder="株式会社〇〇" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setCompany(text)}/>
                  <StandardLabel displayText={"勤務形態"}/>
                  <RadioButton.Group onValueChange={value => setStyleFlg(value)} value={styleFlg}>
                    <RadioButton.Item label="隔日勤務" value="every_other_day" style={styles.radioButtonStyle} color={AccentColor}/>
                    <RadioButton.Item label="日勤" value="day" style={styles.radioButtonStyle} color={AccentColor}/>
                    <RadioButton.Item label="夜勤" value="night" style={styles.radioButtonStyle} color={AccentColor}/>
                    <RadioButton.Item label="他" value="other" style={styles.radioButtonStyle} color={AccentColor}/>
                  </RadioButton.Group>
                  <DialogTextInput defaultValue={String(closeDay)} label="締め日(月末の場合は31)" placeholder="15" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setCloseDay(i)}/>
                  {
                    closeDayMessage !== '' ? <Text style={styles.dialogWarn}>{closeDayMessage}</Text> : <View></View>
                  }
                  <DialogTextInput defaultValue={String(payDay)} label="給与日(月末の場合は31)" placeholder="15" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setPayDay(i)}/>
                  <Text style={styles.mentionText}>* 月次売上関連のグラフ作成に必要なため</Text>
                  {
                    payDayMessage !== '' ? <Text style={styles.dialogWarn}>{payDayMessage}</Text> : <View></View>
                  }
                  <DialogTextInput defaultValue={String(dailyTarget)} label="目標売上（1日あたり）" placeholder="65000" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setDailyTarget(i)}/>
                  {
                    dailyTargetMessage !== '' ? <Text style={styles.dialogWarn}>{dailyTargetMessage}</Text> : <View></View>
                  }
                  <DialogTextInput defaultValue={String(monthlyTarget)} label="目標売上（1ヶ月あたり）" placeholder="720000" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setMonthlyTarget(i)}/>
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
                  <Button onPress={() => updateAccount()} textColor={SeaColor}>Update Account</Button>
                  <Button onPress={() => cancelEditAccount()} textColor={TomatoColor}>cancel</Button>
                </Dialog.Content>
              </ScrollView>
            </Dialog>
            <Dialog visible={visibleConfirmDeleteDialog} onDismiss={() => cancelDeleteAccount()} style={styles.dialog}>
              <Dialog.Title style={styles.text}>アカウント削除確認</Dialog.Title>
              <Dialog.Content>
                <Paragraph style={styles.text}>アカウント削除により作成したデータは全て削除され、復元はできません。削除しますか？</Paragraph>
                <DialogTextInput label="Password" placeholder="Enter password" keyboardType="default" secureTextEntry={true} onChangeText={(text: string) => setPassword(text)}/>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => cancelDeleteAccount()} textColor={SeaColor}>キャンセル</Button>
                <Button onPress={() => deleteAccount()} textColor={TomatoColor}>削除</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </Provider>
      <DialogOneButton
        title={dialogTitle}
        description={dialogMessage}
        displayButton1="OK"
        visible={visibleDialog}
        funcButton1={() => setVisibleDialog(false)}
        onDismiss={() => setVisibleDialog(false)}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  mainBody: {
    padding: '3%',
    flex: 1,
    backgroundColor: BackColor,
    alignContent: 'center',
  },
  subTitle: {
    color: BasicColor,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  subTitleExtra: {
    color: TomatoColor,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  text :{
    color: BasicColor,
  },
  dialog: {
    backgroundColor: CoverColor,
  },
  updateAccountDialog: {
    height: '70%',
    backgroundColor: CoverColor,
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
  }
});