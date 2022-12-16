import { useEffect, useState } from "react"
import { View } from "react-native";
import { TextInput } from "react-native-paper";

export const Ranking =  () => {
  const [num, setNum] = useState(0)

  useEffect(() => {
    console.log('num', num);
    console.log('num is int', Number.isInteger(num));
    if (Number.isInteger(num)) {
      console.log('numは整数');
    } else {
      console.log('numは小数');
    }
  }, [num])

  return (
    <View>
      <TextInput onChangeText={(i: number) => setNum(i)}/>
    </View>
  );
}