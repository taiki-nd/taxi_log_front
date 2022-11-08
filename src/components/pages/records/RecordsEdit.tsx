import { View, Text } from "react-native";

export const RecordsEdit = (props: any) => {
  // props
  const { navigation, route } = props;

  // 変数
  var record_id = route.params.record_id;
  var user_id = route.params.user_id;
  console.log(record_id, user_id)
  return (
    <View>
      <Text>record edit</Text>
    </View>
  );
}