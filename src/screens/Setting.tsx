import axios from 'axios';
import { deleteUser, reauthenticateWithCredential } from 'firebase/auth';
import { EmailAuthProvider } from 'firebase/auth/react-native';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Provider, Portal, Dialog, Paragraph, Button } from "react-native-paper";
import { auth } from '../auth/firebase';
import { DialogTextInput } from '../components/parts/DialogTextInput';
import { ExtraButton } from '../components/parts/ExtraButton';
import { StandardSpace } from '../components/parts/Space';
import { StandardButton } from '../components/parts/StandardButton';
import { BackColor, BasicColor, CoverColor, SeaColor, TomatoColor } from '../styles/common/color';
import { FuncSignout } from '../utils/commonFunc/user/Signout';
import { method } from '../utils/const';

export const Setting = (props: any) => {
  // props
  const { navigation } = props;

  // state
  const [password, setPassword] = useState('');
  const [visibleConfirmDeleteDialog, setVisibleConfirmDeleteDialog] = useState(false);

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
    // user情報取得
    const user_info = await axios({
      method: method.GET,
      url: 'user/get_user_form_uid',
      headers: headers,
      data: null,
      params: null,
    }).then((response) => {
      var user = response.data.data
      console.log("user", user);
      return user;
    }).catch(error => {
      console.error("error", error);
      return "error";
    });

    if (user?.email) {
      credential = EmailAuthProvider.credential(user.email, password);
      // firebaseアカウントの再認証
      reauthenticateWithCredential(user, credential).then(() => {
        deleteUser(user).then(() => {
          console.log('success delete user form firebase:', user.email);
          // user削除
          console.log('user_id', user_info.id)
          var params = {
            user_id: user_info.id
          }
          axios({
            method: method.DELETE,
            url: `users/${user_info.id}`,
            headers: headers,
            data: null,
            params: params,
          }).then((response) => {
            console.log("success delete user from server:", user_info.nickname);
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

  return (
    <View style={styles.mainBody}>
      
      <Text variant="titleLarge" style={styles.subTitle}>アカウント情報編集</Text>
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
  }
});