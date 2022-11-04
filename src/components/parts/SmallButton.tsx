import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { AccentColor, BasicColor } from '../../styles/common/color';

export const SmallButton = (props: any) => {
  const {displayText, disabled, onPress} = props;
  return (
    <View style={styles.SectionStyle}>
      <Button
        style={styles.buttonStyle}
        textColor={AccentColor}
        mode='text'
        onPress={onPress}
        disabled={disabled}
      >
        {displayText}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonStyle: {
    fontSize: 10,
    backgroundColor: BasicColor,
    color: AccentColor,
    borderWidth: 2,
    borderColor: AccentColor,
    height: 40,
    alignItems: 'center',
  },
});