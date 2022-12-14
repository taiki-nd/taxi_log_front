import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { deleteUser, reauthenticateWithCredential } from 'firebase/auth';
import { EmailAuthProvider } from 'firebase/auth/react-native';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Provider, Portal, Dialog, Paragraph, Button, RadioButton } from "react-native-paper";
import { auth } from '../auth/firebase';
import { DialogOneButton } from '../components/parts/DialogOneButton';
import { DialogTextInput } from '../components/parts/DialogTextInput';
import { ExtraButton } from '../components/parts/ExtraButton';
import { StandardSpace } from '../components/parts/Space';
import { StandardButton } from '../components/parts/StandardButton';
import { BackColor, BasicColor, CoverColor, SeaColor, TomatoColor } from '../styles/common/color';
import { GetSigninUser } from '../utils/commonFunc/user/GetSigninUser';
import { FuncSignout } from '../utils/commonFunc/user/Signout';
import { method } from '../utils/const';

export const Setting = (props: any) => {
  // props
  const { navigation } = props;

  // state
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');
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

    // ?????????????????????????????????????????????????????????
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
     * ????????????????????????
     */
    useEffect(() => {
      if (int_pattern.test(String(closeDay))) {
        setCloseDayMessage('')
      } else {
        setCloseDayMessage('??????????????????????????????????????????????????????1???31????????????????????????????????????')
      
      }
    }, [closeDay])

    useEffect(() => {
      if (int_pattern.test(String(payDay))) {
        setPayDayMessage('')
      } else {
        setPayDayMessage('??????????????????????????????????????????????????????1???31????????????????????????????????????')
      }
    }, [payDay])

    useEffect(() => {
      if (int_pattern.test(String(dailyTarget))) {
        setDailyTargetMessage('')
      } else {
        setDailyTargetMessage('???????????????????????????????????????????????????????????????0??????????????????????????????????????????')
      }
    }, [dailyTarget])

    useEffect(() => {
      if (int_pattern.test(String(monthlyTarget))) {
        setMonthlyTargetMessage('')
      } else {
        setMonthlyTargetMessage('???????????????????????????????????????????????????????????????0??????????????????????????????????????????')
      }
    }, [monthlyTarget])

    
  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem("taxi_log_user_id")
      console.log("id ????????????????????????", id)
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

      const user = auth.currentUser;
      const uid = user?.uid;
      setUid(String(uid));
      
      const headers = {'id': String(id)}
      const params = {'id': id}

      // user????????????
      const user_info = axios({
        method: method.GET,
        url: `/users/${id}`,
        headers: headers,
        data: null,
        params: params,
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
    })();
  }, [])

  /**
   * funcSignout
   * ????????????????????????
   */
  const funcSignout = () => {
    FuncSignout(props);
  }

  /**
   * deleteAccountConfirm
   * ??????????????????????????????????????????
   */
  const deleteAccountConfirm = () => {
    setVisibleConfirmDeleteDialog(true);
  }

  /**
   * cancelDeleteAccount
   * ????????????????????????????????????
   */
  const cancelDeleteAccount = () => {
    setVisibleConfirmDeleteDialog(false);
  }

  /**
   * deleteAccount
   * ?????????????????????
   */
  const deleteAccount = async () => {
    const user = auth.currentUser;
    const uid = user?.uid;
    var credential
      
    const headers = {'uuid': String(uid)}

    if (user?.email) {
      credential = EmailAuthProvider.credential(user.email, password);
      // firebase???????????????????????????
      reauthenticateWithCredential(user, credential).then(() => {
        deleteUser(user).then(() => {
          console.log('success delete user form firebase:', user.email);
          // user??????
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
      // ?????????????????????????????????????????????
    }
    
  }

  /**
   * openEditAccountDialog
   */
  const openEditAccountDialog = () => {
    setVisibleEditAccountDialog(true);
  }

  return (
    <View style={styles.mainBody}>

      <Text variant="titleLarge" style={styles.subTitle}>Edit Account</Text>
      <StandardButton displayText="Edit Account" onPress={() => navigation.navigate('EditAccount')}/>
      <StandardSpace />

      <Text variant="titleLarge" style={styles.subTitle}>Signout</Text>
      <StandardButton displayText={"SIGNOUT"} onPress={funcSignout}/>
      <StandardSpace />

      <Text variant="titleLarge" style={styles.subTitleExtra}>Delete Account</Text>
      <Text>??????????????????????????????????????????????????????????????????????????????</Text>
      <ExtraButton displayText={"Delete Account"} onPress={() => deleteAccountConfirm()}/>

      <Provider>
        <View>
          <Portal>
            <Dialog visible={visibleConfirmDeleteDialog} onDismiss={() => cancelDeleteAccount()} style={styles.dialog}>
              <Dialog.Title style={styles.text}>???????????????????????????</Dialog.Title>
              <Dialog.Content>
                <Paragraph style={styles.text}>???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</Paragraph>
                <DialogTextInput label="Password" placeholder="Enter password" keyboardType="default" secureTextEntry={true} onChangeText={(text: string) => setPassword(text)}/>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => cancelDeleteAccount()} textColor={SeaColor}>???????????????</Button>
                <Button onPress={() => deleteAccount()} textColor={TomatoColor}>??????</Button>
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