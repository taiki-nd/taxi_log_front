import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AccentColor, BasicColor } from '../../styles/common/color';

export const StandardButton = (props: any) => {
  return (
    <TouchableOpacity
      style={styles.buttonStyle}
      activeOpacity={0.5}
      >
      <Text style={styles.buttonTextStyle}>{props.displayText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: BasicColor,
    borderWidth: 1,
    borderColor: AccentColor,
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: AccentColor,
    paddingVertical: 10,
    fontSize: 16,
  }
});