import { View, StyleSheet } from 'react-native';
import { Provider, Portal, Dialog, Paragraph, Button } from 'react-native-paper';
import { BasicColor, CoverColor, SeaColor, TomatoColor } from '../../styles/common/color';

export const DialogTwoButton = (props: any) => {
  const {title, description, displayButton1, displayButton2, visible, funcButton1, funcButton2, onDismiss } = props;
  return (
    <Provider>
        <View>
          <Portal>
            <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
              <Dialog.Title style={styles.text}>{title}</Dialog.Title>
              <Dialog.Content>
                <Paragraph style={styles.text}>{description}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={funcButton1} textColor={SeaColor}>{displayButton1}</Button>
                <Button onPress={funcButton2} textColor={TomatoColor}>{displayButton2}</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </Provider>
  );
}

const styles = StyleSheet.create({
  text :{
    color: BasicColor,
  },
  dialog: {
    backgroundColor: CoverColor,
  }
});