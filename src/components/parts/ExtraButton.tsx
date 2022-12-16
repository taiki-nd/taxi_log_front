import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { AccentColor, BasicColor, TomatoColor } from '../../styles/common/color';

export const ExtraButton = (props: any) => {
  const {displayText, disabled, onPress} = props;
  return (
    <View style={styles.SectionStyle}>
      <Button
        style={styles.buttonStyle}
        textColor={BasicColor}
        mode="contained-tonal"
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
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
    justifyContent: 'center',
  },
  buttonStyle: {
    backgroundColor: TomatoColor,
    borderWidth: 2,
    borderColor: BasicColor,
    height: 40,
    alignItems: 'center',
  },
});