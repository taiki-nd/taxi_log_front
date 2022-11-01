import { sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { auth } from "../../../auth/firebase";
import { BackColor } from "../../../styles/common/color";
import { FuncDeleteUser } from "../../../utils/commonFunc/user/DeleteUser";
import { FuncSignout } from "../../../utils/commonFunc/user/Signout";
import { DialogOneButton } from "../../parts/DialogOneButton";
import { DialogTwoButton } from "../../parts/DialogTwoButton";

export const SignupEmail = (props: any) => {
  const { navigation } = props;
  // state
  const [visibleCompleteDialog, setVisibleCompleteDialog] = useState(false);
  const [visibleFailedDialog, setVisibleFailedDialog] = useState(false);

  useEffect(() => {
    funcEmailVerification();
  }, []);

  // メールアドレス認証
  const funcEmailVerification = async () => {
    var currentUser = auth.currentUser;
    if (currentUser !== null && !currentUser.emailVerified) {
      try {
        await sendEmailVerification(currentUser)
          .then(() => {
            // Dialogの表示
            setVisibleCompleteDialog(true);
          })
          .catch((error) => {
            console.error(error);
            setVisibleCompleteDialog(false);
            // failedDialogの表示
            setVisibleFailedDialog(true);
            // user削除処理
            FuncDeleteUser();
          })
      } catch (ex: any) {
        setVisibleCompleteDialog(false);
        // failedDialogの表示
        setVisibleFailedDialog(true);
        // user削除処理
        FuncDeleteUser();
      }
    } else {
      // noting to do
    }
  }

  /**
   * dialogComplete
   * ダイアログの完了ボタンの押下
   */
  const dialogComplete = () => {
    setVisibleCompleteDialog(false);
    // signout処理
    FuncSignout(props);
  }

  /**
   * dialogCancel
   * ダイアログのアカウント作成中止の押下
   */
  const dialogCancel = () => {
    FuncDeleteUser();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Signup' }]
    });
  }

  /**
   * dialogOk
   * ダイアログのOKボタンの押下
   */
  const dialogOk = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Signup' }]
    });
  }

  return (
    <View style={styles.mainBody}>
      <DialogTwoButton
        visible={visibleCompleteDialog}
        title='メール認証'
        description='登録のアドレスへ認証メールを送信しました。認証後、完了ボタンをクリックして下さい。'
        displayButton1='完了'
        displayButton2='アカウント作成中止'
        funcButton1={dialogComplete}
        funcButton2={dialogCancel}
        onDismiss={dialogComplete}
      />
      <DialogOneButton
        visible={visibleFailedDialog}
        title='認証メール送信失敗'
        description='登録のメールアドレスへの認証メールの送信に失敗しました。メールアドレスが間違っている可能性があります。再度登録処理を実施してください。'
        displayButton1='OK'
        funcButton1={dialogOk}
        onDismiss={dialogOk}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: BackColor,
    alignContent: 'center',
  }
});