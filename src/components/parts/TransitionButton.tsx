import { Text, StyleSheet } from 'react-native';
import { AccentColor, BasicColor } from '../../styles/common/color';

export const TransitionButton = (props: any) => {

  const { navigation, screen } = props;

  const moveScreen = (screen: any) => {
    navigation.reset({
      index: 0,
      routes: [{ name: screen }]
    });
  }

  return (
    <Text
      onPress={() => moveScreen(screen)}
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