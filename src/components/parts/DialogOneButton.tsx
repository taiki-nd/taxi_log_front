import { View } from 'react-native';
import { Provider, Portal, Dialog, Paragraph, Button } from 'react-native-paper';

export const DialogOneButton = (props: any) => {
  const {title, description, displayButton1, visible, funcButton1, onDismiss } = props;
  return (
    <Provider>
        <View>
          <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Content>
                <Paragraph>{description}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={funcButton1}>{displayButton1}</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </Provider>
  );
}