import { StyleSheet, Text } from 'react-native';
import { BasicColor } from '../../styles/common/color';
export const StandardLabel = (props: any) => {
  const { displayText } = props;
  return (
    <Text style={styles.labelStyle}>{displayText}</Text>
  );
}

const styles = StyleSheet.create({
  labelStyle: {
    color: BasicColor,
    marginLeft: 20,
    marginTop: 20,
  }
});