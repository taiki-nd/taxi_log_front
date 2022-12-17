import axios from "axios";
import { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native";
import { DataTable, Text } from "react-native-paper";
import { StandardSpace } from "../components/parts/Space";
import { AccentColor, BackColor, BasicColor } from "../styles/common/color";
import { method } from "../utils/const";

export const Ranking =  () => {
  // state
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
    axios({
      method: method.GET,
      url: '/ranking',
      data: null,
      params: null,
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
  }, [])

  return (
    <View style={styles.mainBody}>
      <Text variant="titleLarge" style={styles.subTitle} >Daily Ranking</Text>
      <StandardSpace />
      <Text variant="titleMedium" style={styles.subTitle} >隔日勤務</Text>
      <DataTable>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title>順位</DataTable.Title>
          <DataTable.Title>売上</DataTable.Title>
        </DataTable.Header>
        {
          dailyRankingEveryOtherDayRecords.map((record: any, index: number) => {
            return(
              <View key={index}>
                <DataTable.Row style={styles.tableRow}>
                  <DataTable.Cell><Text style={styles.tableCell}>{index+1}位</Text></DataTable.Cell>
                  <DataTable.Cell><Text style={styles.tableCell}>{record.daily_sales}円</Text></DataTable.Cell>
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
        </DataTable.Header>
        {
          dailyRankingDayRecords.map((record: any, index: number) => {
            return(
              <View key={index}>
                <DataTable.Row style={styles.tableRow}>
                  <DataTable.Cell><Text style={styles.tableCell}>{index+1}位</Text></DataTable.Cell>
                  <DataTable.Cell><Text style={styles.tableCell}>{record.daily_sales}円</Text></DataTable.Cell>
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
        </DataTable.Header>
        {
          dailyRankingNightRecords.map((record: any, index: number) => {
            return(
              <View key={index}>
                <DataTable.Row style={styles.tableRow}>
                  <DataTable.Cell><Text style={styles.tableCell}>{index+1}位</Text></DataTable.Cell>
                  <DataTable.Cell><Text style={styles.tableCell}>{record.daily_sales}円</Text></DataTable.Cell>
                </DataTable.Row>
              </View>
            )
          })
        }
      </DataTable>
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
  }
});