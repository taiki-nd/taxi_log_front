import { View, StyleSheet } from 'react-native';
import { Provider, Portal, Dialog, Paragraph, Button } from 'react-native-paper';
import { BasicColor, CoverColor, SeaColor } from '../../styles/common/color';

export const DialogOneButton = (props: any) => {
  const {title, description, displayButton1, visible, funcButton1, onDismiss } = props;
  return (
    <Provider>
        <View>
          <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
              <Dialog.Title style={styles.text}>{title}</Dialog.Title>
              <Dialog.Content>
                <Paragraph style={styles.text}>{description}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={funcButton1} textColor={SeaColor}>{displayButton1}</Button>
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