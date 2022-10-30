import { View } from 'react-native';
import { Provider, Portal, Dialog, Paragraph, Button } from 'react-native-paper';

export const DialogTwoButton = (props: any) => {
  const {title, description, displayButton1, displayButton2, visible, funcButton1, funcButton2 } = props;
  return (
    <Provider>
        <View>
          <Portal>
            <Dialog visible={visible} onDismiss={funcButton2}>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Content>
                <Paragraph>{description}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={funcButton1}>{displayButton1}</Button>
                <Button onPress={funcButton2}>{displayButton2}</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </Provider>
  );
}