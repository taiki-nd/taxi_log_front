import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Image, Keyboard } from 'react-native';
import { Text, Provider, Portal, Dialog, Paragraph, Button, RadioButton } from "react-native-paper";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BackColor, BasicColor, TomatoColor } from '../../../styles/common/color';
import { StandardButton } from '../../parts/StandardButton';
import { StandardTextInput } from '../../parts/StandardTextInput';
import { StandardTextLink } from '../../parts/StandardTextLink';
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification, updatePassword } from "firebase/auth";
import { auth } from '../../../auth/firebase';
import { errorCodeTransition, firebaseErrorTransition } from '../../../utils/const';
import { DialogOneButton } from '../../parts/DialogOneButton';
import { StandardSpace } from '../../parts/Space';

export const EditUser = (props: any) => {
  // props
  const { navigation } = props;

  // state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessagesEmail, setErrorMessagesEmail] = useState<string[]>([]);
  const [errorMessagesPassword, setErrorMessagesPassword] = useState<string[]>([]);
  const [errorMessagesNewPassword, setErrorMessagesNewPassword] = useState<string[]>([]);
  const [PasswordButtonDisabled, setPasswordButtonDisabled] = useState(true);
  const [EmailButtonDisabled, setEmailButtonDisabled] = useState(true);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [visibleDialog, setVisibleDialog] = useState(false);

  // 必須項目チェックによるボタン活性化処理
  useEffect(() => {
    var pattern = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;
    if (password !== '') {
      if (email !== '') {
        if (pattern.test(email)) {
          setErrorMessagesEmail(errorCodeTransition([]));
          setEmailButtonDisabled(false);
        } else {
          setErrorMessagesEmail(errorCodeTransition(['invalid_email']));
          setEmailButtonDisabled(true);
        }
      } else {
        setErrorMessagesEmail(errorCodeTransition([]));
        setEmailButtonDisabled(true);
      }

      if (newPassword !== '' && confirmNewPassword !== '') {
        console.log('newPassword !==  && confirmNewPassword !== ')
        if (newPassword === confirmNewPassword) {
          console.log('newPassword === confirmNewPassword')
          setPasswordButtonDisabled(false);
          setErrorMessagesNewPassword(errorCodeTransition([]));
        } else {
          console.log('newPassword === confirmNewPassword else')
          setErrorMessagesNewPassword(errorCodeTransition(['password_not_match']));
          setPasswordButtonDisabled(true);
        }
      } else {
        setErrorMessagesNewPassword(errorCodeTransition([]));
        setPasswordButtonDisabled(true);
      }
    } else {
      setErrorMessagesEmail(errorCodeTransition([]));
      setErrorMessagesNewPassword(errorCodeTransition([]));
      setErrorMessagesPassword(errorCodeTransition(['password_null_error']));
      setEmailButtonDisabled(true);
      setPasswordButtonDisabled(true);
    }
  }, [email, password, newPassword, confirmNewPassword]);

  /*
   * update
   */
  const update = () => {
    console.log('update')
    const user = auth.currentUser;
    if (user?.email) {
      const credential = EmailAuthProvider.credential(user.email, password);
      reauthenticateWithCredential(user, credential).then(() => {
        if (user !== null){
          // メールアドレスの更新
          if (email !== '') {
            updateEmail(user, email).then(() => {
              // Email updated
              setDialogTitle('メールアドレスの更新が完了しました');
              setDialogMessage(`[${email}]に更新されました`);
              setVisibleDialog(true);
            }).catch((error) => {
              console.error('firebase error message:', firebaseErrorTransition(error));
                setErrorMessagesPassword(firebaseErrorTransition(error));
                // ボタンの活性化
                setPasswordButtonDisabled(false);
            });
          }
          // passwordの更新
          if (newPassword !== '' && confirmNewPassword !== '') {
            console.log('パスワード更新処理')
            updatePassword(user, newPassword).then(() =>{
              setDialogTitle('パスワードの更新が完了しました');
              setDialogMessage('更新したパスワードはお忘れにならないようにご注意ください');
              setVisibleDialog(true);
            }).catch((error) =>{
              console.log(error)
              setErrorMessagesPassword(firebaseErrorTransition(error));
            });
          }
        }
      });
    }
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
              <Text variant="titleLarge" style={styles.subTitle}> Enter Password</Text>
              <StandardTextInput label="現在のパスワード (必須)" placeholder="password" keyboardType="default" secureTextEntry={true} onChangeText={(text: string) => setPassword(text)}/>
              {errorMessagesPassword.length != 0 ? (
                errorMessagesPassword.map((errorMessage: string, index: number) => { 
                  return(
                    <Text style={styles.errorTextStyle} key={index}>
                      {errorMessage}
                    </Text>
                  )})
              ) : null}
              <StandardSpace />

              <Text variant="titleLarge" style={styles.subTitle}>Edit Email</Text>
              <StandardTextInput label="新しいメースアドレス" placeholder="abc@abc.com" keyboardType="email-address" secureTextEntry={false} onChangeText={(text: string) => setEmail(text)}/>
              {errorMessagesEmail.length != 0 ? (
                errorMessagesEmail.map((errorMessage: string, index: number) => { 
                  return(
                    <Text style={styles.errorTextStyle} key={index}>
                      {errorMessage}
                    </Text>
                  )})
              ) : null}
              <StandardButton displayText={'更新'} disabled={EmailButtonDisabled} onPress={update}/>

              <StandardSpace />
              <Text variant="titleLarge" style={styles.subTitle}>Edit Password</Text>
              <StandardTextInput label="新しいパスワード" placeholder="new password" keyboardType="default" secureTextEntry={true} onChangeText={(text: string) => setNewPassword(text)}/>
              <StandardTextInput label="新しいパスワード確認用" placeholder="confirm new password" keyboardType="default" secureTextEntry={true} onChangeText={(text: string) => setConfirmNewPassword(text)}/>
              {errorMessagesNewPassword.length != 0 ? (
                errorMessagesNewPassword.map((errorMessage: string, index: number) => { 
                  return(
                    <Text style={styles.errorTextStyle} key={index}>
                      {errorMessage}
                    </Text>
                  )})
              ) : null}
              <StandardButton displayText={'更新'} disabled={PasswordButtonDisabled} onPress={update}/>

              <StandardTextLink displayText="cancel" onPress={() => moveScreen("Setting")}/>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </View>
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
}

const styles = StyleSheet.create({
  mainBody: {
    padding: '3%',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: BackColor,
    alignContent: 'center',
  },
  logo: {
    resizeMode: 'contain',
    width: 300,
    height: 200,
  },
  errorTextStyle: {
    color: TomatoColor,
    textAlign: 'center',
    fontSize: 14,
  },
  subTitle: {
    color: BasicColor,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});