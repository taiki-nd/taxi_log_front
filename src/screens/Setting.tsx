import { deleteUser, reauthenticateWithCredential } from 'firebase/auth';
import { EmailAuthProvider } from 'firebase/auth/react-native';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Provider, Portal, Dialog, Paragraph, Button } from "react-native-paper";
import { auth } from '../auth/firebase';
import { DialogTextInput } from '../components/parts/DialogTextInput';
import { DialogTwoButton } from '../components/parts/DialogTwoButton';
import { ExtraButton } from '../components/parts/ExtraButton';
import { StandardButton } from '../components/parts/StandardButton';
import { StandardTextInput } from '../components/parts/StandardTextInput';
import { BackColor, BasicColor, CoverColor, SeaColor, TomatoColor } from '../styles/common/color';
import { FuncSignout } from '../utils/commonFunc/user/Signout';

export const Setting = (props: any) => {

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
  const deleteAccount = () => {
    const user = auth.currentUser;
    const uid = user?.uid;
    var credential
    if (user?.email) {
      credential = EmailAuthProvider.credential(user.email, password);
      // firebaseアカウントの再認証
      reauthenticateWithCredential(user, credential).then(() => {
        deleteUser(user).then(() => {
          // サーバーサイドのユーザー削除処理
          // user情報の取得
          
        }).catch((error) => {
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
      <StandardButton displayText={"SIGNOUT"} onPress={funcSignout}/>
      <Text variant="titleLarge" style={styles.subTitleExtra}>Delete Account</Text>
      <Text>一度アカウントを削除するとデータの復元はできません。</Text>
      <ExtraButton displayText={"Delete Account"} onPress={() => deleteAccountConfirm()}/>
      <StandardButton displayText={"SIGNUP2"} onPress={() => {props.navigation.navigate('Signup2')}}/>
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