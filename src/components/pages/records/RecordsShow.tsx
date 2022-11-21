import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, DataTable, Dialog, Provider, Portal, RadioButton } from "react-native-paper";
import { auth } from "../../../auth/firebase";
import { Detail } from "../../../models/Detail";
import { AccentColor, BackColor, BasicColor, CoverColor, SeaColor, TomatoColor } from "../../../styles/common/color";
import { DateTransition, DayTransition } from "../../../utils/commonFunc/record/DateTranstion";
import { errorCodeTransition, method } from "../../../utils/const";
import { DialogOneButton } from "../../parts/DialogOneButton";
import { DialogTextInput } from "../../parts/DialogTextInput";
import { DialogTwoButton } from "../../parts/DialogTwoButton";
import { SmallButton } from "../../parts/SmallButton";
import { SmallButtonCustom } from "../../parts/SmallButtonCustom";
import { StandardSpace } from "../../parts/Space";
import { StandardLabel } from "../../parts/StandardLabel";

export const RecordsShow = (props: any) => {
    // props
    const { navigation, route } = props;

    // 変数
    var record_id = route.params.record_id;
    var user_id = route.params.user_id;

    // state
    const [userId, setUserId] = useState(Number);
    const [uid, setUid] = useState('');
    const [date, setDate] = useState(moment);
    const [day, setDay] = useState('');
    const [styleFlg, setStyleFlg] = useState('');
    const [startHour, setStartHour] = useState(Number);
    const [runningTime, setRunningTime] = useState(Number);
    const [runningKm, setRunningKm] = useState(Number);
    const [occupancyRate, setOccupancyRate] = useState(Number);
    const [numberOfTime, setNumberOfTime] = useState(Number);
    const [taxFlg, setTaxFlg] = useState('');
    const [dailySales, setDailySales] = useState(Number);
    const [dailyTarget, setDailyTarget] = useState(Number);
    const [details, setDetails] = useState<any[]>([]);
    const [visibleFailedDialog, setVisibleFailedDialog] = useState(false);
    const [visibleConfirmDeleteDialog, setVisibleConfirmDeleteDialog] = useState(false);
    const [visibleCreateDetailsDialog, setVisibleCreateDetailsDialog] = useState(false);
    const [visibleEditDetailsDialog, setVisibleEditDetailsDialog] = useState(false);
    const [detailCreateButtonDisabled, setDetailCreateButtonDisabled] = useState(true);
    const [detailEditButtonDisabled, setDetailEditButtonDisabled] = useState(true);
    const [dialogTitle, setDialogTitle] = useState('');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const [detailId, setDetailId] = useState(Number);
    const [DepartHour, setDepartHour] = useState(Number);
    const [DepartPlace, setDepartPlace] = useState('');
    const [ArrivePlace, setArrivePlace] = useState('');
    const [sales, setSales] = useState(Number);
    const [methodFlg, setMethodFlg] = useState('');
    const [description, setDescription] = useState('');

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

      // user情報の取得
      getUser(currentUser.uid);
  
      // レコード詳細の取得
      getRecords(currentUser.uid);

      // detail一覧の取得
      getDetails(currentUser.uid);
    }, []);

    /**
     * getUser
     */
    const getUser = (uid: string) => {
  
      // headers
      const headers = {'uuid': uid}
  
      // params
      const params = {
        user_id: user_id,
      }

      // user情報の取得
      axios({
        method: method.GET,
        url: 'user/get_user_form_uid',
        headers: headers,
        data: null,
        params: null,
      }).then((response) => {
        console.log("data", response.data);
        setDailyTarget(response.data.data.daily_target);
      }).catch(error => {
        var errorCode = error.response.data.info.code;
        var message: string[] = [];
        message = errorCodeTransition(errorCode);
        setErrorMessages(message);
        setDialogTitle('ユーザー情報取得の失敗')
        setVisibleFailedDialog(true);
      });
    }

    /**
     * getRecords
     */
    const getRecords = (uid: string) => {

      // headers
      const headers = {'uuid': uid}
  
      // params
      const params = {
        user_id: user_id,
      }

      axios({
        method: method.GET,
        url: `/records/${record_id}`,
        headers: headers,
        data: null,
        params: params,
      }).then((response) => {
        console.log("data", response.data);
        // データの取得
        setUserId(response.data.data.id);
        setDate(response.data.data.date);
        setDay(response.data.data.day_of_week);
        setStyleFlg(response.data.data.style_flg);
        setStartHour(response.data.data.start_hour);
        setRunningTime(response.data.data.running_time);
        setRunningKm(response.data.data.running_km);
        setOccupancyRate(response.data.data.occupancy_rate);
        setNumberOfTime(response.data.data.number_of_time);
        if (response.data.data.is_tax){
          setTaxFlg('true');
        } else {
          setTaxFlg('false');
        }
        setDailySales(response.data.data.daily_sales);
      }).catch(error => {
        var errorCode = error.response.data.info.code;
        var message: string[] = [];
        message = errorCodeTransition(errorCode);
        setErrorMessages(message);
        setDialogTitle('日報表示の失敗')
        setVisibleFailedDialog(true);
      });
    }

    /**
     * getDetails
     * @param {string}
     */
    const getDetails = (uid: string) => {

      // headers
      const headers = {'uuid': uid}

      // params
      var params = {
        user_id: user_id,
        record_id: record_id,
      }

      axios({
        method: method.GET,
        url: '/details',
        headers: headers,
        data: null,
        params: params,
      }).then((response) => {
        console.log(response.data.data);
        setDetails(response.data.data);
      }).catch(error => {
        var errorCode = error.response.data.info.code;
        var message: string[] = [];
        message = errorCodeTransition(errorCode);
        setErrorMessages(message);
        setDialogTitle('走行情報一覧表示の失敗')
        setVisibleFailedDialog(true);
      });
    }

    /**
     * 必須項目チェックによるボタン活性化処理
     */
    useEffect(() => {
      if (DepartHour !== undefined
        && DepartPlace !== ''
        && ArrivePlace !== ''
        && sales !== undefined
        && methodFlg !== ''
        && taxFlg !== ''){
        setDetailCreateButtonDisabled(false);
        setDetailEditButtonDisabled(false);
      } else {
        setDetailCreateButtonDisabled(true);
        setDetailEditButtonDisabled(true);
      }
    }, [DepartHour, DepartPlace, ArrivePlace, sales, methodFlg, taxFlg]);

    /**
     * detailsCreate
     */
    const detailsCreate = () => {
      console.log("pressed createRecord button");

      setDetailCreateButtonDisabled(true);
      console.log(uid);

      // headers
      const headers = {'uuid': uid}

      // taxFlg変換
      var isTax = false;
      if (taxFlg === "true") {
        isTax = true;
      }

      console.log(date);

      // jsonData
      var jsonData = {
        depart_hour: Number(DepartHour),
        depart_place: DepartPlace,
        arrive_place: ArrivePlace,
        is_tax: isTax,
        sales: Number(sales),
        method_flg: methodFlg,
        description: description,
        record_id: record_id,
      }

      console.log(jsonData);

      try {
        axios({
          method: method.POST,
          url: '/details',
          headers: headers,
          data: jsonData,
          params: null,
        }).then((response) => {
          console.log("data", response.data);
          // レコード詳細画面への遷移
          setVisibleCreateDetailsDialog(false);
          getDetails(uid);
        }).catch(error => {
          var errorCode = error.response.data.info.code;
          var message: string[] = [];
          console.log(errorCode);
          message = errorCodeTransition(errorCode);
          setErrorMessages(message);
          // ボタンの活性化
          setDetailCreateButtonDisabled(true);
        });
      } catch (ex: any) {

      }
    }

    /**
     * getDetail
     * @param {number} detail_id
     */
    const getDetail = (detail_id: number) => {
      // headers
      const headers = {'uuid': uid}

      // params
      var params = {
        user_id: user_id,
      }

      // detailの取得
      axios({
        method: method.GET,
        url: `/details/${detail_id}`,
        headers: headers,
        data: null,
        params: params
      }).then((response) => {
        console.log("data", response.data);
        // データの取得
        setDetailId(response.data.data.id);
        setDepartHour(response.data.data.depart_hour);
        setDepartPlace(response.data.data.depart_place);
        setArrivePlace(response.data.data.arrive_place);
        setSales(response.data.data.sales);
        setMethodFlg(response.data.data.method_flg);
        setDescription(response.data.data.description);
        setVisibleEditDetailsDialog(true);
      }).catch(error => {
        var errorCode = error.response.data.info.code;
        var message: string[] = [];
        message = errorCodeTransition(errorCode);
        setErrorMessages(message);
        setDialogTitle('走行情報一覧表示の失敗')
        setVisibleFailedDialog(true);
      });
    }

    /**
     * DailySalesTargetAchievementRate
     * @returns {number}
     */
    const DailySalesTargetAchievementRate = () => {
      return Math.round((dailySales/dailyTarget)*100)
    }

    /**
     * updateDetail
     */
    const updateDetail = () => {
      console.log(detailId);
      // headers
      const headers = {'uuid': uid}

      // jsonData
      var jsonData = {
        depart_hour: Number(DepartHour),
        depart_place: DepartPlace,
        arrive_place: ArrivePlace,
        sales: Number(sales),
        method_flg: methodFlg,
        description: description,
      }

      // params
      var params = {
        user_id: user_id,
      }

      axios({
        method: method.PUT,
        url: `/details/${detailId}`,
        headers: headers,
        data: jsonData,
        params: params,
      }).then((response) => {
        console.log("data", response.data);
        setVisibleEditDetailsDialog(false);
        getDetails(uid);
      })
    }

    /**
     * deleteRecord
     */
    const deleteRecord = () => {
      // headers
      const headers = {'uuid': uid}

      // params
      const params = {'user_id': user_id}

      axios({
        method: method.DELETE,
        url: `/details/${detailId}`,
        headers: headers,
        data: null,
        params: params,
      }).then((response) => {
        console.log("data", response.data);
        setVisibleConfirmDeleteDialog(false);
        getDetails(uid);
      }).catch((error) => {
        var errorCode = error.response.data.info.code;
        var message: string[] = [];
        message = errorCodeTransition(errorCode);
        setVisibleConfirmDeleteDialog(false);
        setVisibleFailedDialog(true);
        setDialogTitle('走行情報の削除失敗')
        setErrorMessages(message);
      })
    }

    /**
     * averageSalesPerHour
     * @returns {number}
     */
    const averageSalesPerHour = () => {
      return Math.round(dailySales/runningTime);
    }

    /**
     * averageSalesPerCustomer
     * @returns {number}
     */
    const averageSalesPerCustomer = () => {
      return Math.round(dailySales/numberOfTime);
    }

    /**
     * averageSalesPerKm
     * @returns {number}
     */
    const averageSalesPerKm = () => {
      return Math.round(dailySales/runningKm);
    }

    /**
     * dialogOk
     */
    const dialogOk = () => {
      console.log("dialogOk");
      setVisibleFailedDialog(false);
      if (detailId !== 0) {
        getDetails(uid);
        return
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'Records' }]
      });
    }

    /**
     * showDeleteConfirmDialog
     */
    const showDeleteConfirmDialog = (detail_id: number) => {
      setVisibleConfirmDeleteDialog(true);
      setDetailId(detail_id);
    }

    /**
     * cancelDeleteDetail
     */
    const cancelDeleteDetail = () => {
      setVisibleConfirmDeleteDialog(false);
    }
  
    return (
      <View style={styles.mainBody}>
        <ScrollView>
          <StandardSpace/>
          <Text variant="titleLarge"  style={styles.title}>{DateTransition(String(date))}({DayTransition(day)})の売上記録</Text>

          <StandardSpace/>
          <Text variant="titleMedium" style={styles.subTitle}>総括</Text>
          <DataTable>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title>売上</DataTable.Title>
              <DataTable.Title>売上達成率</DataTable.Title>
              <DataTable.Title>実車率</DataTable.Title>
            </DataTable.Header>
            <DataTable.Row style={styles.tableRow}>
              <DataTable.Cell>{dailySales}円</DataTable.Cell>
              <DataTable.Cell>{DailySalesTargetAchievementRate()}%</DataTable.Cell>
              <DataTable.Cell>{occupancyRate}%</DataTable.Cell>
            </DataTable.Row>
          </DataTable>

          <StandardSpace/>

          <Text variant="titleMedium" style={styles.subTitle}>時間単価</Text>
          <DataTable>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title>走行時間</DataTable.Title>
              <DataTable.Title>平均単価/時間</DataTable.Title>
            </DataTable.Header>
            <DataTable.Row style={styles.tableRow}>
              <DataTable.Cell>{runningTime}時間</DataTable.Cell>
              <DataTable.Cell>{averageSalesPerHour()}円</DataTable.Cell>
            </DataTable.Row>
          </DataTable>

          <StandardSpace/>
          
          <Text variant="titleMedium" style={styles.subTitle}>客単価</Text>
          <DataTable>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title>組数</DataTable.Title>
              <DataTable.Title>平均単価/組</DataTable.Title>
            </DataTable.Header>
            <DataTable.Row style={styles.tableRow}>
              <DataTable.Cell>{numberOfTime}組</DataTable.Cell>
              <DataTable.Cell>{averageSalesPerCustomer()}円</DataTable.Cell>
            </DataTable.Row>
          </DataTable>

          <StandardSpace/>

          <Text variant="titleMedium" style={styles.subTitle}>距離単価</Text>
          <DataTable>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title>走行距離</DataTable.Title>
              <DataTable.Title>平均単価/km</DataTable.Title>
            </DataTable.Header>
            <DataTable.Row style={styles.tableRow}>
              <DataTable.Cell>{runningKm}km</DataTable.Cell>
              <DataTable.Cell>{averageSalesPerKm()}円</DataTable.Cell>
            </DataTable.Row>
          </DataTable>

          <StandardSpace/>

          <Text variant="titleMedium" style={styles.subTitle}>詳細走行情報</Text>
          <SmallButton
            displayText="詳細走行情報の追加" onPress={() => setVisibleCreateDetailsDialog(true)} 
          />

          <DataTable>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title>出発時刻</DataTable.Title>
              <DataTable.Title>出発場所</DataTable.Title>
              <DataTable.Title>到着場所</DataTable.Title>
              <DataTable.Title>乗車方式</DataTable.Title>
              <DataTable.Title>売上</DataTable.Title>
            </DataTable.Header>
            {details.map((detail: Detail) => {
              return (
                <View key={detail.id}>
                  <DataTable.Row style={styles.tableRow}>
                    <DataTable.Cell><Text style={styles.tableCell}>{detail.depart_hour}時台</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{detail.depart_place}</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{detail.arrive_place}</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{detail.method_flg}</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{detail.sales}円</Text></DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row style={styles.tableRow}>
                    <DataTable.Cell><Text style={styles.tableCell}>memo: {detail.description}</Text></DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row style={styles.tableRow2}>
                    <SmallButtonCustom displayText='edit' color={SeaColor} onPress={() => getDetail(detail.id)}/>
                    <SmallButtonCustom displayText='delete' color={TomatoColor} onPress={() => showDeleteConfirmDialog(detail.id)}/>
                  </DataTable.Row>
                </View>
              );
            })}
          </DataTable>
        </ScrollView>
        <Provider>
          <View>
            <Portal>
              <Dialog visible={visibleCreateDetailsDialog} style={styles.dialog} onDismiss={() => setVisibleCreateDetailsDialog(false)}>
                <Dialog.Title style={styles.text}>走行詳細情報の追加</Dialog.Title>
                <Dialog.ScrollArea>
                  <ScrollView>
                    <Dialog.Content>
                      <DialogTextInput label="出発時刻" placeholder="15" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setDepartHour(i)}/>
                      <DialogTextInput label="出発場所" placeholder="東京駅八重洲口" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setDepartPlace(text)}/>
                      <DialogTextInput label="到着場所" placeholder="東京都庁" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setArrivePlace(text)}/>
                      <StandardLabel displayText='乗車方式'/>
                      <RadioButton.Group onValueChange={value => setMethodFlg(value)} value={methodFlg}>
                        <RadioButton.Item label="流し" value="flow" style={styles.radioButtonStyle} color={AccentColor}/>
                        <RadioButton.Item label="つけ待ち" value="wait" style={styles.radioButtonStyle} color={AccentColor}/>
                        <RadioButton.Item label="アプリ配車" value="app" style={styles.radioButtonStyle} color={AccentColor}/>
                        <RadioButton.Item label="自社無線" value="wireless" style={styles.radioButtonStyle} color={AccentColor}/>
                        <RadioButton.Item label="自身顧客" value="own" style={styles.radioButtonStyle} color={AccentColor}/>
                        <RadioButton.Item label="他" value="other" style={styles.radioButtonStyle} color={AccentColor}/>
                      </RadioButton.Group>
                      <DialogTextInput label="売上" placeholder="4300" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setSales(i)}/>
                      <DialogTextInput label="memo" placeholder="〇〇を経由して〇〇へ" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setDescription(text)}/>
                    </Dialog.Content>
                    {errorMessages.length != 0 ? (
                      errorMessages.map((errorMessage: string, index: number) => { 
                        return(
                          <Text style={styles.errorTextStyle} key={index}>
                            {errorMessage}
                          </Text>
                        )})
                      ) : null}
                    <Dialog.Actions>
                      <SmallButtonCustom displayText="create" disabled={detailCreateButtonDisabled} color={SeaColor} onPress={detailsCreate}/>
                      <SmallButtonCustom displayText="cancel" color={TomatoColor} onPress={() => setVisibleCreateDetailsDialog(false)}/>
                    </Dialog.Actions>
                  </ScrollView>
                </Dialog.ScrollArea>
              </Dialog>
              <Dialog visible={visibleEditDetailsDialog} style={styles.dialog} onDismiss={() => setVisibleEditDetailsDialog(false)}>
                <Dialog.Title style={styles.text}>走行詳細情報の編集</Dialog.Title>
                <Dialog.ScrollArea>
                  <ScrollView>
                    <Dialog.Content>
                      <DialogTextInput label="出発時刻" defaultValue={String(DepartHour)} placeholder="15" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setDepartHour(i)}/>
                      <DialogTextInput label="出発場所" defaultValue={DepartPlace} placeholder="東京駅八重洲口" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setDepartPlace(text)}/>
                      <DialogTextInput label="到着場所" defaultValue={ArrivePlace} placeholder="東京都庁" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setArrivePlace(text)}/>
                      <StandardLabel displayText='乗車方式'/>
                      <RadioButton.Group onValueChange={value => setMethodFlg(value)} value={methodFlg}>
                        <RadioButton.Item label="流し" value="flow" style={styles.radioButtonStyle} color={AccentColor}/>
                        <RadioButton.Item label="つけ待ち" value="wait" style={styles.radioButtonStyle} color={AccentColor}/>
                        <RadioButton.Item label="アプリ配車" value="app" style={styles.radioButtonStyle} color={AccentColor}/>
                        <RadioButton.Item label="自社無線" value="wireless" style={styles.radioButtonStyle} color={AccentColor}/>
                        <RadioButton.Item label="自身顧客" value="own" style={styles.radioButtonStyle} color={AccentColor}/>
                        <RadioButton.Item label="他" value="other" style={styles.radioButtonStyle} color={AccentColor}/>
                      </RadioButton.Group>
                      <DialogTextInput label="売上" defaultValue={String(sales)} placeholder="4300" keyboardType="default" secureTextEntry={false} onChangeText={(i: number) => setSales(i)}/>
                      <DialogTextInput label="memo" defaultValue={description} placeholder="〇〇を経由して〇〇へ" keyboardType="default" secureTextEntry={false} onChangeText={(text: string) => setDescription(text)}/>
                    </Dialog.Content>
                    {errorMessages.length != 0 ? (
                      errorMessages.map((errorMessage: string, index: number) => { 
                        return(
                          <Text style={styles.errorTextStyle} key={index}>
                            {errorMessage}
                          </Text>
                        )})
                      ) : null}
                    <Dialog.Actions>
                      <SmallButtonCustom displayText="update" disabled={detailEditButtonDisabled} color={SeaColor} onPress={updateDetail}/>
                      <SmallButtonCustom displayText="cancel" color={TomatoColor} onPress={() => setVisibleEditDetailsDialog(false)}/>
                    </Dialog.Actions>
                  </ScrollView>
                </Dialog.ScrollArea>
              </Dialog>
            </Portal>
          </View>
        </Provider>

        <DialogOneButton
          visible={visibleFailedDialog}
          title={dialogTitle}
          description={errorMessages}
          displayButton1='OK'
          funcButton1={dialogOk}
          onDismiss={dialogOk}
        />

        <DialogTwoButton
          visible={visibleConfirmDeleteDialog}
          title='削除確認'
          description='選択した詳細走行情報を削除しますか？'
          displayButton1='削除'
          displayButton2='キャンセル'
          funcButton1={deleteRecord}
          funcButton2={cancelDeleteDetail}
          onDismiss={cancelDeleteDetail}
        />

      </View>
    );
  };
  
  const styles = StyleSheet.create({
    mainBody: {
      padding: 10,
      flex: 1,
      backgroundColor: BackColor,
      alignContent: 'center',
    },
    tableHeader: {
      borderBottomColor: AccentColor,
      borderBottomWidth: 1,
    },
    tableRow: {
      borderBottomColor: AccentColor,
      borderBottomWidth: 0.5,
    },
    tableRow2: {
      borderBottomColor: AccentColor,
      borderBottomWidth: 1,
    },
    tableCell: {
      fontSize: 12,
    },
    title: {
      color: BasicColor,
      fontWeight: 'bold',
    },
    subTitle: {
      color: BasicColor,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
    errorTextStyle: {
      color: 'red',
      textAlign: 'center',
      fontSize: 14,
    },
    text :{
      color: BasicColor,
    },
    dialog: {
      height: '70%',
      backgroundColor: CoverColor,
    },
    radioButtonStyle: {
      marginLeft: 35,
      marginRight: 35,
    },
  });