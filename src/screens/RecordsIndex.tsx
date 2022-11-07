import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';
import { auth } from '../auth/firebase';
import { SmallButtonCustom } from '../components/parts/SmallButtonCustom';
import { Record } from '../models/Record';
import { BackColor, BasicColor, CoverColor, SeaColor, TomatoColor } from '../styles/common/color';
import { errorCodeTransition, method } from '../utils/const';

export const RecordsIndex = (props: any) => {
  // props
  const { navigation } = props;

  // state
  const [uid, setUid] = useState('');
  const [userId, setUserId] = useState(Number);
  const [records, setRecords] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(Number);

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

    var params = {
      page: page,
    }

    axios({
      method: method.GET,
      url: '/records',
      headers: headers,
      data: null,
      params: params,
    }).then((response) => {
      console.log("data", response.data);
      setRecords(response.data.data);
      setPage(page + 1);
      setLastPage(response.data.meta.last_page);
    }).catch(error => {
      var errorCode = error.response.data.info.code;
      var message: string[] = [];
      message = errorCodeTransition(errorCode);
      //setErrorMessages(message);
    });
  }, []);

  const recordsIndex = () => {
    if (page > lastPage) {
      console.log("last page")
      return
    }

    // headers
    const headers = {'uuid': uid}
    
    var params = {
      page: page,
    }

    axios({
      method: method.GET,
      url: '/records',
      headers: headers,
      data: null,
      params: params,
    }).then((response) => {
      console.log("data", response.data);
      var addedRecords = records.concat(response.data.data);
      setRecords(addedRecords);
      setPage(page + 1);
    }).catch(error => {
      var errorCode = error.response.data.info.code;
      var message: string[] = [];
      message = errorCodeTransition(errorCode);
      //setErrorMessages(message);
    });
  }

  const sampleMethod = () => {
    console.log("sampleMethod pressed");
  }

  /** 
   * deleteRecord
   * @param id
   */
  const deleteRecord = (id: number, user_id: number) => {
    // headers
    const headers = {'uuid': uid}

    // params
    const params = {'user_id': user_id}
    
    axios({
      method: method.DELETE,
      url: `/records/${id}`,
      headers: headers,
      data: null,
      params: params,
    }).then((response) => {
      console.log("data", response.data);
    }).catch((error) => {
      var errorCode = error.response.data.info.code;
      var message: string[] = [];
      message = errorCodeTransition(errorCode);
      //setErrorMessages(message);
    })
  }

  /**
   * dateTransition
   * @param date 
   * @returns string
   */
  const dateTransition = (date: string) => {
    var transitionDate = new Date(date);
    return transitionDate.getFullYear() + '/' +('0' + (transitionDate.getMonth()+1)).slice(-2)+ '/' +  ('0' + transitionDate.getDate()).slice(-2);
  }

  /**
   * dayTransition
   * @param day 
   * @returns string
   */
  const dayTransition = (day: string) => {
    switch (day) {
      case 'Mon.':
        return '月'
      case 'Tue.':
        return '火'
      case 'Wed.':
        return '水'
      case 'Thu.':
        return '木'
      case 'Fri.':
        return '金'
      case 'Sat.':
        return '土'
      case 'Sun.':
        return '日'
    }
  }

  return (
    <View style={styles.mainBody}>
      <FlatList
        data={records}
        extraData={records}
        renderItem = {({item}: { item: Record }) => (
          <Card style={styles.cardStyle}>
            <Card.Content>
              <Title style={styles.textColor}>{dateTransition(item.date)}({dayTransition(item.day_of_week)})</Title>
              <Paragraph style={styles.textColor}>売上：¥{item.daily_sales}  /  実車率：{item.occupancy_rate}%</Paragraph>
              <Paragraph style={styles.textColor}>走行距離：{item.running_km}km</Paragraph>
            </Card.Content>
            <Card.Actions>
              <SmallButtonCustom displayText="edit" color={SeaColor} disabled={false} onPress={sampleMethod} />
              <SmallButtonCustom displayText="delete" color={TomatoColor} disabled={false} onPress={() => deleteRecord(item.id, item.user_id)} />
            </Card.Actions>
          </Card>
        )}
        onEndReached={recordsIndex}
        onEndReachedThreshold={0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: BackColor,
    alignContent: 'center',
  },
  cardStyle: {
    backgroundColor: CoverColor,
    marginHorizontal: 10,
    marginBottom: 25,
  },
  textColor: {
    color: BasicColor,
  }
});