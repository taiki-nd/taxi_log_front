import { Text } from "react-native-paper";

export const RecordsShow = (props: any) => {
    // props
    const { navigation, route } = props;

    // 変数
    var record_id = route.params.record_id;
    var user_id = route.params.user_id;

    console.log(record_id, user_id);
    
  return (
    <Text>レコード詳細画面</Text>
  );
}