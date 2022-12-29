import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native";
import { DataTable, Text, Button, Dialog, Paragraph, Portal, Provider, RadioButton } from "react-native-paper";
import { SmallButton } from "../components/parts/SmallButton";
import { StandardSpace } from "../components/parts/Space";
import { StandardButton } from "../components/parts/StandardButton";
import { AccentColor, BackColor, BasicColor, CoverColor, SeaColor, TomatoColor } from "../styles/common/color";
import { GetSigninUser } from "../utils/commonFunc/user/GetSigninUser";
import { errorCodeTransition, method } from "../utils/const";

export const Ranking =  (props: any) => {
  // props
  const { navigation } = props;
  
  // state
  const [id, setId] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [area, setArea] = useState('');

  const [prefectures, setPrefectures] = useState<any[]>([])
  const [visiblePrefectureDialog, setVisiblePrefectureDialog] = useState(false);

  const [visibleAreaDialog, setVisibleAreaDialog] = useState(false);
  const [areas, setAreas] = useState<any[]>([])
  const [areaDisabled, setAreaDisabled] = useState(true);

  const [dailyRankingEveryOtherDayRecords, setDailyRankingEveryOtherDayRecords] = useState<any[]>([]);
  const [dailyRankingDayRecords, setDailyRankingDayRecords] = useState<any[]>([]);
  const [dailyRankingNightRecords, setDailyRankingNightRecords] = useState<any[]>([]);
  const [weeklyRankingEveryOtherDayRecords, setWeeklyRankingEveryOtherDayRecords] = useState<any[]>([]);
  const [weeklyRankingDayRecords, setWeeklyRankingDayRecords] = useState<any[]>([]);
  const [weeklyRankingNightRecords, setWeeklyRankingNightRecords] = useState<any[]>([]);
  const [monthlyRankingEveryOtherDayRecords, setMonthlyRankingEveryOtherDayRecords] = useState<any[]>([]);
  const [monthlyRankingDayRecords, setMonthlyRankingDayRecords] = useState<any[]>([]);
  const [monthlyRankingNightRecords, setMonthlyRankingNightRecords] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem("taxi_log_user_id")
      console.log("id ホーム画面初期起動", id)
      if (id === null) {
        const status = await GetSigninUser();
        if (status === false) {
          navigation.navigate("Signin");
        }
      } else {
        setId(id);
      }
      setPrefectures([
        "全エリア","北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
        "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
        "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
        "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
        "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
        "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
        "熊本県","大分県","宮崎県","鹿児島県","沖縄県"
      ])

      const headers = {'id': String(id)}
      const params = {
        'id': id
      }

      const user = await axios({
        method: method.GET,
        url: `/users/${id}`,
        headers: headers,
        data: null,
        params: params,
      }).then((response) => {
        var user = response.data.data
        console.log("user", user);
        return user;
      }).catch(error => {
        console.error("error here", error);
        return "error";
      });

      setPrefecture(user.prefecture);
      selectPrefecture(user.prefecture);
      setArea(user.area);

      getRankingData(id, user.prefecture, user.area, 'first')
    })();
  }, [])

  const getRankingData = (id: any, prefecture_first: string, area_first: string, status: string) => {
    const headers = {'id': String(id)}
    var params: any
    if (status === 'first') {
      params = {
        'id': id,
        'prefecture': prefecture_first,
        'area': area_first,
      }
    } else {
      params = {
        'id': id,
        'prefecture': prefecture,
        'area': area,
      }
    }

    console.log('params', params)

    axios({
      method: method.GET,
      headers: headers,
      url: '/ranking',
      data: null,
      params: params,
    }).then((response) => {
      console.log("data", response.data.data);
      setDailyRankingEveryOtherDayRecords(response.data.data.daily_ranking_every_other_day_records);
      setDailyRankingDayRecords(response.data.data.daily_ranking_day_records);
      setDailyRankingNightRecords(response.data.data.daily_ranking_night_records);
      setWeeklyRankingEveryOtherDayRecords(response.data.data.weekly_ranking_every_other_day_records);
      setWeeklyRankingDayRecords(response.data.data.weekly_ranking_day_records);
      setWeeklyRankingNightRecords(response.data.data.weekly_ranking_night_records);
      setMonthlyRankingEveryOtherDayRecords(response.data.data.monthly_ranking_every_other_day_records);
      setMonthlyRankingDayRecords(response.data.data.monthly_ranking_day_records);
      setMonthlyRankingNightRecords(response.data.data.monthly_ranking_night_records);
    }).catch((error) => {
      console.error(error);
    });
  }

  useEffect(() =>{
    if (prefecture !== '都道府県' && prefecture !== '全エリア') {
      setAreaDisabled(false);
      // 営業区域のリセット処理
      setArea('全エリア')
    } else if (prefecture === '全エリア') {
      setAreaDisabled(false);
      setArea("全エリア")
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
      var areaArray = ["全エリア"];
      areaArray = areaArray.concat(response.data.data)
      setAreas(areaArray);
      // 都道府県選択ダイアログ閉じる
      setVisiblePrefectureDialog(false);
    }).catch(error => {
      var errorCode = error.response.data.info.code;
      var message: string[] = [];
      message = errorCodeTransition(errorCode);
      //setErrorMessages(message);
    });
  }

  /**
   * selectArea
   */
  const selectArea = (value: string) => {
    setArea(value);
    setVisibleAreaDialog(false);
  }

  return (
    <View style={styles.mainBody}>
      <ScrollView >
        <ScrollView style={styles.flex} horizontal={true}>
          <StandardButton displayText={prefecture} onPress={() => setVisiblePrefectureDialog(true)} />
          <StandardButton displayText={area} onPress={() => setVisibleAreaDialog(true)} disabled={areaDisabled}/>
        </ScrollView>
        <SmallButton
          displayText='Show Ranking'
          disabled={false}
          onPress={() => getRankingData(id, prefecture, area, 'second')}
        />
        <StandardSpace />

        <Text variant="titleLarge" style={styles.subTitle} >Daily Ranking</Text>
        <StandardSpace />
        <Text variant="titleMedium" style={styles.subTitle} >隔日勤務</Text>
        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>順位</DataTable.Title>
            <DataTable.Title>売上</DataTable.Title>
            <DataTable.Title>営業区域</DataTable.Title>
          </DataTable.Header>
          {
            dailyRankingEveryOtherDayRecords.map((record: any, index: number) => {
              return(
                <View key={index}>
                  <DataTable.Row style={styles.tableRow}>
                    <DataTable.Cell><Text style={styles.tableCell}>{index+1}位</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.daily_sales}円</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.prefecture}/{record.area}</Text></DataTable.Cell>
                  </DataTable.Row>
                </View>
              )
            })
          }
        </DataTable>
        <StandardSpace />
        <Text variant="titleMedium" style={styles.subTitle} >昼日勤</Text>
        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>順位</DataTable.Title>
            <DataTable.Title>売上</DataTable.Title>
            <DataTable.Title>営業区域</DataTable.Title>
          </DataTable.Header>
          {
            dailyRankingDayRecords.map((record: any, index: number) => {
              return(
                <View key={index}>
                  <DataTable.Row style={styles.tableRow}>
                    <DataTable.Cell><Text style={styles.tableCell}>{index+1}位</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.daily_sales}円</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.prefecture}/{record.area}</Text></DataTable.Cell>
                  </DataTable.Row>
                </View>
              )
            })
          }
        </DataTable>
        <StandardSpace />
        <Text variant="titleMedium" style={styles.subTitle} >夜日勤</Text>
        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>順位</DataTable.Title>
            <DataTable.Title>売上</DataTable.Title>
            <DataTable.Title>営業区域</DataTable.Title>
          </DataTable.Header>
          {
            dailyRankingNightRecords.map((record: any, index: number) => {
              return(
                <View key={index}>
                  <DataTable.Row style={styles.tableRow}>
                    <DataTable.Cell><Text style={styles.tableCell}>{index+1}位</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.daily_sales}円</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.prefecture}/{record.area}</Text></DataTable.Cell>
                  </DataTable.Row>
                </View>
              )
            })
          }
        </DataTable>

        <StandardSpace />
        <Text variant="titleLarge" style={styles.subTitle} >Weekly Ranking</Text>
        <StandardSpace />
        <Text variant="titleMedium" style={styles.subTitle} >隔日勤務</Text>
        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>順位</DataTable.Title>
            <DataTable.Title>売上</DataTable.Title>
            <DataTable.Title>営業区域</DataTable.Title>
          </DataTable.Header>
          {
            weeklyRankingEveryOtherDayRecords.map((record: any, index: number) => {
              return(
                <View key={index}>
                  <DataTable.Row style={styles.tableRow}>
                    <DataTable.Cell><Text style={styles.tableCell}>{index+1}位</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.daily_sales}円</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.prefecture}/{record.area}</Text></DataTable.Cell>
                  </DataTable.Row>
                </View>
              )
            })
          }
        </DataTable>
        <StandardSpace />
        <Text variant="titleMedium" style={styles.subTitle} >昼日勤</Text>
        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>順位</DataTable.Title>
            <DataTable.Title>売上</DataTable.Title>
            <DataTable.Title>営業区域</DataTable.Title>
          </DataTable.Header>
          {
            weeklyRankingDayRecords.map((record: any, index: number) => {
              return(
                <View key={index}>
                  <DataTable.Row style={styles.tableRow}>
                    <DataTable.Cell><Text style={styles.tableCell}>{index+1}位</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.daily_sales}円</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.prefecture}/{record.area}</Text></DataTable.Cell>
                  </DataTable.Row>
                </View>
              )
            })
          }
        </DataTable>
        <StandardSpace />
        <Text variant="titleMedium" style={styles.subTitle} >夜日勤</Text>
        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>順位</DataTable.Title>
            <DataTable.Title>売上</DataTable.Title>
            <DataTable.Title>営業区域</DataTable.Title>
          </DataTable.Header>
          {
            weeklyRankingNightRecords.map((record: any, index: number) => {
              return(
                <View key={index}>
                  <DataTable.Row style={styles.tableRow}>
                    <DataTable.Cell><Text style={styles.tableCell}>{index+1}位</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.daily_sales}円</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.prefecture}/{record.area}</Text></DataTable.Cell>
                  </DataTable.Row>
                </View>
              )
            })
          }
        </DataTable>

        <StandardSpace />
        <Text variant="titleLarge" style={styles.subTitle} >Monthly Ranking</Text>
        <StandardSpace />
        <Text variant="titleMedium" style={styles.subTitle} >隔日勤務</Text>
        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>順位</DataTable.Title>
            <DataTable.Title>売上</DataTable.Title>
            <DataTable.Title>営業区域</DataTable.Title>
          </DataTable.Header>
          {
            monthlyRankingEveryOtherDayRecords.map((record: any, index: number) => {
              return(
                <View key={index}>
                  <DataTable.Row style={styles.tableRow}>
                    <DataTable.Cell><Text style={styles.tableCell}>{index+1}位</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.daily_sales}円</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.prefecture}/{record.area}</Text></DataTable.Cell>
                  </DataTable.Row>
                </View>
              )
            })
          }
        </DataTable>
        <StandardSpace />
        <Text variant="titleMedium" style={styles.subTitle} >昼日勤</Text>
        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>順位</DataTable.Title>
            <DataTable.Title>売上</DataTable.Title>
            <DataTable.Title>営業区域</DataTable.Title>
          </DataTable.Header>
          {
            monthlyRankingDayRecords.map((record: any, index: number) => {
              return(
                <View key={index}>
                  <DataTable.Row style={styles.tableRow}>
                    <DataTable.Cell><Text style={styles.tableCell}>{index+1}位</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.daily_sales}円</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.prefecture}/{record.area}</Text></DataTable.Cell>
                  </DataTable.Row>
                </View>
              )
            })
          }
        </DataTable>
        <StandardSpace />
        <Text variant="titleMedium" style={styles.subTitle} >夜日勤</Text>
        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>順位</DataTable.Title>
            <DataTable.Title>売上</DataTable.Title>
            <DataTable.Title>営業区域</DataTable.Title>
          </DataTable.Header>
          {
            monthlyRankingNightRecords.map((record: any, index: number) => {
              return(
                <View key={index}>
                  <DataTable.Row style={styles.tableRow}>
                    <DataTable.Cell><Text style={styles.tableCell}>{index+1}位</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.daily_sales}円</Text></DataTable.Cell>
                    <DataTable.Cell><Text style={styles.tableCell}>{record.prefecture}/{record.area}</Text></DataTable.Cell>
                  </DataTable.Row>
                </View>
              )
            })
          }
        </DataTable>
        
      </ScrollView>
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
  );
}


const styles = StyleSheet.create({
  mainBody: {
    padding: '3%',
    flex: 1,
    backgroundColor: BackColor,
    alignContent: 'center',
  },
  flex: {
    flexDirection: 'row',
  },
  subTitle: {
    color: BasicColor,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  tableHeader: {
    borderBottomColor: AccentColor,
    borderBottomWidth: 1,
  },
  tableRow: {
    borderBottomColor: AccentColor,
    borderBottomWidth: 0.5,
  },
  tableCell: {
    fontSize: 12,
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
  },
  radioButtonStyle: {
    marginLeft: 35,
    marginRight: 35,
  },
});