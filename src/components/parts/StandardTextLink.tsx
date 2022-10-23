import { Text , StyleSheet} from 'react-native';
import { BasicColor } from '../../styles/common/color';

export const StandardTextLink = (props: any) => {
  const {displayText, onPress} = props;
  console.log(onPress);
  return (
    <Text
      style={styles.registerTextStyle}
      onPress={onPress}>
      {displayText}
    </Text>
  );
}

const styles = StyleSheet.create({
  registerTextStyle: {
    color: BasicColor,
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center',
    padding: 10,
  }
});