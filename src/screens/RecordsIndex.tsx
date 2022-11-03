import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../auth/firebase';
import { TransitionButton } from '../components/parts/TransitionButton';
import { AccentColor, BackColor, BasicColor } from '../styles/common/color';
import { errorCodeTransition, method } from '../utils/const';

export const RecordsIndex = (props: any) => {
  // props
  const { navigation } = props;

  // state
  const [uid, setUid] = useState('');
  const [userId, setUserId] = useState(Number);

  // records取得（初期表示）
  useEffect(() => {
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

    // headers
    const headers = {'uuid': currentUser.uid}

    // userId
    var userId;

    // ユーザー情報の取得
    axios({
      method: method.GET,
      url: 'user/get_user_form_uid',
      headers: headers,
      data: null,
      params: null,
    }).then((response) => {
      console.log("data", response.data);
      setUserId(response.data.data.id);
      userId = response.data.data.id;
    }).catch(error => {
      var errorCode = error.response.data.info.code;
      var message: string[] = [];
      message = errorCodeTransition(errorCode);
      //setErrorMessages(message);
    });

    axios({
      method: method.GET,
      url: '/records',
      headers: headers,
      data: null,
      params: null,
    }).then((response) => {
      console.log("data", response.data);
    }).catch(error => {
      var errorCode = error.response.data.info.code;
      var message: string[] = [];
      message = errorCodeTransition(errorCode);
      //setErrorMessages(message);
    });
  }, []);

  return (
    <View style={styles.mainBody}>
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
});