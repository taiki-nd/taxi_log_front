import { Text, StyleSheet } from 'react-native';
import { AccentColor, BasicColor } from '../../styles/common/color';

export const TransitionButton = (props: any) => {
  return (
    <Text
      onPress={() => props.navigation.navigate(props.screen, props.postInfo)}
      style={styles.transition_button}
    >
      {props.display}
    </Text>
  );
}

const styles = StyleSheet.create({
  transition_button: {
    alignSelf: "center",
    backgroundColor: BasicColor,
    color: AccentColor,
    padding: 5,
  }
});