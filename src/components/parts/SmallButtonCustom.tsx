import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { AccentColor, BasicColor } from '../../styles/common/color';

export const SmallButtonCustom = (props: any) => {
  const {displayText, color, disabled, onPress} = props;
  return (
    <View style={styles.SectionStyle}>
      <Button
        style={{borderColor: color}}
        textColor={color}
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
    fontSize: 8,
    alignItems: 'center',
  },
});